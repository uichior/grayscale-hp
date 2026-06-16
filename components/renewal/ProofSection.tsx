'use client'

import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

/**
 * ProofSection — 実績・数字
 *
 * 「製造業で10年DX」を定量で見せるセクション。
 * 確実に真実と言える「現場経験10年」のみを主役の数字として扱う
 * （平均削減率・月間削減時間の仮置き値は星さん判断により非掲載）。
 *
 * 取り扱いSaaS: ロゴ画像は使わず（ブランドガイドライン確認前）、
 * サービス名タイポグラフィで掲載。ロゴ差し替え可能な構造。
 */

// ─── データ定数 ─────────────────────────────────────────────────────────────

/** 主役の数字 — 確定値のみ（製造業DXの現場経験10年） */
const HERO_STAT = {
  prefix: '',
  value: 10,
  suffix: '年',
  label: '製造業DXの現場経験',
} as const

/** 取り扱いSaaS — ロゴ差し替え可能な構造（ブランドガイドライン確認後） */
const SAAS_LIST = [
  { name: 'SmartHR',            category: '人事・労務',           logoAvailable: false },
  { name: 'Google Workspace',   category: 'コラボレーション',      logoAvailable: false },
  { name: 'freee',              category: '会計・財務',            logoAvailable: false },
  { name: 'Slack',              category: 'チームコミュニケーション', logoAvailable: false },
  { name: 'Notion',             category: 'ドキュメント・ナレッジ',  logoAvailable: false },
  { name: 'kintone',            category: '業務アプリ構築',         logoAvailable: false },
] as const

// ─── CountUp Hook ────────────────────────────────────────────────────────────

/** ScrollTrigger でビュー内に入ったらカウントアップを1回だけ実行 */
function useCountUp(
  targetValue: number,
  options: { duration?: number; start?: number } = {}
) {
  const { duration = 1.8, start = 0 } = options
  const [display, setDisplay] = useState(start)
  const hasRun = useRef(false)
  const triggerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = triggerRef.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      onEnter: () => {
        if (hasRun.current) return
        hasRun.current = true

        if (prefersReduced) {
          setDisplay(targetValue)
          return
        }

        gsap.to({ val: start }, {
          val: targetValue,
          duration,
          ease: 'power2.out',
          onUpdate: function () {
            setDisplay(Math.round(this.targets()[0].val))
          },
        })
      },
    })

    return () => trigger.kill()
  }, [targetValue, duration, start])

  return { display, triggerRef }
}

// ─── StatCard ────────────────────────────────────────────────────────────────

interface StatItem {
  prefix: string
  value: number
  suffix: string
  label: string
}

/**
 * HeroStat — 主役の数字（現場経験10年）。
 * 巨大なカウントアップ数字＋右側にリードコピーを添えて、
 * 数字が1つでも間が持つ横並びレイアウトにする。
 */
function HeroStat({ stat }: { stat: StatItem }) {
  const { display, triggerRef } = useCountUp(stat.value, { duration: 1.8 })
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const el = ref.current
    if (!el) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const lead = el.querySelector<HTMLElement>('.stat-lead')
    gsap.set(el, { y: 28, opacity: 0 })
    if (lead) gsap.set(lead, { y: 16, opacity: 0 })

    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none none' },
    })
    tl.to(el, { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' })
    if (lead) tl.to(lead, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4')
  }, { scope: ref })

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-[auto_1fr] items-center gap-8 md:gap-16 border-t border-gs-700 pt-10 sm:pt-12"
      style={{ opacity: 0 }}
    >
      {/* トリガー要素（CountUp Hook 用） */}
      <span ref={triggerRef as React.RefObject<HTMLSpanElement>} aria-hidden className="sr-only">
        {stat.value}
      </span>

      {/* 数字 — role="img" でスクリーンリーダー向けラベルを付与 */}
      <div className="flex items-baseline gap-2" role="img" aria-label={`${stat.value}${stat.suffix}`}>
        <span
          className="font-display font-black leading-none"
          style={{ fontSize: 'clamp(5rem, 16vw, 12rem)', color: 'var(--color-signal)' }}
          aria-hidden
        >
          {display}
        </span>
        <span
          className="font-display font-light text-gs-400 leading-none"
          style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}
          aria-hidden
        >
          {stat.suffix}
        </span>
      </div>

      {/* リードコピー */}
      <div className="stat-lead" style={{ opacity: 0 }}>
        <p
          className="font-ja font-medium text-paper tracking-ja-snug mb-4"
          style={{ fontSize: 'clamp(1.125rem, 2vw, 1.5rem)' }}
        >
          {stat.label}
        </p>
        <p
          className="font-ja font-light text-gs-400 leading-[1.9] tracking-ja-normal"
          style={{ fontSize: 'clamp(0.9375rem, 1.4vw, 1.0625rem)', maxWidth: '30em' }}
        >
          ツール選定の失敗も、現場に定着させる苦しみも、<br className="hidden sm:block" />
          すべて自分の手で経験してきた。だから、<br className="hidden sm:block" />
          「使われないDX」が何を意味するか、腹でわかっている。
        </p>
      </div>
    </div>
  )
}

// ─── ProofSection ────────────────────────────────────────────────────────────

export function ProofSection() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const el = containerRef.current
    if (!el) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const eyebrow = el.querySelector<HTMLElement>('.proof-eyebrow')
    const heading = el.querySelector<HTMLElement>('.proof-heading')

    if (eyebrow) gsap.set(eyebrow, { y: 12, opacity: 0 })
    if (heading) gsap.set(heading, { y: 20, opacity: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
    })

    if (eyebrow) tl.to(eyebrow, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' })
    if (heading) tl.to(heading, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.25')

    return () => tl.kill()
  }, { scope: containerRef })

  return (
    <section
      id="proof"
      ref={containerRef}
      className="py-section-lg section-padding bg-ink"
    >
      <div className="max-width-container">

        {/* ── ヘッダー ── */}
        <div className="mb-16 sm:mb-20">
          <p
            className="proof-eyebrow label-mono text-gs-400 mb-8"
            style={{ opacity: 0 }}
          >
            Numbers — 実績
          </p>
          <h2
            className="proof-heading font-display font-black text-paper tracking-ja-tight leading-[1.0]"
            style={{
              fontSize: 'clamp(2rem, 5.5vw, 4.5rem)',
              opacity: 0,
            }}
          >
            現場でつくった、<br />
            <span className="text-gs-500 font-light">数字がある。</span>
          </h2>
        </div>

        {/* ── 主役の数字（現場経験10年） ── */}
        <div className="mb-20 sm:mb-28">
          <HeroStat stat={HERO_STAT} />
        </div>

        {/* ── 取り扱いSaaS ── */}
        <SaasBlock />

      </div>
    </section>
  )
}

// ─── SaasBlock ───────────────────────────────────────────────────────────────

function SaasBlock() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const el = ref.current
    if (!el) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const items = el.querySelectorAll<HTMLElement>('.saas-item')
    gsap.set(items, { y: 16, opacity: 0 })
    gsap.to(items, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.07,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    })
  }, { scope: ref })

  return (
    <div ref={ref}>
      <div className="flex items-center gap-4 mb-8">
        <p
          className="label-mono text-gs-400"
          style={{ fontSize: '0.65rem', letterSpacing: '0.12em' }}
        >
          取り扱いSaaS — Partner Solutions
        </p>
        {/* TODO(星さん確認): ブランドガイドライン確認後、logoAvailable=true にしてロゴ画像に差し替え */}
        <span
          className="label-mono text-gs-400 border border-gs-700 px-2 py-0.5"
          style={{ fontSize: '0.55rem', letterSpacing: '0.08em' }}
        >
          ロゴ表示は許諾確認後
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px border border-gs-800">
        {SAAS_LIST.map((saas) => (
          <div
            key={saas.name}
            className="saas-item group flex flex-col items-start justify-between p-5 sm:p-6
                       border-0 bg-gs-950 hover:bg-gs-900 transition-colors duration-300"
            style={{ opacity: 0 }}
          >
            {/*
              TODO(星さん確認): logoAvailable=true になったら
              <Image src={`/logos/${saas.name.toLowerCase().replace(/ /g, '-')}.svg`} ... />
              に差し替え（ブランドガイドライン遵守・白黒バージョン推奨）
            */}
            <p
              className="font-display font-semibold text-gs-200 group-hover:text-paper transition-colors tracking-ja-snug leading-tight mb-3"
              style={{ fontSize: 'clamp(0.875rem, 1.3vw, 1rem)' }}
            >
              {saas.name}
            </p>
            <span
              className="label-mono text-gs-400 group-hover:text-gs-200 transition-colors"
              style={{ fontSize: '0.55rem', letterSpacing: '0.1em', lineHeight: 1.5 }}
            >
              {saas.category}
            </span>
          </div>
        ))}
      </div>

      <p
        className="mt-4 label-mono text-gs-400"
        style={{ fontSize: '0.6rem', letterSpacing: '0.08em' }}
      >
        ※ 上記以外のSaaSについてもご相談ください。お客様の課題に合わせて最適なツールをご提案します。
      </p>
    </div>
  )
}
