'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

/**
 * MetaSection — "このサイト自体が証明"
 *
 * Values「03 BUILD つくる。」からの伏線回収。
 * 短くて強い、黒背景（Proofに続く黒→白のコントラスト切り替えをここで白に戻す）。
 * 白背景にして、Contactへの流れの前にリズムを一度リセット。
 *
 * コピー骨子（ディレクター決定）:
 *   「このサイトも、自分たちでつくった。」
 *   — 外注していません。設計も、コードも、アニメーションも。
 *     つくれる会社が選ぶSaaSだから、本物です。
 */

// 技術スタック — monoラベルでリスト表示
const STACK = [
  { name: 'Next.js 14',           role: 'フレームワーク' },
  { name: 'TypeScript',           role: '型安全' },
  { name: 'Tailwind CSS',         role: 'スタイリング' },
  { name: 'GSAP + ScrollTrigger', role: 'スクロール演出' },
  { name: 'Lenis',                role: 'スムーススクロール' },
] as const

// ─── StackItem ────────────────────────────────────────────────────────────────

function StackItem({ name, role, index }: { name: string; role: string; index: number }) {
  const ref = useRef<HTMLLIElement>(null)

  useGSAP(() => {
    const el = ref.current
    if (!el) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.set(el, { x: -16, opacity: 0 })
    gsap.to(el, {
      x: 0,
      opacity: 1,
      duration: 0.55,
      ease: 'power2.out',
      delay: index * 0.08,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    })
  }, { scope: ref })

  return (
    <li
      ref={ref}
      className="flex items-center justify-between py-3 border-b border-gs-100 group"
      style={{ opacity: 0 }}
    >
      <div className="flex items-center gap-4">
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: 'var(--color-signal)' }}
          aria-hidden
        />
        <span
          className="label-mono text-ink group-hover:text-signal transition-colors duration-200"
          style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}
        >
          {name}
        </span>
      </div>
      <span
        className="label-mono text-gs-400"
        style={{ fontSize: '0.6rem', letterSpacing: '0.08em' }}
      >
        {role}
      </span>
    </li>
  )
}

// ─── MetaSection ─────────────────────────────────────────────────────────────

export function MetaSection() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const el = containerRef.current
    if (!el) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const eyebrow  = el.querySelector<HTMLElement>('.meta-eyebrow')
    const headline = el.querySelector<HTMLElement>('.meta-headline')
    const sub1     = el.querySelector<HTMLElement>('.meta-sub-1')
    const sub2     = el.querySelector<HTMLElement>('.meta-sub-2')
    const link     = el.querySelector<HTMLElement>('.meta-link')

    const targets = [eyebrow, headline, sub1, sub2, link].filter(Boolean) as HTMLElement[]
    gsap.set(targets, { y: 20, opacity: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 78%',
        toggleActions: 'play none none none',
      },
    })

    targets.forEach((t, i) => {
      tl.to(t, { y: 0, opacity: 1, duration: i === 1 ? 0.8 : 0.6, ease: 'power3.out' }, i * 0.1)
    })

    return () => tl.kill()
  }, { scope: containerRef })

  return (
    <section
      id="meta"
      ref={containerRef}
      className="py-section-lg section-padding bg-paper"
    >
      <div className="max-width-container">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-16 lg:gap-24 items-start">

          {/* ── 左: コピー ── */}
          <div>
            <p
              className="meta-eyebrow label-mono text-gs-500 mb-10"
              style={{ opacity: 0 }}
            >
              Meta — このサイトについて
            </p>

            {/* メインヘッドライン（泣き別れ防止: 各文節を inline-block で折り返し禁止、span間に空白が入らないよう連結） */}
            <h2
              className="meta-headline font-display font-black text-ink tracking-ja-tight leading-[1.1] mb-10 sm:mb-12"
              style={{
                fontSize: 'clamp(1.75rem, 5vw, 4.5rem)',
                opacity: 0,
              }}
            ><span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>このサイトも、</span><br /><span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>自分たちで</span><span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>つくった。</span></h2>

            {/* サブコピー1（常体に統一） */}
            <p
              className="meta-sub-1 font-ja font-light text-gs-500 tracking-ja-normal leading-[1.9] mb-6"
              style={{ fontSize: 'clamp(0.9375rem, 1.4vw, 1.0625rem)', maxWidth: '36em', opacity: 0 }}
            >
              外注していない。設計も、コードも、アニメーションも。<br />
              Next.js + GSAP + Lenis で組み上げた、Grayscale自身の技術力の証明だ。
            </p>

            {/* サブコピー2（常体に統一） */}
            <p
              className="meta-sub-2 font-ja font-light text-gs-500 tracking-ja-normal leading-[1.9] mb-12"
              style={{ fontSize: 'clamp(0.9375rem, 1.4vw, 1.0625rem)', maxWidth: '36em', opacity: 0 }}
            >
              つくれる会社が選ぶSaaSだから、本物だ。<br />
              提案するツールの何がいいかを、自分たちで実証しながら選んでいる。
            </p>

            {/* View Source リンク */}
            <a
              href="https://github.com/uichior/grayscale-hp"
              target="_blank"
              rel="noopener noreferrer"
              className="meta-link inline-flex items-center gap-3 group"
              style={{ opacity: 0 }}
              aria-label="GitHubでソースコードを見る（新しいタブで開きます）"
            >
              <span
                className="font-display font-semibold text-ink group-hover:text-signal transition-colors duration-200 tracking-ja-snug"
                style={{ fontSize: 'clamp(0.875rem, 1.3vw, 1rem)' }}
              >
                View Source
              </span>
              <span
                className="label-mono text-gs-400 group-hover:text-signal transition-colors duration-200"
                style={{ fontSize: '0.65rem', letterSpacing: '0.12em' }}
              >
                github.com/uichior/grayscale-hp ↗
              </span>
            </a>
          </div>

          {/* ── 右: 技術スタック ── */}
          <div className="lg:pt-[6.5rem]">
            <p
              className="label-mono text-gs-500 mb-6"
              style={{ fontSize: '0.65rem', letterSpacing: '0.12em' }}
            >
              Tech Stack
            </p>
            <ul>
              {STACK.map((item, i) => (
                <StackItem key={item.name} name={item.name} role={item.role} index={i} />
              ))}
            </ul>

            {/* BUILD との呼応 */}
            <div className="mt-10 pt-8 border-t border-gs-100">
              <p
                className="label-mono text-gs-400 mb-2"
                style={{ fontSize: '0.6rem', letterSpacing: '0.1em' }}
              >
                03 / BUILD — つくる。
              </p>
              <p
                className="font-ja font-light text-gs-400 leading-[1.8] tracking-ja-normal"
                style={{ fontSize: 'clamp(0.8125rem, 1.1vw, 0.9375rem)' }}
              >
                足りなければ、つくる。<br />
                つくれるから、本当の意味で選べる。
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
