'use client'

/**
 * MetaSection — "このサイト自体が証明" プレースホルダー
 *
 * TODO(後続エージェント):
 * - 「このサイトはGrayscale自身が作りました」というメタ言及
 * - 使用技術スタック（Next.js / TypeScript / Framer Motion / GSAP / Lenis）を
 *   タイポグラフィで魅せる
 * - サイトのパフォーマンス指標（Lighthouse スコア）をリアルタイム or 静的に掲載
 * - インタラクティブなデモ要素があると◎
 */
export function MetaSection() {
  const stack = [
    'Next.js 14',
    'TypeScript',
    'Tailwind CSS',
    'Framer Motion',
    'GSAP + ScrollTrigger',
    'Lenis',
  ]

  return (
    <section
      id="meta"
      className="py-section-lg px-6 bg-paper border-t border-gs-100"
    >
      <div className="max-width-container">
        {/* Eyebrow */}
        <p className="label-mono text-gs-500 mb-12">
          Meta
        </p>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-heading font-display font-black text-ink tracking-ja-tight mb-8">
              このサイト自体が、<br />
              技術力の証明です。
            </h2>
            <p className="text-body text-gs-500 leading-relaxed">
              Grayscaleは、このコーポレートサイトをゼロから自社で設計・実装しています。
              先進スタジオと並ぶクオリティのサイトを自分たちで作れる会社が選んだSaaS・提案する導入方法だから、信頼できる。
            </p>
          </div>

          <div>
            <p className="label-mono text-gs-500 mb-6">技術スタック</p>
            <ul className="space-y-3">
              {stack.map((item) => (
                <li key={item} className="flex items-center gap-4 border-b border-gs-100 pb-3">
                  <span className="w-2 h-2 bg-signal rounded-full flex-shrink-0" />
                  <span className="text-sm-fluid font-medium text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
