'use client'

import { useEffect } from 'react'

/**
 * RainRipple — ヒーロー背景の「水面に落ちる雨」WebGL リップル。
 *
 * 画面を真上から見た水面に見立て、雨だれが落ちて同心円の波紋が
 * リアルに広がり減衰する様子を heightfield ripple 法で描画する。
 *
 *  - 2 枚の高さ場テクスチャを ping-pong しながら波動方程式で更新
 *  - 高さの傾き（法線）で背景グラデを屈折 → 水っぽさの主役
 *  - 傾きから真鍮色の擬似スペキュラを加算 → 光のキラ
 *  - 雨だれは自動で落下（カーソル追従なし）。スマホでも自立して映える
 *
 * 世界観: ベージュ #F4F1EA × 真鍮 #9B7B45 を継承。
 * prefers-reduced-motion: reduce では静止した水面を 1 枚だけ描いて止める。
 *
 * 既存の煙演出（GrayscaleV2 の data-ink）は温存し、こちらは別レイヤー。
 */

// 水面ベース（深い墨色）と反射する光（真鍮）
const DEEP = { r: 0.102, g: 0.090, b: 0.071 }     // #1A1712 ブランドの墨
const BRASS = { r: 0.706, g: 0.557, b: 0.318 }    // #B48E51 やや明るい真鍮

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

// ── 波の更新パス（heightfield, ping-pong） ──────────────────
// prev: 前々フレーム高さ, curr: 前フレーム高さ。波動方程式 + 減衰。
// 高さは正負に振れるが UNSIGNED_BYTE テクスチャは 0..1 しか持てない。
// 符号付き値を 0.5 中心にエンコード/デコードして全端末で確実に動かす。
const SIM_FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uPrev;
uniform sampler2D uCurr;
uniform vec2 uTexel;
uniform float uDamp;
// 雨だれ: 最大 4 滴を同時に打ち込む
uniform vec3 uDrops[4]; // xy=位置(0-1), z=強さ(<=0 で無効)
float dec(vec4 c) { return c.r - 0.5; }
void main() {
  float prev = dec(texture2D(uPrev, vUv));
  float l = dec(texture2D(uCurr, vUv + vec2(-uTexel.x, 0.0)));
  float r = dec(texture2D(uCurr, vUv + vec2( uTexel.x, 0.0)));
  float u = dec(texture2D(uCurr, vUv + vec2(0.0,  uTexel.y)));
  float d = dec(texture2D(uCurr, vUv + vec2(0.0, -uTexel.y)));
  float next = (l + r + u + d) * 0.5 - prev;
  next *= uDamp; // 減衰（波が静まっていく）

  // 雨だれを高さ場に打ち込む（ガウシアンの窪み）
  for (int i = 0; i < 4; i++) {
    if (uDrops[i].z > 0.0) {
      float dist = distance(vUv, uDrops[i].xy);
      next -= uDrops[i].z * exp(-dist * dist * 1300.0);
    }
  }
  next = clamp(next, -0.5, 0.5);
  gl_FragColor = vec4(next + 0.5, 0.0, 0.0, 1.0);
}
`

// ── 描画パス: 暗い水面に雨の波紋。法線でライティング ──────────
// 背景は深い墨色の水面。波の斜面に真鍮の光が反射してリングが浮かぶ。
const RENDER_FRAG = `
precision highp float;
// ── 常時さざ波（ハイブリッド）の調整値 ───────────────────
// ゆちゃんと詰める用に切り出し。雫の波紋とは独立した「水面のそよぎ」。
#define RIPPLE_AMP   0.08   // さざ波の強さ（大きいほどプルプル。0で無効）
#define RIPPLE_SCALE 3.2    // さざ波の細かさ（大きいほど目が細かい）
#define RIPPLE_SPEED 0.10   // さざ波の流れる速さ（大きいほど速い）
varying vec2 vUv;
uniform sampler2D uHeight;
uniform vec2 uTexel;
uniform vec2 uAspect;
uniform vec3 uDeep;    // 水面の深い色
uniform vec3 uBrass;   // 反射する光（真鍮）
uniform float uDebug;  // 1.0 で高さ場を生表示
uniform float uTime;   // 経過秒（常時さざ波の位相）
float dec(vec4 c) { return c.r - 0.5; }

// ── 軽量 value ノイズ（依存ライブラリ無し）─────────────────
// 雫の波紋とは別に、水面が常に微かにそよぐ「さざ波」を作るための土台。
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);            // スムーズ補間
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
// 流れる方向の違う 2 枚を重ねた、ゆっくり漂うさざ波の高さ場
float rippleField(vec2 uv, float t) {
  float n = 0.0;
  n += vnoise(uv * RIPPLE_SCALE        + vec2( t * RIPPLE_SPEED, t * RIPPLE_SPEED * 0.6));
  n += vnoise(uv * RIPPLE_SCALE * 1.7  - vec2( t * RIPPLE_SPEED * 0.7, t * RIPPLE_SPEED)) * 0.5;
  return n;
}

void main() {
  // 高さの傾き（法線）を中心差分で取得。係数で増幅して可視化。
  float hl = dec(texture2D(uHeight, vUv + vec2(-uTexel.x, 0.0)));
  float hr = dec(texture2D(uHeight, vUv + vec2( uTexel.x, 0.0)));
  float hu = dec(texture2D(uHeight, vUv + vec2(0.0,  uTexel.y)));
  float hd = dec(texture2D(uHeight, vUv + vec2(0.0, -uTexel.y)));
  if (uDebug > 0.5) {
    float hc = dec(texture2D(uHeight, vUv));
    gl_FragColor = vec4(vec3(0.5 + hc * 4.0), 1.0); // 0付近=灰, 波=明暗
    return;
  }
  // 雫の波紋の勾配（既存）
  vec2 dropGrad = vec2(hl - hr, hd - hu) * 6.0;

  // 常時さざ波の勾配（時間で漂う）。雫とは独立に法線へ加算して
  // 「水面そのものが微かにプルプルしている」質感を出す。
  vec2 sUv = vUv * uAspect;
  float e = 0.0015;
  float rc = rippleField(sUv, uTime);
  float rx = rippleField(sUv + vec2(e, 0.0), uTime) - rc;
  float ry = rippleField(sUv + vec2(0.0, e), uTime) - rc;
  vec2 rippleGrad = vec2(rx, ry) / e * RIPPLE_AMP;

  vec3 normal = normalize(vec3(dropGrad + rippleGrad, 1.0));

  // 斜め上からの光。波の斜面が光を受けてリングが光る。
  vec3 lightDir = normalize(vec3(-0.5, 0.6, 0.7));
  float diff = max(0.0, dot(normal, lightDir));

  // 鏡面反射（ハイライトの芯）— 波のエッジで細く鋭く光る
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 halfDir = normalize(lightDir + viewDir);
  float spec = pow(max(0.0, dot(normal, halfDir)), 90.0);

  // 水面ベース: 中心やや明るい墨色のビネット（主役）
  vec2 c = (vUv - 0.5) * uAspect;
  float vig = 1.0 - smoothstep(0.0, 1.1, length(c));
  vec3 col = uDeep * (0.74 + 0.26 * vig);

  // 波の起伏で生まれる陰影。墨を主役に、真鍮はごく控えめ。
  float slope = length(normal.xy);
  col += uBrass * diff * slope * 0.45;        // 斜面の拡散光（控えめ）
  col += vec3(1.0, 0.95, 0.82) * spec * 1.25; // 鏡面ハイライト（細く鋭い芯）
  col = mix(col, uBrass, slope * 0.05);       // 起伏部にわずかな真鍮味

  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error('[rain] shader compile:', gl.getShaderInfoLog(sh))
    gl.deleteShader(sh)
    return null
  }
  return sh
}

function program(gl: WebGLRenderingContext, frag: string) {
  const vs = compile(gl, gl.VERTEX_SHADER, VERT)
  const fs = compile(gl, gl.FRAGMENT_SHADER, frag)
  if (!vs || !fs) return null
  const p = gl.createProgram()!
  gl.attachShader(p, vs)
  gl.attachShader(p, fs)
  gl.bindAttribLocation(p, 0, 'aPos')
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error('[rain] link:', gl.getProgramInfoLog(p))
    return null
  }
  return p
}

export function useRainRipple(canvas: HTMLCanvasElement | null) {
  useEffect(() => {
    if (!canvas) return
    const cv = canvas
    const glCtx = cv.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false })
    if (!glCtx) { console.warn('[rain] WebGL unavailable'); return }
    const gl: WebGLRenderingContext = glCtx

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // シミュ解像度（描画解像度とは独立。負荷の主因なので控えめ）
    // 高さは UNSIGNED_BYTE に符号付きエンコードして全端末で確実に動かす
    // （FLOAT テクスチャの LINEAR サンプリングは端末依存で落ちるため不採用）
    // モバイルはシミュ解像度を落として負荷を抑える
    const SIM = window.innerWidth < 768 ? 256 : 384
    const texType = gl.UNSIGNED_BYTE

    const simProg = program(gl, SIM_FRAG)
    const renderProg = program(gl, RENDER_FRAG)
    if (!simProg || !renderProg) return

    // フルスクリーン三角形
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    // ping-pong 用の高さ場テクスチャ 3 枚（prev / curr / next）
    // 高さ 0 = エンコード値 0.5（128）で全面初期化
    const initData = new Uint8Array(SIM * SIM * 4)
    for (let i = 0; i < initData.length; i += 4) { initData[i] = 128; initData[i + 3] = 255 }
    function makeTex() {
      const t = gl.createTexture()!
      gl.bindTexture(gl.TEXTURE_2D, t)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SIM, SIM, 0, gl.RGBA, texType, initData)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      return t
    }
    let texPrev = makeTex()
    let texCurr = makeTex()
    let texNext = makeTex()
    const fbo = gl.createFramebuffer()

    function sizeCanvas() {
      const host = cv.parentElement
      if (!host) return
      const r = host.getBoundingClientRect()
      const dpr = Math.min(1.5, window.devicePixelRatio || 1)
      cv.width = Math.max(1, Math.round(r.width * dpr))
      cv.height = Math.max(1, Math.round(r.height * dpr))
    }
    sizeCanvas()
    const onResize = () => sizeCanvas()
    window.addEventListener('resize', onResize)

    // ── 雨だれスケジューラ（疑似乱数, Math.random 不使用）─────
    let seed = 12.9898
    const rnd = () => {
      seed = (seed * 1.61803398875 + 0.31830988618) % 1
      const s = Math.sin(seed * 127.1) * 43758.5453
      return s - Math.floor(s)
    }
    let t0 = performance.now()
    let nextDrop = 0
    const drops: number[] = [0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1] // 4 滴 x(xyz)

    function scheduleDrops(t: number) {
      // 一定間隔 + ゆらぎで 1 滴ずつ落とす。たまに連打。
      for (let i = 0; i < 4; i++) drops[i * 3 + 2] = -1 // 毎フレーム消す（1フレームだけ打つ）
      if (t > nextDrop) {
        const slot = Math.floor(rnd() * 4)
        drops[slot * 3 + 0] = 0.12 + rnd() * 0.76
        drops[slot * 3 + 1] = 0.12 + rnd() * 0.76
        drops[slot * 3 + 2] = 0.34 + rnd() * 0.18 // 強さ
        nextDrop = t + 0.9 + rnd() * 1.8          // 1 滴ずつ間を置く
      }
    }

    const uSim = {
      prev: gl.getUniformLocation(simProg, 'uPrev'),
      curr: gl.getUniformLocation(simProg, 'uCurr'),
      texel: gl.getUniformLocation(simProg, 'uTexel'),
      damp: gl.getUniformLocation(simProg, 'uDamp'),
      drops: gl.getUniformLocation(simProg, 'uDrops'),
    }
    const uRen = {
      height: gl.getUniformLocation(renderProg, 'uHeight'),
      texel: gl.getUniformLocation(renderProg, 'uTexel'),
      aspect: gl.getUniformLocation(renderProg, 'uAspect'),
      deep: gl.getUniformLocation(renderProg, 'uDeep'),
      brass: gl.getUniformLocation(renderProg, 'uBrass'),
      debug: gl.getUniformLocation(renderProg, 'uDebug'),
      time: gl.getUniformLocation(renderProg, 'uTime'),
    }
    const debugMode = new URLSearchParams(window.location.search).get('debug') === '1'

    function simStep(t: number) {
      scheduleDrops(t)
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texNext, 0)
      gl.viewport(0, 0, SIM, SIM)
      gl.useProgram(simProg)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texPrev)
      gl.uniform1i(uSim.prev, 0)
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, texCurr)
      gl.uniform1i(uSim.curr, 1)
      gl.uniform2f(uSim.texel, 1 / SIM, 1 / SIM)
      gl.uniform1f(uSim.damp, 0.991)
      gl.uniform3fv(uSim.drops, drops)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      // ローテーション: prev <- curr <- next
      const tmp = texPrev
      texPrev = texCurr
      texCurr = texNext
      texNext = tmp
    }

    function render(t: number) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, cv.width, cv.height)
      gl.useProgram(renderProg)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texCurr)
      gl.uniform1i(uRen.height, 0)
      gl.uniform2f(uRen.texel, 1 / SIM, 1 / SIM)
      const a = cv.width / cv.height
      gl.uniform2f(uRen.aspect, a >= 1 ? a : 1, a >= 1 ? 1 : 1 / a)
      gl.uniform3f(uRen.deep, DEEP.r, DEEP.g, DEEP.b)
      gl.uniform3f(uRen.brass, BRASS.r, BRASS.g, BRASS.b)
      gl.uniform1f(uRen.debug, debugMode ? 1 : 0)
      gl.uniform1f(uRen.time, t)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    let raf = 0
    function frame() {
      const t = (performance.now() - t0) / 1000
      simStep(t)
      render(t)
      raf = requestAnimationFrame(frame)
    }

    if (reduced) {
      // 静止: 数滴だけ打って少し回し、止める
      let tt = 0
      for (let k = 0; k < 6; k++) { drops[(k % 4) * 3] = 0; drops[(k % 4) * 3 + 1] = 0; drops[(k % 4) * 3 + 2] = -1 }
      drops[0] = 0.5; drops[1] = 0.45; drops[2] = 0.2
      simStep(tt += 0.016)
      for (let i = 0; i < 90; i++) { drops[2] = -1; simStep(tt += 0.016) }
      render(0) // 静止: 時間を進めずさざ波も凍結
    } else {
      raf = requestAnimationFrame(frame)
    }

    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      gl.deleteProgram(simProg)
      gl.deleteProgram(renderProg)
      gl.deleteTexture(texPrev)
      gl.deleteTexture(texCurr)
      gl.deleteTexture(texNext)
      gl.deleteBuffer(buf)
      gl.deleteFramebuffer(fbo)
    }
  }, [canvas])
}
