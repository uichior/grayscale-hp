'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * RenewalHeader
 *
 * - 固定（fixed）。左: ワードマーク「Grayscale」、右: ナビ + CTA
 * - 初期: 透明背景
 * - スクロール後: backdrop-blur + 細いボーダー
 * - SP: ハンバーガー → フルスクリーンオーバーレイ（ESC / リンク / 外部クリックで閉じる）
 * - アンカーリンク: Lenis の scrollTo を使用（なければネイティブ smooth scroll フォールバック）
 */

interface NavItem {
  label: string
  labelJa: string
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Story',    labelJa: 'ストーリー', href: '#story'   },
  { label: 'Services', labelJa: 'サービス',   href: '#values'  },
  { label: 'Proof',    labelJa: '実績',       href: '#proof'   },
  { label: 'Contact',  labelJa: 'お問い合わせ', href: '#contact' },
]

function scrollToSection(href: string) {
  const id = href.replace('#', '')
  const el = document.getElementById(id)
  if (!el) return

  // Lenis グローバルインスタンスを取得（SmoothScroll が window に expose していない場合はフォールバック）
  const lenis = window.__lenis
  if (lenis && typeof lenis.scrollTo === 'function') {
    lenis.scrollTo(el, { offset: -80, duration: 1.2, easing: (t: number) => 1 - Math.pow(1 - t, 4) })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export function RenewalHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // スクロール検知
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // メニュー開閉でスクロールロック
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // ESC でメニューを閉じる
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setMenuOpen(false)
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    // 少し遅延させてメニューが閉じてからスクロール
    setTimeout(() => scrollToSection(href), 50)
  }

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'backdrop-blur-md border-b border-gs-100 bg-paper/80'
            : 'bg-transparent border-b border-transparent',
        ].join(' ')}
      >
        <div className="max-width-container mx-auto section-padding flex items-center justify-between h-16 sm:h-[72px]">
          {/* ── ワードマーク ── */}
          <a
            href="/"
            className="font-display font-bold text-ink text-lg sm:text-xl tracking-tight hover:opacity-70 transition-opacity duration-200 select-none"
            aria-label="Grayscale — ホームに戻る"
          >
            Grayscale
          </a>

          {/* ── デスクトップナビ ── */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="メインナビゲーション">
            {NAV_ITEMS.slice(0, 3).map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="group flex flex-col items-start text-left cursor-pointer bg-transparent border-none p-0"
                aria-label={`${item.label} — ${item.labelJa}`}
              >
                <span className="text-sm font-medium text-gs-500 group-hover:text-ink transition-colors duration-200 leading-none">
                  {item.label}
                </span>
                <span className="label-mono text-gs-400 group-hover:text-gs-500 transition-colors duration-200 mt-0.5">
                  {item.labelJa}
                </span>
              </button>
            ))}

            {/* CTA */}
            <button
              onClick={() => handleNavClick('#contact')}
              className="ml-2 inline-flex items-center gap-1.5 border border-ink text-ink text-sm font-medium font-display
                         px-5 py-2 hover:bg-ink hover:text-paper transition-colors duration-200 cursor-pointer bg-transparent"
              aria-label="お問い合わせ"
            >
              Contact
              <span aria-hidden className="text-xs">→</span>
            </button>
          </nav>

          {/* ── SP ハンバーガー ── */}
          <button
            className="md:hidden relative z-50 flex flex-col justify-center items-center w-10 h-10 gap-[6px] cursor-pointer bg-transparent border-none p-0"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
          >
            <span
              className={[
                'block w-6 h-px bg-ink transition-all duration-300 origin-center',
                menuOpen ? 'translate-y-[7px] rotate-45' : '',
              ].join(' ')}
            />
            <span
              className={[
                'block w-6 h-px bg-ink transition-all duration-300',
                menuOpen ? 'opacity-0 scale-x-0' : '',
              ].join(' ')}
            />
            <span
              className={[
                'block w-6 h-px bg-ink transition-all duration-300 origin-center',
                menuOpen ? '-translate-y-[7px] -rotate-45' : '',
              ].join(' ')}
            />
          </button>
        </div>
      </header>

      {/* ── SP フルスクリーンオーバーレイメニュー ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="ナビゲーションメニュー"
        className={[
          'fixed inset-0 z-40 bg-paper flex flex-col justify-center section-padding transition-all duration-500',
          menuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none',
        ].join(' ')}
      >
        <nav className="space-y-1" aria-label="モバイルナビゲーション">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className={[
                'block w-full text-left cursor-pointer bg-transparent border-none p-0',
                'transition-all duration-500',
                menuOpen
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0',
              ].join(' ')}
              style={{ transitionDelay: menuOpen ? `${i * 60 + 100}ms` : '0ms' }}
            >
              <span
                className="font-display font-black text-ink tracking-ja-tight leading-none block hover:text-gs-500 transition-colors duration-200"
                style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}
              >
                {item.label}
              </span>
              <span className="label-mono text-gs-400 mt-1 block">
                {item.labelJa}
              </span>
            </button>
          ))}
        </nav>

        {/* SP メニュー下部: CTA */}
        <div
          className={[
            'mt-12 transition-all duration-500',
            menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
          ].join(' ')}
          style={{ transitionDelay: menuOpen ? '360ms' : '0ms' }}
        >
          <button
            onClick={() => handleNavClick('#contact')}
            className="inline-flex items-center gap-2 bg-ink text-paper px-8 py-4 text-base font-medium font-display
                       hover:bg-gs-700 transition-colors duration-200 cursor-pointer border-none"
          >
            相談する（無料）
            <span aria-hidden>→</span>
          </button>
        </div>

        {/* 装飾: 右下に薄い label-mono */}
        <span
          aria-hidden
          className="label-mono text-gs-200 absolute bottom-8 right-6 sm:right-8 select-none"
        >
          MENU
        </span>
      </div>
    </>
  )
}
