'use client'

import { useEffect, useRef } from 'react'

/**
 * GrayscaleV2 — Claude Design 版 LP の React 移植
 *
 * 元データ: Claude Design の x-dc プロトタイプ（Grayscale LP.dc.html）を
 * ランタイム非依存の素の React + Canvas に移植したもの。
 *
 * 演出（すべて 1 本の requestAnimationFrame ループで駆動）:
 *  - 開幕カーテン（5 段グレースケール）/ 真鍮プログレスバー
 *  - ヒーロー: 煙の対流 Canvas（時計回り対流 + カーソル追従）+ パララックス
 *  - Philosophy: ピン留めスクラブで一行ずつ点灯
 *  - Origin: data-reveal フェードイン（IntersectionObserver）
 *  - Services: 横スクロールジャック 3 パネル
 *  - Integration: 散らばった SaaS チップがロゴマークに集約
 *  - Proof: ページ自身のコードをタイピング
 *  - Contact: CTA は外部から渡す onContact で接続
 *  - カスタムカーソル（pointer:fine のみ）
 *
 * prefers-reduced-motion: reduce の場合は演出を畳んで静的レイアウトに切替。
 * Lenis（SmoothScroll）と共存（window.scrollY ベースで計算）。
 */

const SCATTER = [
  { x: -0.36, y: -0.30, r: -14 },
  { x: -0.18, y: 0.27, r: 9 },
  { x: -0.43, y: 0.10, r: 22 },
  { x: 0.08, y: -0.33, r: -7 },
  { x: 0.31, y: -0.18, r: 16 },
  { x: 0.42, y: 0.22, r: -19 },
  { x: 0.17, y: 0.32, r: 6 },
  { x: -0.07, y: -0.13, r: -24 },
  { x: 0.24, y: 0.05, r: 12 },
  { x: -0.27, y: -0.04, r: -5 },
]

const TYPE_SRC = [
  '// grayscale.jp — corporate site',
  '// designed & built in-house, no agency',
  '',
  'const site = await grayscale.build({',
  '  design:    "in-house",',
  '  code:      "in-house",',
  '  motion:    "in-house",',
  '  outsource: false,',
  '});',
  '',
  'site.prove(',
  '  "作れる会社が選ぶSaaSは、本物だ。"',
  ');',
].join('\n')

const SMOKE_COLS = ['84, 78, 67', '113, 105, 92', '59, 54, 46']

export function useGrayscaleV2() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches

    const $ = <T extends Element = HTMLElement>(s: string) => root.querySelector<T>(s)
    const $$ = <T extends Element = HTMLElement>(s: string) => Array.from(root.querySelectorAll<T>(s))

    const E = {
      progress: $('[data-progress]'),
      curtain: $('[data-curtain]'),
      hero: $('[data-hero-content]'),
      scrubWrap: $('[data-scrub-wrap]'),
      scrubSticky: $('[data-scrub-sticky]'),
      lines: $$('[data-scrub-line]'),
      hWrap: $('[data-h-wrap]'),
      hSticky: $('[data-h-sticky]'),
      track: $('[data-h-track]'),
      convWrap: $('[data-conv-wrap]'),
      convSticky: $('[data-conv-sticky]'),
      stage: $('[data-conv-stage]'),
      chips: $$('[data-chip]'),
      chipLabels: $$('[data-chip-label]'),
      convCaption: $('[data-conv-caption]'),
      marquee: $('[data-marquee-track]'),
      cursor: $('[data-cursor]'),
      ink: $<HTMLCanvasElement>('[data-ink]'),
      typeText: $('[data-type-text]'),
      typeCard: $('[data-type-card]'),
    }

    // ─── 状態 ───────────────────────────────────────────────
    let raf = 0
    let typed = 0
    let typeOn = false
    let typeDone = false
    let mOff = 0
    let segW = 0
    let lastY = window.scrollY
    let cx = -100, cy = -100, tx = -100, ty = -100
    let cs = 1, csT = 1, cursorSeen = false

    // ─── 煙 Canvas ──────────────────────────────────────────
    let inkCtx: CanvasRenderingContext2D | null = null
    let inkCv: HTMLCanvasElement | null = null
    let inkBuf: HTMLCanvasElement | null = null
    let inkBufCtx: CanvasRenderingContext2D | null = null
    let inkT0 = 0
    let inkDpr = 1
    let inkW = 0, inkH = 0
    let inkSeed = 0
    let srcPh = Math.sin(lastY * 0.013 + 1.7) * 5 + 5 // 疑似乱数（Math.random 不使用）
    let brush = { x: 0, y: 0, px: 0, py: 0 }
    let userPos: { x: number; y: number } | null = null
    let lastUser = -10

    let onInkResize: (() => void) | null = null
    let onInkMove: ((e: PointerEvent) => void) | null = null
    let onMove: ((e: MouseEvent) => void) | null = null
    let onOver: ((e: MouseEvent) => void) | null = null
    let io: IntersectionObserver | null = null

    function sizeInk() {
      const cv = inkCv
      if (!cv) return
      const host = cv.parentElement
      if (!host) return
      const r = host.getBoundingClientRect()
      inkDpr = Math.min(1.5, window.devicePixelRatio || 1)
      cv.width = Math.max(1, Math.round(r.width * inkDpr))
      cv.height = Math.max(1, Math.round(r.height * inkDpr))
      if (inkBuf) { inkBuf.width = cv.width; inkBuf.height = cv.height }
      inkW = r.width
      inkH = r.height
    }

    function initInk() {
      const cv = E.ink
      if (!cv) return
      inkCtx = cv.getContext('2d')
      inkCv = cv
      inkBuf = document.createElement('canvas')
      inkBufCtx = inkBuf.getContext('2d')
      inkT0 = performance.now()
      sizeInk()
      onInkResize = () => sizeInk()
      window.addEventListener('resize', onInkResize)
      brush = { x: inkW * 0.55, y: inkH * 0.42, px: inkW * 0.55, py: inkH * 0.42 }
      onInkMove = (e: PointerEvent) => {
        const r = cv.getBoundingClientRect()
        if (e.clientY < r.top || e.clientY > r.bottom || e.clientX < r.left || e.clientX > r.right) return
        userPos = { x: e.clientX - r.left, y: e.clientY - r.top }
        lastUser = (performance.now() - inkT0) / 1000
      }
      window.addEventListener('pointermove', onInkMove, { passive: true })
    }

    function emitSmoke(x0: number, y0: number, x1: number, y1: number, dist: number, gain: number) {
      const ctx = inkCtx
      if (!ctx) return
      const ux = (x1 - x0) / dist
      const uy = (y1 - y0) / dist
      const nx = -uy
      const ny = ux
      const sp = Math.min(dist, 50)
      const base = (4.5 + sp * 0.34) * gain
      const alpha = Math.min(0.11, 0.045 + sp * 0.0016) * gain
      const steps = Math.max(1, Math.ceil(dist / Math.max(2, base * 0.5)))
      const blot = (x: number, y: number, rr: number, aa: number, col: string) => {
        if (rr < 0.8 || aa <= 0.003) return
        const g = ctx.createRadialGradient(x, y, 0, x, y, rr)
        g.addColorStop(0, 'rgba(' + col + ', ' + aa.toFixed(3) + ')')
        g.addColorStop(0.5, 'rgba(' + col + ', ' + (aa * 0.55).toFixed(3) + ')')
        g.addColorStop(1, 'rgba(' + col + ', 0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(x, y, rr, 0, Math.PI * 2)
        ctx.fill()
      }
      for (let i = 1; i <= steps; i++) {
        const f = i / steps
        const x = x0 + (x1 - x0) * f
        const y = y0 + (y1 - y0) * f
        inkSeed += 0.83
        const wob = Math.sin(inkSeed) * base * 0.5
        const col = SMOKE_COLS[((Math.floor(inkSeed * 7) % 3) + 3) % 3]
        blot(x + nx * wob, y + ny * wob, base, alpha, col)
        blot(x - nx * wob * 0.7 + Math.cos(inkSeed * 1.7) * base * 0.4, y - ny * wob * 0.7 + Math.sin(inkSeed * 1.3) * base * 0.4, base * 0.55, alpha * 0.7, col)
      }
    }

    function stepInk(render: boolean, noFade?: boolean) {
      if (!inkCtx || !inkW || inkW < 10 || !render || !inkCv || !inkBuf || !inkBufCtx) return
      const ctx = inkCtx
      const cv = inkCv
      const buf = inkBuf
      const bctx = inkBufCtx
      const d = inkDpr
      const t = (performance.now() - inkT0) / 1000
      bctx.setTransform(1, 0, 0, 1, 0, 0)
      bctx.clearRect(0, 0, buf.width, buf.height)
      bctx.drawImage(cv, 0, 0)
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, cv.width, cv.height)
      const ccx = cv.width * 0.5
      const ccy = cv.height * 0.52
      const ang = 0.0021 + 0.0007 * Math.sin(t * 0.05)
      const rise = -0.14 * d
      ctx.globalAlpha = noFade ? 1 : 0.999
      ctx.translate(ccx, ccy)
      ctx.rotate(ang)
      ctx.translate(-ccx, -ccy)
      ctx.drawImage(buf, 0, rise)
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      for (let i = 0; i < 2; i++) {
        const vcx = inkW * (0.36 + 0.3 * i + 0.14 * Math.sin(t * 0.045 + i * 2.4)) * d
        const vcy = inkH * (0.5 + 0.22 * Math.sin(t * 0.06 + i * 1.9)) * d
        const vr = (110 + 60 * i) * d
        const w = (i % 2 === 0 ? -1 : 1) * (0.004 + 0.0015 * Math.sin(t * 0.17 + i))
        ctx.save()
        ctx.beginPath()
        ctx.arc(vcx, vcy, vr, 0, Math.PI * 2)
        ctx.clip()
        ctx.clearRect(vcx - vr, vcy - vr, vr * 2, vr * 2)
        ctx.translate(ccx, ccy)
        ctx.rotate(ang)
        ctx.translate(-ccx, -ccy)
        ctx.translate(vcx, vcy)
        ctx.rotate(w)
        ctx.translate(-vcx, -vcy)
        ctx.drawImage(buf, 0, rise)
        ctx.restore()
      }
      ctx.globalAlpha = 1
      ctx.setTransform(d, 0, 0, d, 0, 0)
      const W = inkW
      const H = inkH
      const sx = W * (0.6 + 0.05 * Math.sin(t * 0.1 + srcPh))
      const sy = H * (0.6 + 0.04 * Math.sin(t * 0.073 + srcPh * 1.7))
      inkSeed += 0.31
      const puff = 0.8 + 0.5 * Math.sin(t * 0.6 + srcPh) + Math.sin(inkSeed * 0.7) * 0.2
      if (puff > 0.25) {
        const jx = Math.sin(inkSeed * 2.1) * 5
        const jy = Math.cos(inkSeed * 1.6) * 5
        emitSmoke(sx + jx, sy + jy + 6, sx + jx * 0.5, sy + jy - 6, 12, 0.85 * Math.min(1.4, puff))
      }
      const b = brush
      const userActive = userPos && t - lastUser < 0.25
      if (userPos) {
        b.x += (userPos.x - b.x) * 0.35
        b.y += (userPos.y - b.y) * 0.35
        const dist = Math.hypot(b.x - b.px, b.y - b.py)
        if (userActive && dist > 0.6) {
          emitSmoke(b.px, b.py, b.x, b.y, dist, 1)
        }
        b.px = b.x
        b.py = b.y
      }
    }

    function placeChips(e: number) {
      if (!E.stage || !E.chips.length) return
      const sr = E.stage.getBoundingClientRect()
      if (sr.width < 10 || sr.height < 10) return
      const size = Math.max(120, Math.min(250, sr.width * 0.6, sr.height * 0.94))
      const barW = size / 5
      E.chips.forEach((chip, i) => {
        const col = i % 5
        const row = Math.floor(i / 5)
        const txp = (col - 2) * barW
        const typ = (row === 0 ? -1 : 1) * (size / 4)
        const s = SCATTER[i]
        const sx = s.x * sr.width
        const sy = s.y * sr.height
        const x = sx + (txp - sx) * e
        const y = sy + (typ - sy) * e
        const rot = s.r * (1 - e)
        chip.style.width = (barW - 1.5) + 'px'
        chip.style.height = (size / 2 - 1) + 'px'
        chip.style.transform = 'translate(calc(-50% + ' + x + 'px), calc(-50% + ' + y + 'px)) rotate(' + rot + 'deg)'
      })
    }

    function loop() {
      const vh = window.innerHeight
      const vw = window.innerWidth
      const y = window.scrollY
      const c01 = (v: number) => Math.max(0, Math.min(1, v))
      const easeFn = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

      if (E.progress) {
        const dh = document.documentElement.scrollHeight - vh
        E.progress.style.width = (dh > 0 ? (y / dh) * 100 : 0) + '%'
      }
      if (E.hero) {
        const p = c01(y / (vh * 0.9))
        E.hero.style.transform = 'translateY(' + y * 0.22 + 'px)'
        E.hero.style.opacity = String(1 - p * 0.92)
      }
      if (y < vh * 1.15) stepInk(true)
      if (E.scrubWrap && E.lines.length) {
        const r = E.scrubWrap.getBoundingClientRect()
        const p = c01(-r.top / (r.height - vh))
        const n = E.lines.length
        E.lines.forEach((el, i) => {
          const t = c01(p * (n + 0.4) - i)
          el.style.opacity = String(0.13 + 0.87 * t)
        })
      }
      if (E.hWrap && E.track) {
        const r = E.hWrap.getBoundingClientRect()
        const p = c01(-r.top / (r.height - vh))
        E.track.style.transform = 'translate3d(' + -p * (E.track.scrollWidth - vw) + 'px, 0, 0)'
      }
      if (E.convWrap && E.stage) {
        const r = E.convWrap.getBoundingClientRect()
        const p = c01(-r.top / (r.height - vh))
        placeChips(easeFn(p))
        const lo = (1 - c01((p - 0.32) / 0.25)) * 0.9
        E.chipLabels.forEach((el) => { el.style.opacity = String(lo) })
        if (E.convCaption) {
          const cp = c01((p - 0.68) / 0.24)
          E.convCaption.style.opacity = String(cp)
          E.convCaption.style.transform = 'translateY(' + (1 - cp) * 18 + 'px)'
        }
      }
      if (E.marquee) {
        if (!segW && E.marquee.children[0]) {
          segW = (E.marquee.children[0] as HTMLElement).getBoundingClientRect().width
        }
        const sp = 0.6 + Math.min(Math.abs(y - lastY) * 0.05, 2.4)
        mOff -= sp
        if (segW && mOff <= -segW) mOff += segW
        E.marquee.style.transform = 'translate3d(' + mOff + 'px, 0, 0)'
      }
      if (E.typeText && !typeDone) {
        if (!typeOn && E.typeCard) {
          const tr = E.typeCard.getBoundingClientRect()
          if (tr.top < vh * 0.8 && tr.bottom > 0) typeOn = true
        }
        if (typeOn) {
          typed = Math.min(TYPE_SRC.length, typed + 2.2)
          E.typeText.textContent = TYPE_SRC.slice(0, Math.floor(typed))
          if (typed >= TYPE_SRC.length) typeDone = true
        }
      }
      if (fine && E.cursor && cursorSeen) {
        cx += (tx - cx) * 0.2
        cy += (ty - cy) * 0.2
        cs += (csT - cs) * 0.16
        E.cursor.style.transform = 'translate3d(' + (cx - 6) + 'px, ' + (cy - 6) + 'px, 0) scale(' + cs.toFixed(3) + ')'
      }
      lastY = y
      raf = requestAnimationFrame(loop)
    }

    function applyReduced() {
      if (E.curtain) E.curtain.style.display = 'none'
      if (E.cursor) E.cursor.style.display = 'none'
      if (E.progress) E.progress.style.display = 'none'
      $$('[data-hero-content] *, [data-hero-content]').forEach((el) => { el.style.animation = 'none' })
      E.lines.forEach((el) => { el.style.opacity = '1' })
      if (E.scrubWrap) E.scrubWrap.style.height = 'auto'
      if (E.scrubSticky) { E.scrubSticky.style.position = 'static'; E.scrubSticky.style.height = 'auto'; E.scrubSticky.style.padding = '80px clamp(20px, 6vw, 88px)' }
      if (E.hWrap) E.hWrap.style.height = 'auto'
      if (E.hSticky) { E.hSticky.style.position = 'static'; E.hSticky.style.height = 'auto'; E.hSticky.style.overflow = 'visible' }
      if (E.track) { E.track.style.flexDirection = 'column'; E.track.style.width = '100%'; E.track.style.height = 'auto' }
      $$('[data-h-track] > article').forEach((el) => { el.style.width = '100%'; el.style.minHeight = '70vh' })
      if (E.convWrap) E.convWrap.style.height = 'auto'
      if (E.convSticky) { E.convSticky.style.position = 'static'; E.convSticky.style.height = 'auto' }
      if (E.stage) E.stage.style.minHeight = '360px'
      placeChips(1)
      E.chipLabels.forEach((el) => { el.style.opacity = '0' })
      if (E.convCaption) { E.convCaption.style.opacity = '1'; E.convCaption.style.transform = 'none' }
      if (E.typeText) E.typeText.textContent = TYPE_SRC
      if (inkCtx) {
        for (let i = 0; i < 260; i++) { inkT0 -= 33; stepInk(true, true) }
      }
    }

    // ─── 起動 ───────────────────────────────────────────────
    document.title = '株式会社Grayscale — 全部やるから、本物。'
    initInk()

    if (reduced) {
      applyReduced()
      return () => {
        if (onInkResize) window.removeEventListener('resize', onInkResize)
        if (onInkMove) window.removeEventListener('pointermove', onInkMove)
      }
    }

    io = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (en.isIntersecting) {
          const el = en.target as HTMLElement
          el.style.transition = 'opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1), transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)'
          el.style.opacity = '1'
          el.style.transform = 'translateY(0px)'
          io!.unobserve(en.target)
        }
      })
    }, { threshold: 0.12 })
    $$('[data-reveal]').forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.top > window.innerHeight * 0.9) {
        el.style.opacity = '0'
        el.style.transform = 'translateY(26px)'
        io!.observe(el)
      }
    })

    if (fine && E.cursor) {
      document.body.classList.add('dc-cursor-active')
      onMove = (e: MouseEvent) => {
        tx = e.clientX; ty = e.clientY
        if (!cursorSeen) { cursorSeen = true; cx = tx; cy = ty; E.cursor!.style.opacity = '1' }
      }
      onOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        csT = target.closest && target.closest('a, button, [data-hover]') ? 4 : 1
      }
      window.addEventListener('mousemove', onMove, { passive: true })
      window.addEventListener('mouseover', onOver, { passive: true })
    } else if (E.cursor) {
      E.cursor.style.display = 'none'
    }

    raf = requestAnimationFrame(loop)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      if (io) io.disconnect()
      if (onMove) window.removeEventListener('mousemove', onMove)
      if (onOver) window.removeEventListener('mouseover', onOver)
      if (onInkResize) window.removeEventListener('resize', onInkResize)
      if (onInkMove) window.removeEventListener('pointermove', onInkMove)
      document.body.classList.remove('dc-cursor-active')
    }
  }, [])

  return rootRef
}
