'use client'

import { useEffect, useRef, ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface SmoothScrollProps {
  children: ReactNode
}

/**
 * SmoothScroll
 *
 * - Lenis で慣性スクロールを付与する（scrolljacking は行わない）
 * - Lenis の raf を gsap.ticker に統合して jitter を防ぐ
 * - prefers-reduced-motion: reduce の場合は Lenis を起動しない
 * - SSR では何も行わない（useEffect 内で初期化）
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // prefers-reduced-motion を尊重
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const lenis = new Lenis({
      // 慣性の強さ（デフォルト相当）。scrolljacking に繋がる extreme 値は使わない
      lerp: 0.1,
      smoothWheel: true,
    })

    lenisRef.current = lenis

    // グローバルに lenis インスタンスを expose（RenewalHeader 等のアンカー scrollTo に使用）
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).__lenis = lenis

    // Lenis の raf を gsap.ticker に統合（公式推奨パターン）
    function onFrame(time: number) {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(onFrame)
    gsap.ticker.lagSmoothing(0)

    // ScrollTrigger に Lenis のスクロール位置を伝える
    lenis.on('scroll', ScrollTrigger.update)

    // マウント直後に ScrollTrigger をリフレッシュ
    // （フォントロード等でレイアウトが確定した後に実行）
    const raf = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })

    return () => {
      cancelAnimationFrame(raf)
      gsap.ticker.remove(onFrame)
      lenis.destroy()
      lenisRef.current = null
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).__lenis
    }
  }, [])

  return <>{children}</>
}
