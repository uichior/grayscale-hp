'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

/**
 * ValuesSection — 3つの提供価値
 *
 * ヒーローの「選ぶ。導く。つくる。」と SELECT / GUIDE / BUILD ラベルを呼応させる。
 *
 * レイアウト:
 *   - 縦に大きく3ブロック
 *   - 番号 (01/02/03) を巨大タイポグラフィ要素として扱う（薄いグレー、背景レイヤー）
 *   - 差し色 #FF4D00 は番号のみ（ホバー時に小さく演出）
 *   - GSAP ScrollTrigger で各ブロックを順次フェードスライドイン（one-time）
 *   - prefers-reduced-motion: 即時表示
 */

interface ValueItem {
  number: string
  enLabel: string
  jaLabel: string        // Hero の「選ぶ。導く。つくる。」と呼応
  tagline: string        // 一言キャッチ
  title: string
  body: string
  bullets: string[]
}

const VALUES: ValueItem[] = [
  {
    number: '01',
    enLabel: 'SELECT',
    jaLabel: '選ぶ。',
    tagline: '本当にいいものしか、扱わない。',
    title: '目利きの代理店',
    body: 'SmartHR・Google Workspace をはじめとするSaaSの選定・導入提案。現場を10年知る人間の目利きだから、御社に合わないものは売らない。「入れてみたら使われなかった」は起こさせない。',
    bullets: [
      'SmartHR（人事・労務）',
      'Google Workspace（コラボレーション）',
      '中小製造業に合うSaaSのみ扱う',
      '合わないと判断したら正直に断る',
    ],
  },
  {
    number: '02',
    enLabel: 'GUIDE',
    jaLabel: '導く。',
    tagline: '入れて終わりに、しない。',
    title: '伴走するコンサル',
    body: '導入設計・業務フロー再構築・社内研修・定着支援・内製化支援まで。ツールが業務に溶けるまで離れない。現場の抵抗感の正体を読み解き、人と組織が変わるまで伴走する。',
    bullets: [
      '導入設計・業務フロー再構築',
      '社内研修・ハンズオン支援',
      '定着フォロー・内製化支援',
      '現場の抵抗を一緒に乗り越える',
    ],
  },
  {
    number: '03',
    enLabel: 'BUILD',
    jaLabel: 'つくる。',
    tagline: '足りなければ、つくる。',
    title: 'つくれる開発会社',
    body: 'SaaSで届かない領域は自社開発で埋める。このコーポレートサイトも自分たちでつくった。代理店でありながら開発もできる——それがGrayscaleにしかできない判断を可能にしている。',
    bullets: [
      '業務システム・社内ツール開発',
      'SaaSとの連携・自動化システム',
      'このサイト自体が技術力の証明',
      '作れるから、本当の意味で選べる',
    ],
  },
]

interface ValueBlockProps {
  item: ValueItem
  index: number
}

function ValueBlock({ item, index }: ValueBlockProps) {
  const blockRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const el = blockRef.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const content = el.querySelector<HTMLElement>('.value-content')
    const number = el.querySelector<HTMLElement>('.value-number-bg')

    if (content) gsap.set(content, { y: 32, opacity: 0 })
    if (number) gsap.set(number, { y: 16, opacity: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    })

    if (number) {
      tl.to(number, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      })
    }

    if (content) {
      tl.to(
        content,
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'power3.out',
        },
        number ? '-=0.4' : '0'
      )
    }

    return () => {
      tl.kill()
    }
  }, { scope: blockRef })

  const isLast = index === VALUES.length - 1

  return (
    <article
      ref={blockRef}
      className={`relative grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-0 border-t border-gs-100 pt-0 group ${
        isLast ? '' : ''
      }`}
    >
      {/* ─ 左カラム: 巨大番号 ─ */}
      <div className="relative flex items-start pt-10 sm:pt-14 pb-6 lg:pb-14 pr-0 lg:pr-8">
        {/* 番号（背景タイポ要素） */}
        <div
          className="value-number-bg select-none leading-none font-display font-black"
          style={{
            fontSize: 'clamp(6rem, 18vw, 14rem)',
            color: 'var(--color-gray-200)',
            lineHeight: 0.85,
            transition: 'color 0.3s ease',
          }}
          aria-hidden
        >
          <span
            className="group-hover:text-[color:var(--color-gray-300)] transition-colors duration-300"
            aria-hidden="true"
          >
            {item.number}
          </span>
        </div>

        {/* ラベル（左下に配置） */}
        <div className="absolute bottom-6 lg:bottom-14 left-0">
          <span
            className="label-mono text-gs-700"
            style={{ fontSize: '0.65rem', letterSpacing: '0.14em' }}
          >
            {item.enLabel}
          </span>
        </div>
      </div>

      {/* ─ 右カラム: コンテンツ ─ */}
      <div className="value-content pt-6 lg:pt-14 pb-14 sm:pb-20 lg:pl-8 xl:pl-12 border-t lg:border-t-0 lg:border-l border-gs-100">
        {/* ヒーローとの呼応: jaLabel（ウェイトグラデーション: 01=200, 02=500, 03=900） */}
        <p
          className="font-ja text-gs-300 tracking-ja-tight mb-3 leading-none select-none"
          aria-hidden
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.375rem)',
            fontWeight: index === 0 ? 200 : index === 1 ? 500 : 900,
          }}
        >
          {item.jaLabel}
        </p>

        {/* タグライン */}
        <p
          className="font-display font-black text-ink tracking-ja-tight leading-[1.05] mb-8 sm:mb-10"
          style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}
        >
          {item.tagline}
        </p>

        {/* タイトル */}
        <h3
          className="font-display font-semibold text-ink tracking-ja-snug mb-5 leading-tight"
          style={{ fontSize: 'clamp(1.0625rem, 1.8vw, 1.375rem)' }}
        >
          {item.title}
        </h3>

        {/* 本文 */}
        <p
          className="font-ja font-light text-gs-500 tracking-ja-normal leading-[1.9] mb-10 sm:mb-12"
          style={{ fontSize: 'clamp(0.9375rem, 1.3vw, 1.0625rem)', maxWidth: '42em' }}
        >
          {item.body}
        </p>

        {/* 箇条書き */}
        <ul className="space-y-3">
          {item.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-3"
            >
              <span
                className="mt-[0.45em] w-1 h-1 rounded-full flex-shrink-0"
                style={{ backgroundColor: 'var(--color-signal)' }}
                aria-hidden
              />
              <span
                className="font-ja font-light text-gs-500 tracking-ja-normal"
                style={{ fontSize: 'clamp(0.875rem, 1.1vw, 0.9375rem)', lineHeight: 1.7 }}
              >
                {bullet}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

export function ValuesSection() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const el = containerRef.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const eyebrow = el.querySelector<HTMLElement>('.values-eyebrow')
    const heading = el.querySelector<HTMLElement>('.values-heading')

    if (eyebrow) gsap.set(eyebrow, { y: 16, opacity: 0 })
    if (heading) gsap.set(heading, { y: 20, opacity: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    })

    if (eyebrow) tl.to(eyebrow, { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out' })
    if (heading) tl.to(heading, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.3')

    return () => tl.kill()
  }, { scope: containerRef })

  return (
    <section
      id="values"
      ref={containerRef}
      className="py-section-lg section-padding bg-paper"
    >
      <div className="max-width-container">
        {/* ── ヘッダー ── */}
        <div className="mb-16 sm:mb-20">
          <p className="values-eyebrow label-mono text-gs-700 mb-6" style={{ opacity: 0 }}>
            What We Do
          </p>
          <div className="overflow-hidden">
            {/* ウェイトグラデーション: ヒーローと呼応（200→500→900） */}
            <h2
              className="values-heading font-ja tracking-ja-tight leading-[1.0]"
              style={{
                fontSize: 'clamp(2rem, 5.5vw, 4.5rem)',
                opacity: 0,
                color: 'var(--color-ink)',
              }}
              aria-label="選ぶ。導く。つくる。"
            >
              <span style={{ fontWeight: 200 }}>選ぶ。</span>
              <span style={{ fontWeight: 500 }}>導く。</span>
              <span style={{ fontWeight: 900 }}>つくる。</span>
            </h2>
          </div>
        </div>

        {/* ── 3ブロック ── */}
        <div className="space-y-0">
          {VALUES.map((item, i) => (
            <ValueBlock key={item.number} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
