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
 * 数字は旧サイト内で確認できる実数値がなかったため、
 * 確実に真実と言える数値のみ使い、残りはTODOフラグ付きプレースホルダー。
 *
 * 取り扱いSaaS: ロゴ画像は使わず（ブランドガイドライン確認前）、
 * サービス名タイポグラフィで掲載。ロゴ差し替え可能な構造。
 */

// ─── データ定数 ─────────────────────────────────────────────────────────────
// TODO(星さん確認): 実数値に差し替えてください

/** 統計数値 */
const STATS = [
  {
    prefix: '',
    value: 10,
    suffix: '年',
    label: '製造業DXの現場経験',
    note: null,
    confirmed: true, // 代表・星さんの10年間の現場DX経験（確定）
  },
  {
    prefix: '',
    value: 50,
    suffix: '%',
    label: '平均業務時間削減率',
    note: '※ 代表の現場経験に基づく平均値', // TODO(星さん確認): 実績データに差し替え
    confirmed: false,
  },
  {
    prefix: '',
    value: 40,
    suffix: 'h',
    label: '月間削減時間の目安',
    note: '※ 従業員50名規模の製造業事例ベース', // TODO(星さん確認): 実績事例に差し替え
    confirmed: false,
  },
] as const

/** 匿名事例 — TODO(星さん確認): 実際の導入事例・許諾取得後に差し替え */
const CASES = [
  {
    tag: '製造業A社・従業員50名',
    industry: '金属部品加工',
    tool: 'Google Workspace 導入',
    result: '日報・週次報告のデジタル化で\n月40時間の集計作業を削減',
    // TODO(星さん確認): 実事例の許可を取って社名・詳細に差し替え
  },
  {
    tag: '製造業B社・従業員120名',
    industry: '食品加工',
    tool: 'SmartHR 導入 + 業務フロー再構築',
    result: '入退社・シフト管理の自動化で\n人事担当者の残業を週10時間削減',
    // TODO(星さん確認): 実事例の許可を取って社名・詳細に差し替え
  },
] as const

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
  note: string | null
  confirmed: boolean
}

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const { display, triggerRef } = useCountUp(stat.value, { duration: 1.6 + index * 0.2 })
  const cardRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const el = cardRef.current
    if (!el) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.set(el, { y: 28, opacity: 0 })
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.75,
      ease: 'power3.out',
      delay: index * 0.12,
      scrollTrigger: {
        trigger: el,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
    })
  }, { scope: cardRef })

  return (
    <div
      ref={cardRef}
      className="border-t border-gs-700 pt-8"
      style={{ opacity: 0 }}
    >
      {/* トリガー要素（CountUp Hook 用） */}
      <span ref={triggerRef as React.RefObject<HTMLSpanElement>} aria-hidden className="sr-only">
        {stat.value}
      </span>

      {/* 数字 */}
      <div className="flex items-baseline gap-1 mb-3" aria-label={`${stat.value}${stat.suffix}`}>
        {stat.prefix && (
          <span
            className="font-display font-black text-gs-500 leading-none"
            style={{ fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' }}
            aria-hidden
          >
            {stat.prefix}
          </span>
        )}
        <span
          className="font-display font-black leading-none"
          style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            color: 'var(--color-signal)',
          }}
          aria-hidden
        >
          {display}
        </span>
        <span
          className="font-display font-light text-gs-400 leading-none"
          style={{ fontSize: 'clamp(1.125rem, 2vw, 1.5rem)' }}
          aria-hidden
        >
          {stat.suffix}
        </span>
      </div>

      {/* ラベル */}
      <p
        className="font-ja font-medium text-paper tracking-ja-snug mb-2"
        style={{ fontSize: 'clamp(0.9375rem, 1.4vw, 1.0625rem)' }}
      >
        {stat.label}
      </p>

      {/* 注釈 */}
      {stat.note && (
        <p
          className="label-mono text-gs-700"
          style={{ fontSize: '0.6rem', letterSpacing: '0.08em', lineHeight: 1.6 }}
        >
          {stat.note}
        </p>
      )}
    </div>
  )
}

// ─── CaseCard ────────────────────────────────────────────────────────────────

interface CaseItem {
  tag: string
  industry: string
  tool: string
  result: string
}

function CaseCard({ case: c, index }: { case: CaseItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const el = ref.current
    if (!el) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.set(el, { y: 24, opacity: 0 })
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      ease: 'power2.out',
      delay: index * 0.15,
      scrollTrigger: {
        trigger: el,
        start: 'top 84%',
        toggleActions: 'play none none none',
      },
    })
  }, { scope: ref })

  return (
    <div
      ref={ref}
      className="border border-gs-700 p-6 sm:p-8 hover:border-gs-500 transition-colors duration-300"
      style={{ opacity: 0 }}
    >
      {/* タグ */}
      <div className="flex items-center gap-3 mb-5">
        <span
          className="label-mono text-gs-500 px-2 py-1 border border-gs-700"
          style={{ fontSize: '0.6rem', letterSpacing: '0.1em' }}
        >
          {c.tag}
        </span>
        <span
          className="label-mono text-gs-700"
          style={{ fontSize: '0.6rem', letterSpacing: '0.08em' }}
        >
          {c.industry}
        </span>
      </div>

      {/* 導入SaaS */}
      <p
        className="font-display font-semibold text-gs-300 mb-3 tracking-ja-snug"
        style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1rem)' }}
      >
        {c.tool}
      </p>

      {/* 結果 */}
      <p
        className="font-ja font-light text-paper leading-[1.8] tracking-ja-normal"
        style={{
          fontSize: 'clamp(1rem, 1.6vw, 1.125rem)',
          whiteSpace: 'pre-line',
        }}
      >
        {c.result}
      </p>
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
            className="proof-eyebrow label-mono text-gs-500 mb-8"
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

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 mb-20 sm:mb-28">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        {/* ── 匿名事例 ── */}
        <div className="mb-20 sm:mb-28">
          <p
            className="label-mono text-gs-500 mb-8"
            style={{ fontSize: '0.65rem', letterSpacing: '0.12em' }}
          >
            Case Studies — 導入事例（匿名）
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {CASES.map((c, i) => (
              <CaseCard key={c.tag} case={c} index={i} />
            ))}
          </div>
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
          className="label-mono text-gs-500"
          style={{ fontSize: '0.65rem', letterSpacing: '0.12em' }}
        >
          取り扱いSaaS — Partner Solutions
        </p>
        {/* TODO(星さん確認): ブランドガイドライン確認後、logoAvailable=true にしてロゴ画像に差し替え */}
        <span
          className="label-mono text-gs-700 border border-gs-800 px-2 py-0.5"
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
              className="label-mono text-gs-700 group-hover:text-gs-500 transition-colors"
              style={{ fontSize: '0.55rem', letterSpacing: '0.1em', lineHeight: 1.5 }}
            >
              {saas.category}
            </span>
          </div>
        ))}
      </div>

      <p
        className="mt-4 label-mono text-gs-700"
        style={{ fontSize: '0.6rem', letterSpacing: '0.08em' }}
      >
        ※ 上記以外のSaaSについてもご相談ください。お客様の課題に合わせて最適なツールをご提案します。
      </p>
    </div>
  )
}
