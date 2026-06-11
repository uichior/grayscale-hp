'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

/**
 * CustomCursor
 *
 * ミニマル構成:
 * - 小ドット（8px）: マウス位置に即追従
 * - リング（32px）: GSAP quickTo で遅延追従
 * - インタラクティブ要素（a, button）ホバーで拡大
 * - mix-blend-mode: difference で黒白両背景に対応
 * - デスクトップのみ（pointer: fine の場合のみレンダリング）
 * - prefers-reduced-motion 時は無効
 * - ネイティブカーソルは消さない（補助演出として重ねる）
 */
export function CustomCursor() {
  const dotRef   = useRef<HTMLDivElement>(null)
  const ringRef  = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // pointer: fine AND hover: hover 両方を満たすデバイスのみ（タッチエミュレーション対策）
    const isDesktopPointer = window.matchMedia('(pointer: fine) and (hover: hover)').matches
    if (!isDesktopPointer) return

    // prefers-reduced-motion を尊重
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // 初期位置を画面外に設定（最初の mousemove まで invisible）
    gsap.set(dot,  { x: -100, y: -100 })
    gsap.set(ring, { x: -100, y: -100 })

    // GSAP quickTo でリング遅延追従（軽量・60fps）
    const xTo = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' })
    const yTo = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' })

    // ドットは即時追従
    const xDot = gsap.quickTo(dot, 'x', { duration: 0.05, ease: 'none' })
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.05, ease: 'none' })

    let isHovering = false

    const onMouseMove = (e: MouseEvent) => {
      if (!visible) setVisible(true)
      xTo(e.clientX)
      yTo(e.clientY)
      xDot(e.clientX)
      yDot(e.clientY)
    }

    const onMouseEnterInteractive = () => {
      if (isHovering) return
      isHovering = true
      gsap.to(ring, {
        width: 56,
        height: 56,
        opacity: 0.8,
        duration: 0.25,
        ease: 'power2.out',
      })
      gsap.to(dot, {
        width: 4,
        height: 4,
        duration: 0.2,
        ease: 'power2.out',
      })
    }

    const onMouseLeaveInteractive = () => {
      if (!isHovering) return
      isHovering = false
      gsap.to(ring, {
        width: 32,
        height: 32,
        opacity: 0.6,
        duration: 0.25,
        ease: 'power2.out',
      })
      gsap.to(dot, {
        width: 8,
        height: 8,
        duration: 0.2,
        ease: 'power2.out',
      })
    }

    // ウィンドウ離脱時
    const onMouseLeaveWindow = () => setVisible(false)
    const onMouseEnterWindow = () => setVisible(true)

    // イベントのデリゲーション（動的要素にも対応）
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.closest('a, button, [role="button"], input, textarea, select, label')) {
        onMouseEnterInteractive()
      }
    }

    const onMouseOut = (e: MouseEvent) => {
      const target    = e.target as Element
      const relTarget = e.relatedTarget as Element | null
      if (
        target.closest('a, button, [role="button"], input, textarea, select, label') &&
        !relTarget?.closest('a, button, [role="button"], input, textarea, select, label')
      ) {
        onMouseLeaveInteractive()
      }
    }

    window.addEventListener('mousemove',  onMouseMove,       { passive: true })
    document.addEventListener('mouseover',  onMouseOver,     { passive: true })
    document.addEventListener('mouseout',   onMouseOut,      { passive: true })
    document.addEventListener('mouseleave', onMouseLeaveWindow)
    document.addEventListener('mouseenter', onMouseEnterWindow)

    return () => {
      window.removeEventListener('mousemove',  onMouseMove)
      document.removeEventListener('mouseover',  onMouseOver)
      document.removeEventListener('mouseout',   onMouseOut)
      document.removeEventListener('mouseleave', onMouseLeaveWindow)
      document.removeEventListener('mouseenter', onMouseEnterWindow)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // SSR / タッチデバイスでは何もレンダリングしない
  return (
    <>
      {/* ドット：マウス位置に即追従 */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position:        'fixed',
          top:             0,
          left:            0,
          width:           8,
          height:          8,
          borderRadius:    '50%',
          background:      '#ffffff',
          mixBlendMode:    'difference',
          pointerEvents:   'none',
          zIndex:          9999,
          transform:       'translate(-50%, -50%)',
          opacity:         visible ? 1 : 0,
          transition:      'opacity 0.3s ease',
          willChange:      'transform',
        }}
      />
      {/* リング：遅延追従 */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position:        'fixed',
          top:             0,
          left:            0,
          width:           32,
          height:          32,
          borderRadius:    '50%',
          border:          '1.5px solid #ffffff',
          mixBlendMode:    'difference',
          pointerEvents:   'none',
          zIndex:          9998,
          transform:       'translate(-50%, -50%)',
          opacity:         visible ? 0.6 : 0,
          transition:      'opacity 0.3s ease',
          willChange:      'transform',
        }}
      />
    </>
  )
}
