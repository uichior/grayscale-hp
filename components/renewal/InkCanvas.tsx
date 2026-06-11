'use client'

/**
 * InkCanvas — WebGL 流体シミュレーション「墨流し」
 *
 * アルゴリズム構成は Pavel Dobryakov の WebGL-Fluid-Simulation（MIT）を参考にした。
 * 実装は自前で書き直している。
 * 手法: stable fluids（GPU Gems 3, Chapter 38）
 *   advection → curl/vorticity → divergence → pressure Jacobi 反復 → gradient subtract → dye splat
 *
 * 設計方針:
 *   - Three.js 禁止、素の WebGL1 + OES_texture_half_float 拡張
 *   - SSR 時は null を返す
 *   - prefers-reduced-motion: reduce → null を返す
 *   - WebGL 未対応/コンテキスト喪失 → 安全に null 化・エラーをthrowしない
 *   - 初期化は requestIdleCallback（フォールバック setTimeout 200ms）で遅延
 *   - IntersectionObserver でヒーロー外→RAF停止
 *   - document.visibilitychange でタブ非表示時→RAF停止
 *   - アンマウント時に全GLリソース・RAF・listener を破棄
 *   - aria-hidden="true"、pointer-events: none。座標は window の pointermove/click で取得
 */

import { useEffect, useRef } from 'react'

// ──────────────────────────────────────────────
//  定数・パラメータ（ここを調整するとビジュアルが変わる）
// ──────────────────────────────────────────────
const SIM_RESOLUTION = 128       // 速度場解像度
const DYE_RESOLUTION_DESKTOP = 720  // 染料場解像度（デスクトップ）
const DYE_RESOLUTION_MOBILE = 512   // 染料場解像度（モバイル）
const JACOBI_ITERATIONS = 20       // 圧力 Jacobi 反復回数
const VELOCITY_DISSIPATION = 0.98   // 速度場の減衰（小さいほど早く消える）
const DENSITY_DISSIPATION = 0.990  // 染料の減衰（大きいほど長く漂う）
const VORTICITY_STRENGTH = 15       // 渦巻き強さ
const CURL_STRENGTH = 0.3           // curl 計算係数

// 墨の色（FAFAFA 背景に対して暗い）。最大濃度 ~70% で text より薄く
// orange フラグで墨 or オレンジを区別
const INK_COLOR    = { r: 0.28, g: 0.28, b: 0.28, orange: false }
const ORANGE_COLOR = { r: 0.40, g: 0.25, b: 0.0,  orange: true  }

const AUTO_DROP_INTERVAL_MIN = 8000   // 自動ドロップ最短間隔 ms
const AUTO_DROP_INTERVAL_MAX = 15000  // 自動ドロップ最長間隔 ms
const INITIAL_DROPS = 3               // 初回マウント時の自動ドロップ数

const MAX_DPR = 1.5  // devicePixelRatio の上限

// ──────────────────────────────────────────────
//  GLSL シェーダー文字列
// ──────────────────────────────────────────────

const baseVertSrc = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

// コピー（パススルー）
const copyFragSrc = `
  precision highp float;
  uniform sampler2D u_texture;
  varying vec2 v_uv;
  void main() {
    gl_FragColor = texture2D(u_texture, v_uv);
  }
`

// advection（速度・染料の移流）
const advectionFragSrc = `
  precision highp float;
  uniform sampler2D u_velocity;
  uniform sampler2D u_source;
  uniform vec2 u_texelSize;
  uniform float u_dt;
  uniform float u_dissipation;
  varying vec2 v_uv;
  void main() {
    vec2 vel = texture2D(u_velocity, v_uv).xy;
    vec2 coord = v_uv - vel * u_dt * u_texelSize;
    gl_FragColor = u_dissipation * texture2D(u_source, coord);
  }
`

// divergence（発散）
const divergenceFragSrc = `
  precision highp float;
  uniform sampler2D u_velocity;
  uniform vec2 u_texelSize;
  varying vec2 v_uv;
  void main() {
    float L = texture2D(u_velocity, v_uv - vec2(u_texelSize.x, 0.0)).x;
    float R = texture2D(u_velocity, v_uv + vec2(u_texelSize.x, 0.0)).x;
    float T = texture2D(u_velocity, v_uv + vec2(0.0, u_texelSize.y)).y;
    float B = texture2D(u_velocity, v_uv - vec2(0.0, u_texelSize.y)).y;
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`

// pressure Jacobi 反復
const pressureFragSrc = `
  precision highp float;
  uniform sampler2D u_pressure;
  uniform sampler2D u_divergence;
  uniform vec2 u_texelSize;
  varying vec2 v_uv;
  void main() {
    float L = texture2D(u_pressure, v_uv - vec2(u_texelSize.x, 0.0)).x;
    float R = texture2D(u_pressure, v_uv + vec2(u_texelSize.x, 0.0)).x;
    float T = texture2D(u_pressure, v_uv + vec2(0.0, u_texelSize.y)).x;
    float B = texture2D(u_pressure, v_uv - vec2(0.0, u_texelSize.y)).x;
    float div = texture2D(u_divergence, v_uv).x;
    float pressure = (L + R + T + B - div) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`

// gradient subtract（圧力勾配を速度から引く）
const gradSubtractFragSrc = `
  precision highp float;
  uniform sampler2D u_pressure;
  uniform sampler2D u_velocity;
  uniform vec2 u_texelSize;
  varying vec2 v_uv;
  void main() {
    float L = texture2D(u_pressure, v_uv - vec2(u_texelSize.x, 0.0)).x;
    float R = texture2D(u_pressure, v_uv + vec2(u_texelSize.x, 0.0)).x;
    float T = texture2D(u_pressure, v_uv + vec2(0.0, u_texelSize.y)).x;
    float B = texture2D(u_pressure, v_uv - vec2(0.0, u_texelSize.y)).x;
    vec2 vel = texture2D(u_velocity, v_uv).xy;
    vel -= 0.5 * vec2(R - L, T - B);
    gl_FragColor = vec4(vel, 0.0, 1.0);
  }
`

// curl（渦）計算
const curlFragSrc = `
  precision highp float;
  uniform sampler2D u_velocity;
  uniform vec2 u_texelSize;
  varying vec2 v_uv;
  void main() {
    float L = texture2D(u_velocity, v_uv - vec2(u_texelSize.x, 0.0)).y;
    float R = texture2D(u_velocity, v_uv + vec2(u_texelSize.x, 0.0)).y;
    float T = texture2D(u_velocity, v_uv + vec2(0.0, u_texelSize.y)).x;
    float B = texture2D(u_velocity, v_uv - vec2(0.0, u_texelSize.y)).x;
    float curl = 0.5 * (R - L - T + B);
    gl_FragColor = vec4(curl, 0.0, 0.0, 1.0);
  }
`

// vorticity（渦巻き力を速度に追加）
const vorticityFragSrc = `
  precision highp float;
  uniform sampler2D u_velocity;
  uniform sampler2D u_curl;
  uniform vec2 u_texelSize;
  uniform float u_curlStrength;
  uniform float u_dt;
  varying vec2 v_uv;
  void main() {
    float L = texture2D(u_curl, v_uv - vec2(u_texelSize.x, 0.0)).x;
    float R = texture2D(u_curl, v_uv + vec2(u_texelSize.x, 0.0)).x;
    float T = texture2D(u_curl, v_uv + vec2(0.0, u_texelSize.y)).x;
    float B = texture2D(u_curl, v_uv - vec2(0.0, u_texelSize.y)).x;
    float C = texture2D(u_curl, v_uv).x;
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= u_curlStrength * C;
    vec2 vel = texture2D(u_velocity, v_uv).xy;
    gl_FragColor = vec4(vel + force * u_dt, 0.0, 1.0);
  }
`

// dye splat（墨の一滴）
const splatFragSrc = `
  precision highp float;
  uniform sampler2D u_target;
  uniform vec2 u_center;
  uniform vec3 u_color;
  uniform float u_radius;
  uniform bool u_isVelocity;
  varying vec2 v_uv;
  void main() {
    vec2 d = v_uv - u_center;
    float splat = exp(-dot(d, d) / u_radius);
    vec4 base = texture2D(u_target, v_uv);
    vec3 result = base.xyz + splat * u_color;
    gl_FragColor = vec4(result, 1.0);
  }
`

// 最終描画（染料テクスチャを FAFAFA 背景に墨色でオーバーレイ）
const displayFragSrc = `
  precision highp float;
  uniform sampler2D u_dye;
  varying vec2 v_uv;
  void main() {
    vec4 dye = texture2D(u_dye, v_uv);
    // 背景 #FAFAFA = (0.98, 0.98, 0.98)。墨は暗い色として dye をオーバーレイ
    vec3 bg = vec3(0.98, 0.98, 0.98);
    // dye.xyz はすでに暗い色なので、そのまま乗算（dye が 0 なら bg、1なら純黒に近い）
    // 墨: 最大濃度 55%（文字(純黒)の下に従う）
    vec3 col = mix(bg, vec3(0.0), clamp(dye.x * 2.0, 0.0, 0.55));
    // オレンジ: 控えめに max 45%
    col = mix(col, vec3(1.0, 0.30, 0.0), clamp(dye.y * 2.0, 0.0, 0.45));
    gl_FragColor = vec4(col, 1.0);
  }
`

// ──────────────────────────────────────────────
//  ユーティリティ型・関数
// ──────────────────────────────────────────────

interface FBO {
  texture: WebGLTexture
  fbo: WebGLFramebuffer
  width: number
  height: number
  attach: (unit: number) => number
}

interface DoubleFBO {
  read: FBO
  write: FBO
  swap: () => void
}

function createShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('[InkCanvas] shader compile error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function createProgram(gl: WebGLRenderingContext, vertSrc: string, fragSrc: string): WebGLProgram | null {
  const vert = createShader(gl, gl.VERTEX_SHADER, vertSrc)
  const frag = createShader(gl, gl.FRAGMENT_SHADER, fragSrc)
  if (!vert || !frag) return null
  const prog = gl.createProgram()
  if (!prog) return null
  gl.attachShader(prog, vert)
  gl.attachShader(prog, frag)
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn('[InkCanvas] program link error:', gl.getProgramInfoLog(prog))
    gl.deleteProgram(prog)
    return null
  }
  // シェーダーはリンク後に不要
  gl.deleteShader(vert)
  gl.deleteShader(frag)
  return prog
}

// ──────────────────────────────────────────────
//  メインコンポーネント
// ──────────────────────────────────────────────

export function InkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // クリーンアップ用 ref
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    // SSR ガード（念のため）
    if (typeof window === 'undefined') return

    // prefers-reduced-motion ガード
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return

    let destroyed = false

    // requestIdleCallback で遅延初期化（LCP ブロック防止）
    const riceId =
      typeof requestIdleCallback !== 'undefined'
        ? requestIdleCallback(init, { timeout: 500 })
        : (setTimeout(init, 200) as unknown as number)

    function init() {
      if (destroyed || !canvas) return

      // ── WebGL コンテキスト取得 ──
      let gl: WebGLRenderingContext | null = null
      try {
        gl = canvas.getContext('webgl', {
          alpha: false,
          depth: false,
          stencil: false,
          antialias: false,
          preserveDrawingBuffer: false,
        }) as WebGLRenderingContext | null
      } catch (_) {
        return
      }
      if (!gl) return

      const GL = gl  // TypeScript の null-narrowing 用

      // half_float 拡張（なければ FLOAT にフォールバック）
      const extHalfFloat = GL.getExtension('OES_texture_half_float')
      const extHalfFloatLinear = GL.getExtension('OES_texture_half_float_linear')
      const halfFloatType = extHalfFloat ? extHalfFloat.HALF_FLOAT_OES : GL.UNSIGNED_BYTE
      const filterType = extHalfFloatLinear ? GL.LINEAR : GL.NEAREST

      // ── FBO ユーティリティ ──
      function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, filter: number): FBO | null {
        const texture = GL.createTexture()
        if (!texture) return null
        GL.bindTexture(GL.TEXTURE_2D, texture)
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, filter)
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, filter)
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)
        GL.texImage2D(GL.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null)

        const fbo = GL.createFramebuffer()
        if (!fbo) { GL.deleteTexture(texture); return null }
        GL.bindFramebuffer(GL.FRAMEBUFFER, fbo)
        GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, texture, 0)
        GL.viewport(0, 0, w, h)
        GL.clear(GL.COLOR_BUFFER_BIT)

        const obj: FBO = {
          texture,
          fbo,
          width: w,
          height: h,
          attach(unit: number) {
            GL.activeTexture(GL.TEXTURE0 + unit)
            GL.bindTexture(GL.TEXTURE_2D, texture)
            return unit
          },
        }
        return obj
      }

      function createDoubleFBO(w: number, h: number, iFormat: number, format: number, type: number, filter: number): DoubleFBO | null {
        const a = createFBO(w, h, iFormat, format, type, filter)
        const b = createFBO(w, h, iFormat, format, type, filter)
        if (!a || !b) return null
        return {
          read: a,
          write: b,
          swap() { const tmp = this.read; this.read = this.write; this.write = tmp },
        }
      }

      // ── シェーダープログラム群 ──
      const progCopy      = createProgram(GL, baseVertSrc, copyFragSrc)
      const progAdvection = createProgram(GL, baseVertSrc, advectionFragSrc)
      const progDivergence = createProgram(GL, baseVertSrc, divergenceFragSrc)
      const progPressure  = createProgram(GL, baseVertSrc, pressureFragSrc)
      const progGradSub   = createProgram(GL, baseVertSrc, gradSubtractFragSrc)
      const progCurl      = createProgram(GL, baseVertSrc, curlFragSrc)
      const progVorticity = createProgram(GL, baseVertSrc, vorticityFragSrc)
      const progSplat     = createProgram(GL, baseVertSrc, splatFragSrc)
      const progDisplay   = createProgram(GL, baseVertSrc, displayFragSrc)

      if (!progCopy || !progAdvection || !progDivergence || !progPressure ||
          !progGradSub || !progCurl || !progVorticity || !progSplat || !progDisplay) {
        return
      }

      // ── フルスクリーン quad ──
      const quadBuf = GL.createBuffer()
      GL.bindBuffer(GL.ARRAY_BUFFER, quadBuf)
      GL.bufferData(GL.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), GL.STATIC_DRAW)

      function bindQuad(prog: WebGLProgram) {
        GL.bindBuffer(GL.ARRAY_BUFFER, quadBuf)
        const loc = GL.getAttribLocation(prog, 'a_position')
        GL.enableVertexAttribArray(loc)
        GL.vertexAttribPointer(loc, 2, GL.FLOAT, false, 0, 0)
      }

      // ── キャンバスサイズ設定 ──
      function getSimRes(base: number) {
        const aspect = canvas!.width / canvas!.height
        return aspect > 1
          ? { w: Math.round(base * aspect), h: base }
          : { w: base, h: Math.round(base / aspect) }
      }

      const isMobile = window.innerWidth < 768
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      const dyeRes = isMobile ? DYE_RESOLUTION_MOBILE : DYE_RESOLUTION_DESKTOP

      function resizeCanvas() {
        if (!canvas) return
        canvas.width = canvas.clientWidth * dpr
        canvas.height = canvas.clientHeight * dpr
      }
      resizeCanvas()

      const simRes = getSimRes(SIM_RESOLUTION)
      const dyeResObj = getSimRes(dyeRes)

      // ── FBO 生成 ──
      const velocityFBO  = createDoubleFBO(simRes.w, simRes.h, GL.RGBA, GL.RGBA, halfFloatType, filterType)
      const dyeFBO       = createDoubleFBO(dyeResObj.w, dyeResObj.h, GL.RGBA, GL.RGBA, halfFloatType, filterType)
      const divergenceFBO = createFBO(simRes.w, simRes.h, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, GL.NEAREST)
      const curlFBO       = createFBO(simRes.w, simRes.h, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, GL.NEAREST)
      const pressureFBO  = createDoubleFBO(simRes.w, simRes.h, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, GL.NEAREST)

      if (!velocityFBO || !dyeFBO || !divergenceFBO || !curlFBO || !pressureFBO) return

      const simTexelSize = { x: 1 / simRes.w, y: 1 / simRes.h }
      const dyeTexelSize = { x: 1 / dyeResObj.w, y: 1 / dyeResObj.h }

      // ── 描画ユーティリティ ──
      function blit(target: FBO | null) {
        if (target) {
          GL.bindFramebuffer(GL.FRAMEBUFFER, target.fbo)
          GL.viewport(0, 0, target.width, target.height)
        } else {
          GL.bindFramebuffer(GL.FRAMEBUFFER, null)
          GL.viewport(0, 0, canvas!.width, canvas!.height)
        }
        GL.drawArrays(GL.TRIANGLE_STRIP, 0, 4)
      }

      // ── Splat（墨の一滴/マウス） ──
      function splat(
        x: number, y: number,     // 0..1 normalized (左下原点)
        vx: number, vy: number,
        color: { r: number; g: number; b: number; orange?: boolean },
        velRadius: number,
        dyeRadius: number,
      ) {
        // 速度場への splat
        GL.useProgram(progSplat)
        bindQuad(progSplat!)
        GL.uniform1i(GL.getUniformLocation(progSplat!, 'u_target'), velocityFBO!.read.attach(0))
        GL.uniform2f(GL.getUniformLocation(progSplat!, 'u_center'), x, y)
        GL.uniform3f(GL.getUniformLocation(progSplat!, 'u_color'), vx, vy, 0)
        GL.uniform1f(GL.getUniformLocation(progSplat!, 'u_radius'), velRadius)
        GL.uniform1i(GL.getUniformLocation(progSplat!, 'u_isVelocity'), 1)
        blit(velocityFBO!.write)
        velocityFBO!.swap()

        // 染料場への splat
        GL.uniform1i(GL.getUniformLocation(progSplat!, 'u_target'), dyeFBO!.read.attach(0))
        GL.uniform2f(GL.getUniformLocation(progSplat!, 'u_center'), x, y)
        // 墨: dye.x チャンネル / オレンジ: dye.y チャンネル（分離管理）
        const isOrange = color.orange === true
        GL.uniform3f(GL.getUniformLocation(progSplat!, 'u_color'),
          isOrange ? 0 : color.r,     // dye.x = 墨濃度
          isOrange ? color.r : 0,     // dye.y = オレンジ濃度
          0
        )
        GL.uniform1f(GL.getUniformLocation(progSplat!, 'u_radius'), dyeRadius)
        GL.uniform1i(GL.getUniformLocation(progSplat!, 'u_isVelocity'), 0)
        blit(dyeFBO!.write)
        dyeFBO!.swap()
      }

      // ── 自動ドロップ ──
      let clickCount = 0

      function autoDrop(large = false) {
        const x = 0.15 + Math.random() * 0.7
        const y = 0.2 + Math.random() * 0.6
        // 10回に1回オレンジ
        clickCount++
        const color = clickCount % 10 === 0 ? ORANGE_COLOR : INK_COLOR
        // radius: exp(-d²/r) の r。大きいほど広く滲む
        // large: 0.008 → UV空間で sqrt(0.008)≈0.09幅 (9%)。720px×9%≈65px
        const radius = large ? 0.008 : 0.004
        splat(x, y, 0, 0, color, 0.00001, radius)
      }

      // 初回ドロップ（画が成立するように）
      for (let i = 0; i < INITIAL_DROPS; i++) {
        setTimeout(() => { if (!destroyed) autoDrop(true) }, 100 + i * 400)
      }

      // 自動ドロップループ
      let autoDropTimer: ReturnType<typeof setTimeout> | null = null
      function scheduleAutoDrop() {
        if (destroyed) return
        const delay = AUTO_DROP_INTERVAL_MIN + Math.random() * (AUTO_DROP_INTERVAL_MAX - AUTO_DROP_INTERVAL_MIN)
        autoDropTimer = setTimeout(() => {
          if (!destroyed) {
            autoDrop(true)
            scheduleAutoDrop()
          }
        }, delay)
      }
      scheduleAutoDrop()

      // ── マウス / タッチ入力 ──
      let lastX = -1, lastY = -1

      function toNormalizedCoords(clientX: number, clientY: number): { x: number; y: number; ok: boolean } {
        if (!canvas) return { x: 0, y: 0, ok: false }
        const rect = canvas.getBoundingClientRect()
        // ヒーロー領域内チェック
        if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
          return { x: 0, y: 0, ok: false }
        }
        const x = (clientX - rect.left) / rect.width
        const y = 1 - (clientY - rect.top) / rect.height  // WebGL は左下原点
        return { x, y, ok: true }
      }

      function onPointerMove(e: PointerEvent) {
        const { x, y, ok } = toNormalizedCoords(e.clientX, e.clientY)
        if (!ok) { lastX = -1; lastY = -1; return }

        if (lastX < 0) { lastX = x; lastY = y; return }
        const dx = x - lastX
        const dy = y - lastY
        lastX = x; lastY = y

        const speed = Math.sqrt(dx * dx + dy * dy)
        if (speed < 0.0005) return  // 微小移動は無視

        const velScale = 500
        // マウス軌跡: 細い筆跡 dyeRadius=0.0015
        splat(x, y, dx * velScale, dy * velScale, INK_COLOR, 0.0002, 0.0015)
      }

      function onPointerClick(e: MouseEvent) {
        const { x, y, ok } = toNormalizedCoords(e.clientX, e.clientY)
        if (!ok) return
        clickCount++
        const color = clickCount % 10 === 0 ? ORANGE_COLOR : INK_COLOR
        // クリック: 大きめの一滴 dyeRadius=0.012
        splat(x, y, 0, 0, color, 0.0001, 0.012)
      }

      function onTouchStart(e: TouchEvent) {
        const touch = e.touches[0]
        if (!touch) return
        const { x, y, ok } = toNormalizedCoords(touch.clientX, touch.clientY)
        if (!ok) return
        clickCount++
        const color = clickCount % 10 === 0 ? ORANGE_COLOR : INK_COLOR
        splat(x, y, 0, 0, color, 0.0001, 0.012)
      }

      window.addEventListener('pointermove', onPointerMove, { passive: true })
      window.addEventListener('click', onPointerClick, { passive: true })
      window.addEventListener('touchstart', onTouchStart, { passive: true })

      // ── シミュレーションステップ ──
      let lastTime = performance.now()

      function step() {
        const now = performance.now()
        const dt = Math.min((now - lastTime) / 1000, 0.016)  // 最大 16ms
        lastTime = now

        // 1. Curl
        GL.useProgram(progCurl)
        bindQuad(progCurl!)
        GL.uniform1i(GL.getUniformLocation(progCurl!, 'u_velocity'), velocityFBO!.read.attach(0))
        GL.uniform2f(GL.getUniformLocation(progCurl!, 'u_texelSize'), simTexelSize.x, simTexelSize.y)
        blit(curlFBO)

        // 2. Vorticity
        GL.useProgram(progVorticity)
        bindQuad(progVorticity!)
        GL.uniform1i(GL.getUniformLocation(progVorticity!, 'u_velocity'), velocityFBO!.read.attach(0))
        GL.uniform1i(GL.getUniformLocation(progVorticity!, 'u_curl'), curlFBO!.attach(1))
        GL.uniform2f(GL.getUniformLocation(progVorticity!, 'u_texelSize'), simTexelSize.x, simTexelSize.y)
        GL.uniform1f(GL.getUniformLocation(progVorticity!, 'u_curlStrength'), CURL_STRENGTH)
        GL.uniform1f(GL.getUniformLocation(progVorticity!, 'u_dt'), dt)
        blit(velocityFBO!.write)
        velocityFBO!.swap()

        // 3. Advect velocity
        GL.useProgram(progAdvection)
        bindQuad(progAdvection!)
        GL.uniform1i(GL.getUniformLocation(progAdvection!, 'u_velocity'), velocityFBO!.read.attach(0))
        GL.uniform1i(GL.getUniformLocation(progAdvection!, 'u_source'), velocityFBO!.read.attach(0))
        GL.uniform2f(GL.getUniformLocation(progAdvection!, 'u_texelSize'), simTexelSize.x, simTexelSize.y)
        GL.uniform1f(GL.getUniformLocation(progAdvection!, 'u_dt'), dt)
        GL.uniform1f(GL.getUniformLocation(progAdvection!, 'u_dissipation'), VELOCITY_DISSIPATION)
        blit(velocityFBO!.write)
        velocityFBO!.swap()

        // 4. Divergence
        GL.useProgram(progDivergence)
        bindQuad(progDivergence!)
        GL.uniform1i(GL.getUniformLocation(progDivergence!, 'u_velocity'), velocityFBO!.read.attach(0))
        GL.uniform2f(GL.getUniformLocation(progDivergence!, 'u_texelSize'), simTexelSize.x, simTexelSize.y)
        blit(divergenceFBO)

        // 5. Pressure Jacobi
        for (let i = 0; i < JACOBI_ITERATIONS; i++) {
          GL.useProgram(progPressure)
          bindQuad(progPressure!)
          GL.uniform1i(GL.getUniformLocation(progPressure!, 'u_pressure'), pressureFBO!.read.attach(0))
          GL.uniform1i(GL.getUniformLocation(progPressure!, 'u_divergence'), divergenceFBO!.attach(1))
          GL.uniform2f(GL.getUniformLocation(progPressure!, 'u_texelSize'), simTexelSize.x, simTexelSize.y)
          blit(pressureFBO!.write)
          pressureFBO!.swap()
        }

        // 6. Gradient subtract
        GL.useProgram(progGradSub)
        bindQuad(progGradSub!)
        GL.uniform1i(GL.getUniformLocation(progGradSub!, 'u_pressure'), pressureFBO!.read.attach(0))
        GL.uniform1i(GL.getUniformLocation(progGradSub!, 'u_velocity'), velocityFBO!.read.attach(1))
        GL.uniform2f(GL.getUniformLocation(progGradSub!, 'u_texelSize'), simTexelSize.x, simTexelSize.y)
        blit(velocityFBO!.write)
        velocityFBO!.swap()

        // 7. Advect dye
        GL.useProgram(progAdvection)
        bindQuad(progAdvection!)
        GL.uniform1i(GL.getUniformLocation(progAdvection!, 'u_velocity'), velocityFBO!.read.attach(0))
        GL.uniform1i(GL.getUniformLocation(progAdvection!, 'u_source'), dyeFBO!.read.attach(1))
        GL.uniform2f(GL.getUniformLocation(progAdvection!, 'u_texelSize'), dyeTexelSize.x, dyeTexelSize.y)
        GL.uniform1f(GL.getUniformLocation(progAdvection!, 'u_dt'), dt)
        GL.uniform1f(GL.getUniformLocation(progAdvection!, 'u_dissipation'), DENSITY_DISSIPATION)
        blit(dyeFBO!.write)
        dyeFBO!.swap()
      }

      // ── 最終描画 ──
      function render() {
        GL.useProgram(progDisplay)
        bindQuad(progDisplay!)
        GL.uniform1i(GL.getUniformLocation(progDisplay!, 'u_dye'), dyeFBO!.read.attach(0))
        blit(null)
      }

      // ── RAF ループ ──
      let rafId = 0
      let isVisible = true
      let isInView = true

      function loop() {
        if (destroyed) return
        if (isVisible && isInView) {
          step()
          render()
        }
        rafId = requestAnimationFrame(loop)
      }
      rafId = requestAnimationFrame(loop)

      // ── visibilitychange ──
      function onVisibility() {
        isVisible = !document.hidden
      }
      document.addEventListener('visibilitychange', onVisibility)

      // ── IntersectionObserver（ヒーロー外でRAF停止） ──
      let observer: IntersectionObserver | null = null
      if (canvas.parentElement) {
        observer = new IntersectionObserver(
          entries => { isInView = entries[0]?.isIntersecting ?? true },
          { threshold: 0 }
        )
        observer.observe(canvas.parentElement)
      }

      // ── webglcontextlost ──
      function onContextLost(e: Event) {
        e.preventDefault()
        destroyed = true
        cancelAnimationFrame(rafId)
      }
      canvas.addEventListener('webglcontextlost', onContextLost)

      // ── クリーンアップ ──
      cleanupRef.current = () => {
        destroyed = true
        cancelAnimationFrame(rafId)
        if (typeof riceId !== 'undefined') {
          if (typeof requestIdleCallback !== 'undefined') cancelIdleCallback(riceId)
          else clearTimeout(riceId)
        }
        if (autoDropTimer) clearTimeout(autoDropTimer)
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('click', onPointerClick)
        window.removeEventListener('touchstart', onTouchStart)
        document.removeEventListener('visibilitychange', onVisibility)
        canvas?.removeEventListener('webglcontextlost', onContextLost)
        observer?.disconnect()

        // GL リソース解放
        try {
          GL.deleteBuffer(quadBuf)
          ;[progCopy, progAdvection, progDivergence, progPressure,
            progGradSub, progCurl, progVorticity, progSplat, progDisplay]
            .forEach(p => p && GL.deleteProgram(p))
          ;[velocityFBO?.read, velocityFBO?.write,
            dyeFBO?.read, dyeFBO?.write,
            divergenceFBO, curlFBO,
            pressureFBO?.read, pressureFBO?.write]
            .forEach(fbo => {
              if (!fbo) return
              GL.deleteTexture(fbo.texture)
              GL.deleteFramebuffer(fbo.fbo)
            })
        } catch (_) { /* ignore */ }
      }
    }  // end init()

    return () => {
      destroyed = true
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
      // riceId クリーンアップ（init より前にアンマウントした場合）
      if (typeof requestIdleCallback !== 'undefined') cancelIdleCallback(riceId)
      else clearTimeout(riceId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block', pointerEvents: 'none' }}
    />
  )
}
