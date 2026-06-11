'use client'

/**
 * RenewalFooter — フッター / 会社概要
 *
 * 確定情報（RENEWAL_BRIEF.md §2）を正確に転記。
 * 黒背景で締める（Contactの黒→フッターの黒でページ末尾を重厚に）。
 * 巨大ワードマーク「GRAYSCALE」をタイポ要素として背景に敷く。
 */

// 確定情報（RENEWAL_BRIEF.md §2 より）
const COMPANY = {
  nameJa:    '株式会社Grayscale',
  nameEn:    'Grayscale Inc.',
  ceo:       '星 雄一郎',
  address:   '茨城県水戸市笠原町728-4',
  postalCode:'〒310-0852',
  founded:   '2025年7月7日',
  capital:   '100万円',
  tel:       '080-1011-7531',
  email:     'info@grayscale.jp',
  mission:   '製造業で10年間かけて培ったDX体験を、圧倒的なスピードと低価格でお届けし、共に成長していく。',
} as const

const SNS = [
  { label: 'Facebook', href: 'https://facebook.com/grayscale310' },
  { label: 'Instagram', href: 'https://instagram.com/grayscale310', handle: '@grayscale310' },
  { label: 'X',        href: 'https://x.com/grayscale310',         handle: '@grayscale310' },
] as const

const NAV = [
  { label: 'Story',   href: '#story'   },
  { label: 'Values',  href: '#values'  },
  { label: 'Proof',   href: '#proof'   },
  { label: 'Contact', href: '#contact' },
] as const

export function RenewalFooter() {
  const scrollTo = (href: string) => {
    if (typeof window === 'undefined') return
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      if (el) {
        // Lenis 経由でスムーススクロール（window.__lenis があれば）
        const lenis = (window as unknown as Record<string, unknown>).__lenis as
          | { scrollTo: (target: Element, opts?: Record<string, unknown>) => void }
          | undefined
        if (lenis?.scrollTo) {
          lenis.scrollTo(el, { offset: -80 })
        } else {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }
  }

  return (
    <footer className="relative overflow-hidden bg-ink">

      {/* ── 巨大バックグラウンドワードマーク ── */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 select-none pointer-events-none whitespace-nowrap"
        aria-hidden
        style={{
          fontSize: 'clamp(6rem, 22vw, 20rem)',
          fontFamily: 'var(--font-inter-var, Inter, system-ui, sans-serif)',
          fontWeight: 900,
          letterSpacing: '-0.05em',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.04)',
          lineHeight: 1,
          transform: 'translate(-50%, 15%)',
          userSelect: 'none',
        }}
      >
        GRAYSCALE
      </div>

      {/* ── メインコンテンツ ── */}
      <div className="relative z-10 section-padding pt-20 sm:pt-24 pb-10 sm:pb-12">
        <div className="max-width-container">

          {/* ── ミッション + ロゴ ── */}
          <div className="mb-16 sm:mb-20 border-b border-gs-800 pb-12 sm:pb-16">
            <p
              className="label-mono text-gs-700 mb-5"
              style={{ fontSize: '0.6rem', letterSpacing: '0.12em' }}
            >
              Mission
            </p>
            <p
              className="font-display font-light text-gs-400 tracking-ja-normal leading-[1.8]"
              style={{ fontSize: 'clamp(0.9375rem, 1.6vw, 1.125rem)', maxWidth: '42em' }}
            >
              {COMPANY.mission}
            </p>
          </div>

          {/* ── グリッド: ブランド / 会社概要 / ナビ / SNS ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-16 sm:mb-20">

            {/* ブランド */}
            <div>
              <p
                className="font-display font-black text-paper tracking-ja-tight leading-none mb-4"
                style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)' }}
              >
                Grayscale
              </p>
              <p
                className="font-ja font-light text-gs-500 tracking-ja-normal leading-[1.8]"
                style={{ fontSize: 'clamp(0.8125rem, 1.1vw, 0.9375rem)' }}
              >
                代理店 × コンサル × 開発を<br />
                一気通貫で。
              </p>
            </div>

            {/* 会社概要 */}
            <div>
              <p
                className="label-mono text-gs-700 mb-5"
                style={{ fontSize: '0.6rem', letterSpacing: '0.12em' }}
              >
                Company
              </p>
              <address className="not-italic space-y-2">
                <CompanyRow value={COMPANY.nameJa} />
                <CompanyRow label="代表取締役" value={COMPANY.ceo} />
                <CompanyRow label="所在地" value={`${COMPANY.postalCode} ${COMPANY.address}`} />
                <CompanyRow label="設立" value={COMPANY.founded} />
                <CompanyRow label="資本金" value={COMPANY.capital} />
              </address>
            </div>

            {/* 連絡先 */}
            <div>
              <p
                className="label-mono text-gs-700 mb-5"
                style={{ fontSize: '0.6rem', letterSpacing: '0.12em' }}
              >
                Contact
              </p>
              <div className="space-y-3">
                <div>
                  <p
                    className="label-mono text-gs-700 mb-1"
                    style={{ fontSize: '0.55rem', letterSpacing: '0.1em' }}
                  >
                    TEL
                  </p>
                  <a
                    href={`tel:${COMPANY.tel}`}
                    className="font-display font-light text-gs-400 hover:text-paper transition-colors duration-200 tracking-ja-snug"
                    style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1rem)' }}
                  >
                    {COMPANY.tel}
                  </a>
                </div>
                <div>
                  <p
                    className="label-mono text-gs-700 mb-1"
                    style={{ fontSize: '0.55rem', letterSpacing: '0.1em' }}
                  >
                    MAIL
                  </p>
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="font-display font-light text-gs-400 hover:text-paper transition-colors duration-200 tracking-ja-snug"
                    style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1rem)' }}
                  >
                    {COMPANY.email}
                  </a>
                </div>
              </div>
            </div>

            {/* ナビ + SNS */}
            <div>
              {/* ページナビ */}
              <p
                className="label-mono text-gs-700 mb-5"
                style={{ fontSize: '0.6rem', letterSpacing: '0.12em' }}
              >
                Navigate
              </p>
              <ul className="space-y-2 mb-8">
                {NAV.map(item => (
                  <li key={item.label}>
                    <button
                      onClick={() => scrollTo(item.href)}
                      className="font-display font-light text-gs-500 hover:text-paper transition-colors duration-200 tracking-ja-snug"
                      style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1rem)' }}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>

              {/* SNS */}
              <p
                className="label-mono text-gs-700 mb-4"
                style={{ fontSize: '0.6rem', letterSpacing: '0.12em' }}
              >
                Follow
              </p>
              <ul className="space-y-2">
                {SNS.map(s => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-display font-light text-gs-500 hover:text-paper transition-colors duration-200"
                      style={{ fontSize: 'clamp(0.8125rem, 1.1vw, 0.9375rem)' }}
                    >
                      {s.label}
                      {'handle' in s && (
                        <span
                          className="ml-2 label-mono text-gs-700"
                          style={{ fontSize: '0.55rem' }}
                        >
                          {(s as { handle?: string }).handle}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* ── ボトムバー ── */}
          <div className="border-t border-gs-800 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p
              className="label-mono text-gs-700"
              style={{ fontSize: '0.6rem', letterSpacing: '0.1em' }}
            >
              © 2026 {COMPANY.nameJa}. All rights reserved.
            </p>
            <p
              className="label-mono text-gs-800"
              style={{ fontSize: '0.55rem', letterSpacing: '0.1em' }}
            >
              Built in-house — no agencies, just code.
            </p>
          </div>

        </div>
      </div>

    </footer>
  )
}

// ─── CompanyRow ───────────────────────────────────────────────────────────────

function CompanyRow({ label, value }: { label?: string; value: string }) {
  return (
    <p
      className="font-ja font-light text-gs-500 tracking-ja-normal leading-[1.7]"
      style={{ fontSize: 'clamp(0.8125rem, 1.1vw, 0.9375rem)' }}
    >
      {label && (
        <span className="text-gs-700 mr-2">{label}</span>
      )}
      {value}
    </p>
  )
}
