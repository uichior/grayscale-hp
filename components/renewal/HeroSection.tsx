'use client'

import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * HeroSection
 *
 * ディレクター決定コピー:
 *   行1: 「選ぶ。」  font-weight 200  (SELECT)
 *   行2: 「導く。」  font-weight 500  (GUIDE)
 *   行3: 「つくる。」font-weight 900  (BUILD) — 句点のみ signal カラー
 *
 * パンチライン: 「全部やるから、本物。」
 * サブコピー: SaaS代理店 × 伴走コンサル × 自社開発...
 *
 * 演出:
 *   - ページロード時: 行ごとに clip-path + translateY reveal（GSAP timeline）
 *   - スクロール時: 巨大タイポに軽いパララックス（ScrollTrigger scrub、pin禁止）
 *   - prefers-reduced-motion: 即時表示
 */
export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)
  const line1Ref = useRef<HTMLDivElement>(null)
  const line2Ref = useRef<HTMLDivElement>(null)
  const line3Ref = useRef<HTMLDivElement>(null)
  const punchlineRef = useRef<HTMLParagraphElement>(null)
  const subcopyRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const typoBgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const lines = [line1Ref.current, line2Ref.current, line3Ref.current]
    const supportEls = [punchlineRef.current, subcopyRef.current, ctaRef.current]

    if (prefersReduced) {
      // 即時表示: clip-path / translateY を外すだけ
      lines.forEach(el => {
        if (el) {
          el.style.clipPath = 'inset(0 0 0 0)'
          el.style.transform = 'translateY(0)'
          el.style.opacity = '1'
        }
      })
      supportEls.forEach(el => {
        if (el) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
        }
      })
      return
    }

    // --- 初期状態: 非表示にセット ---
    lines.forEach(el => {
      if (el) {
        gsap.set(el, {
          clipPath: 'inset(0 0 100% 0)',
          y: 24,
          opacity: 1,
        })
      }
    })
    supportEls.forEach(el => {
      if (el) gsap.set(el, { y: 20, opacity: 0 })
    })

    // --- 入場タイムライン ---
    const tl = gsap.timeline({ delay: 0.1 })

    tl.to(line1Ref.current, {
      clipPath: 'inset(0 0 0% 0)',
      y: 0,
      duration: 0.75,
      ease: 'power3.out',
    })
    .to(line2Ref.current, {
      clipPath: 'inset(0 0 0% 0)',
      y: 0,
      duration: 0.75,
      ease: 'power3.out',
    }, '-=0.5')
    .to(line3Ref.current, {
      clipPath: 'inset(0 0 0% 0)',
      y: 0,
      duration: 0.75,
      ease: 'power3.out',
    }, '-=0.5')
    .to(
      [punchlineRef.current, subcopyRef.current, ctaRef.current],
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
      },
      '-=0.3'
    )

    // --- スクロールパララックス（scrub: 軽め、pin禁止）---
    if (typoBgRef.current) {
      gsap.to(typoBgRef.current, {
        y: '-12%',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      })
    }

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-paper"
    >
      {/* ── 背景: 極細ヘアライン（縦2本+横3本、方眼の既視感を排除） ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-gray-200) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-gray-200) 1px, transparent 1px)
          `,
          backgroundSize: '480px 320px',
          opacity: 0.08,
        }}
      />

      {/* ── 座標ラベル (左上・右下): ブランドのディテール感 ── */}
      <span
        aria-hidden
        className="label-mono text-gs-400 absolute top-[88px] left-6 sm:left-8 lg:left-12 select-none"
      >
        00.01
      </span>
      <span
        aria-hidden
        className="label-mono text-gs-400 absolute bottom-10 right-6 sm:right-8 lg:right-12 select-none"
      >
        HERO
      </span>

      {/* ── メインコンテンツ ── */}
      <div className="relative z-10 section-padding pt-28 pb-24 max-width-container w-full mx-auto">

        {/* 会社ラベル */}
        <p className="label-mono text-gs-500 mb-10 sm:mb-12">
          株式会社 Grayscale
        </p>

        {/* タイポグラフィBGレイヤー（パララックス対象） */}
        <div ref={typoBgRef}>
          {/* 巨大タイポ3行 */}
          <h1
            aria-label="選ぶ。導く。つくる。"
            className="leading-none select-text"
          >
            {/* 行1 — 「選ぶ。」 weight 200 (極細) */}
            <div className="overflow-hidden mb-1 sm:mb-2">
              <div
                ref={line1Ref}
                className="flex items-baseline gap-3 sm:gap-5"
              >
                <span
                  className="font-ja tracking-ja-tight text-ink"
                  style={{
                    fontWeight: 200,
                    fontSize: 'clamp(3.5rem, 12vw, 11rem)',
                    lineHeight: 0.95,
                  }}
                >
                  選ぶ<span style={{ fontWeight: 700, fontSize: '0.72em', verticalAlign: 'baseline' }}>。</span>
                </span>
                <span className="label-mono text-gs-400 self-end pb-[0.2em] hidden sm:inline-block">
                  SELECT
                </span>
              </div>
            </div>

            {/* 行2 — 「導く。」 weight 500 (ミディアム) */}
            <div className="overflow-hidden mb-1 sm:mb-2">
              <div
                ref={line2Ref}
                className="flex items-baseline gap-3 sm:gap-5"
              >
                <span
                  className="font-ja tracking-ja-tight text-ink"
                  style={{
                    fontWeight: 500,
                    fontSize: 'clamp(3.5rem, 12vw, 11rem)',
                    lineHeight: 0.95,
                  }}
                >
                  導く<span style={{ fontWeight: 700, fontSize: '0.72em', verticalAlign: 'baseline' }}>。</span>
                </span>
                <span className="label-mono text-gs-400 self-end pb-[0.2em] hidden sm:inline-block">
                  GUIDE
                </span>
              </div>
            </div>

            {/* 行3 — 「つくる。」 weight 900 (極太) — 句点のみ signal カラー */}
            <div className="overflow-hidden">
              <div
                ref={line3Ref}
                className="flex items-baseline gap-3 sm:gap-5"
              >
                <span
                  className="font-ja tracking-ja-tight"
                  style={{
                    fontWeight: 900,
                    fontSize: 'clamp(3.5rem, 12vw, 11rem)',
                    lineHeight: 0.95,
                    color: 'var(--color-ink)',
                  }}
                >
                  つくる<span style={{ color: 'var(--color-signal)', fontWeight: 900, fontSize: '0.72em', verticalAlign: 'baseline' }}>。</span>
                </span>
                <span className="label-mono text-gs-400 self-end pb-[0.2em] hidden sm:inline-block">
                  BUILD
                </span>
              </div>
            </div>
          </h1>
        </div>

        {/* パンチライン */}
        <p
          ref={punchlineRef}
          className="mt-10 sm:mt-14 font-display font-black text-ink tracking-ja-tight"
          style={{
            fontSize: 'clamp(1.5rem, 3.5vw, 2.75rem)',
            lineHeight: 1.1,
          }}
        >
          全部やるから、本物。
        </p>

        {/* サブコピー（リード文） */}
        <p
          ref={subcopyRef}
          className="mt-5 sm:mt-6 font-ja font-light text-gs-500 tracking-ja-normal"
          style={{
            fontSize: 'clamp(0.9375rem, 1.5vw, 1.125rem)',
            lineHeight: 1.8,
            maxWidth: '36em',
          }}
        >
          SaaS代理店 × 伴走コンサル × 自社開発。
          <br className="hidden sm:block" />
          製造業の現場で10年DXをやってきたから、本当にいいものだけを選び、
          <br className="hidden lg:block" />
          定着まで伴走し、必要なら自分たちでつくれる。
        </p>

        {/* CTA */}
        <div ref={ctaRef} className="mt-10 sm:mt-12 flex flex-wrap items-center gap-5">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-ink text-paper
                       px-7 py-3.5 text-sm font-medium font-display
                       hover:bg-gs-700 transition-colors duration-200"
          >
            相談する（無料）
            <span aria-hidden className="ml-1">→</span>
          </a>
          <a
            href="#story"
            className="text-sm font-medium text-gs-500 hover:text-ink transition-colors duration-200"
          >
            Grayscaleとは ↓
          </a>
        </div>
      </div>

      {/* スクロールインジケーター */}
      <div
        aria-hidden
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="label-mono text-gs-400">SCROLL</span>
        <div className="w-px h-12 bg-gs-200 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full bg-gs-500"
            style={{
              height: '40%',
              animation: 'scrollIndicator 1.8s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollIndicator {
          0%   { transform: translateY(-100%); opacity: 1; }
          80%  { transform: translateY(250%);  opacity: 1; }
          81%  { opacity: 0; }
          100% { transform: translateY(-100%); opacity: 0; }
        }
      `}</style>
    </section>
  )
}
