'use client'

/**
 * ProofSection — "実績・数字" プレースホルダー
 *
 * TODO(後続エージェント):
 * - 定量エビデンスを大きな数字（signal カラー）で見せる
 * - 実数値は星さんに確認（作業時間◯%削減、◯社導入 など）
 * - 取り扱いSaaS ロゴを水平スクロールまたはグリッドで
 * - CountUp アニメーション（GSAP ScrollTrigger で）
 * - 匿名事例（製造業A社・従業員50名 等）
 */

const stats = [
  { value: '10', unit: '年', label: '製造業DXの現場経験' },
  { value: '??', unit: '社', label: '導入支援実績（確認中）' },
  { value: '??', unit: '%', label: '平均業務時間削減率（確認中）' },
]

const saasLogos = [
  { name: 'SmartHR', slug: 'smarthr' },
  { name: 'Google Workspace', slug: 'google-workspace' },
]

export function ProofSection() {
  return (
    <section
      id="proof"
      className="py-section-lg px-6 bg-gs-900 text-paper"
    >
      <div className="max-width-container">
        {/* Eyebrow */}
        <p className="label-mono text-gs-400 mb-12">
          Proof
        </p>

        <h2 className="text-heading font-display font-black text-paper tracking-ja-tight mb-20">
          数字で見る実績
        </h2>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-12 mb-24">
          {stats.map((s) => (
            <div key={s.label} className="border-t border-gs-700 pt-8">
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-fluid-display font-display font-black text-signal leading-none">
                  {s.value}
                </span>
                <span className="text-xl font-light text-gs-400">{s.unit}</span>
              </div>
              <p className="text-sm-fluid text-gs-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* SaaS Logos — TODO: 実ロゴに差し替え（ブランドガイドライン遵守） */}
        <div>
          <p className="label-mono text-gs-400 mb-8">取り扱いSaaS</p>
          <div className="flex flex-wrap gap-8">
            {saasLogos.map((l) => (
              <div
                key={l.slug}
                className="px-6 py-3 border border-gs-700 text-gs-400 text-sm font-medium
                           hover:border-gs-400 hover:text-gs-200 transition-colors"
              >
                {l.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
