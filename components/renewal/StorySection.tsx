'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

/**
 * StorySection — "なぜGrayscaleは本物なのか"
 *
 * 4ビートのスクロールストーリーテリング:
 *   Beat 1: 「ほとんどの代理店は、売って終わる。」  — paper背景・静かな挑発
 *   Beat 2: 「うちは、現場から来た。」              — ink背景に反転（物語の転調）
 *   Beat 3: 「だから、紹介で終わらない。」          — ink背景・一気通貫フロー図
 *   Beat 4: 「本当にいいものしか、紹介しない。」    — ink背景・山場（最も強く）
 *
 * 演出:
 *   - GSAP ScrollTrigger one-time reveal（scrub: false / pin: false）
 *   - 行単位のテキストリビール（overflow-hidden + translateY）
 *   - prefers-reduced-motion: 全て即時表示
 */

interface BeatProps {
  id: string
  beat: string
  statement: string
  statementAccent?: string // signal カラーで強調する文字（statement末尾）
  body: string
  children?: React.ReactNode
  dark: boolean
  isClimax?: boolean
}

function Beat({ id, beat, statement, statementAccent, body, children, dark, isClimax }: BeatProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    // 行ごとのリビール対象
    const lines = el.querySelectorAll<HTMLElement>('.story-line')
    const supports = el.querySelectorAll<HTMLElement>('.story-support')

    gsap.set(lines, { y: '110%' })
    gsap.set(supports, { y: 24, opacity: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 72%',
        toggleActions: 'play none none none',
      },
    })

    tl.to(lines, {
      y: '0%',
      duration: 0.85,
      ease: 'power3.out',
      stagger: 0.08,
    }).to(
      supports,
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        ease: 'power2.out',
        stagger: 0.1,
      },
      '-=0.4'
    )

    return () => {
      tl.kill()
    }
  }, { scope: ref })

  const textColor = dark ? 'text-paper' : 'text-ink'
  const mutedColor = dark ? 'text-gs-500' : 'text-gs-400'
  const borderColor = dark ? 'border-gs-700' : 'border-gs-100'

  return (
    <div
      id={id}
      ref={ref}
      className={`py-section-md section-padding ${dark ? 'bg-ink' : 'bg-paper'}`}
    >
      <div className="max-width-container">
        {/* Beat ラベル */}
        <div className="story-support" style={{ opacity: 0 }}>
          <p className={`label-mono ${mutedColor} mb-10 sm:mb-14`}>{beat}</p>
        </div>

        {/* メインステートメント */}
        <div className={`border-t ${borderColor} pt-10 sm:pt-14`}>
          <div
            className="overflow-hidden"
            aria-label={statement + (statementAccent ?? '')}
          >
            <p
              className={`story-line font-display font-black tracking-ja-tight ${textColor} ${
                isClimax
                  ? 'leading-none'
                  : 'leading-[1.0]'
              }`}
              style={{
                fontSize: isClimax
                  ? 'clamp(2.5rem, 8vw, 7rem)'
                  : 'clamp(2rem, 6vw, 5.5rem)',
              }}
            >
              {statement}
              {statementAccent && (
                <span style={{ color: 'var(--color-signal)' }}>{statementAccent}</span>
              )}
            </p>
          </div>

          {/* サブ本文 */}
          <div className="mt-10 sm:mt-14 max-w-2xl story-support" style={{ opacity: 0 }}>
            <p
              className={`font-ja font-light tracking-ja-normal leading-[1.9] ${
                dark ? 'text-gs-400' : 'text-gs-500'
              }`}
              style={{ fontSize: 'clamp(0.9375rem, 1.4vw, 1.0625rem)' }}
            >
              {body}
            </p>
          </div>

          {/* オプションの子要素（フロー図など） */}
          {children && (
            <div className="mt-14 sm:mt-20 story-support" style={{ opacity: 0 }}>
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/** Beat3 のフロー図: 選定 → 導入 → 定着 → 内製化 → 自社開発 */
function FlowDiagram() {
  const steps = [
    { en: 'SELECT', ja: '選定' },
    { en: 'DEPLOY', ja: '導入' },
    { en: 'ADOPT', ja: '定着' },
    { en: 'INTERN', ja: '内製化支援' },
    { en: 'BUILD', ja: '自社開発' },
  ]

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <ol className="flex items-center gap-0 min-w-max">
        {steps.map((step, i) => (
          <li key={step.en} className="flex items-center">
            <div className="flex flex-col items-center gap-2 px-4 sm:px-6">
              <span
                className="label-mono text-gs-600"
                style={{ fontSize: '0.6rem', letterSpacing: '0.12em' }}
              >
                {step.en}
              </span>
              <span
                className="font-display font-semibold text-paper tracking-ja-snug"
                style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.0625rem)' }}
              >
                {step.ja}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="w-8 sm:w-12 h-px flex-shrink-0"
                style={{ backgroundColor: 'var(--color-gray-700)' }}
                aria-hidden
              />
            )}
          </li>
        ))}
      </ol>
      <p
        className="mt-6 label-mono text-gs-700"
        style={{ fontSize: '0.6rem', letterSpacing: '0.12em' }}
      >
        — 一気通貫。どこからでも、最後まで。
      </p>
    </div>
  )
}

export function StorySection() {
  return (
    <div id="story">
      {/* ── Beat 1: 静かな挑発（paper背景） ── */}
      <Beat
        id="story-beat-1"
        beat="Why Grayscale — 01"
        statement="ほとんどの代理店は、売って終わる。"
        dark={false}
        body="ツールを提案して、契約して、サポートページのURLを渡して終わり。それが業界の標準だった。現場に定着するかどうかは、お客さん任せで。"
      />

      {/* ── Beat 2: 現場から来た（ink背景に反転） ── */}
      <Beat
        id="story-beat-2"
        beat="Why Grayscale — 02"
        statement="うちは、現場から来た。"
        dark={true}
        body="製造業の現場でDXを10年、自分の手でやってきた。ツール選定の失敗も、現場に定着させる苦しみも、全部自分で経験している。だから「使われないDX」が何を意味するか、腹でわかっている。"
      />

      {/* ── Beat 3: 紹介で終わらない（ink背景・フロー図） ── */}
      <Beat
        id="story-beat-3"
        beat="Why Grayscale — 03"
        statement="だから、紹介で終わらない。"
        dark={true}
        body="選定から導入、定着、内製化支援、そして必要なら自社開発まで。この一気通貫の流れが、うちの仕事の形。"
      >
        <FlowDiagram />
      </Beat>

      {/* ── Beat 4: 本当にいいものしか（山場） ── */}
      <Beat
        id="story-beat-4"
        beat="Why Grayscale — 04"
        statement="本当にいいものしか、紹介しない"
        statementAccent="。"
        dark={true}
        isClimax={true}
        body={'それは信念であると同時に、“つくれる人間”にしかできない判断。何がいいかを知っているだけでなく、足りない部分を自分でつくれるから、本当の意味で御社に合う選択ができる。'}
      />
    </div>
  )
}
