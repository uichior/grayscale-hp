'use client'

/**
 * ValuesSection — "3つの提供価値" プレースホルダー
 *
 * TODO(後続エージェント):
 * - カルーセルではなく縦/横に3つを大きく深く
 * - 各価値にGSAP ScrollTrigger でスライドイン
 * - 取り扱いSaaS ロゴ（SmartHR / Google Workspace 等）をグレーで表示
 * - ホバーで signal カラーのアクセント
 */
export function ValuesSection() {
  const values = [
    {
      number: '01',
      title: '最適なSaaS選定',
      subtitle: '代理店業務',
      body:
        '現場経験から「本当に使える」ものだけを選定。SmartHR、Google Workspace など、中小製造業の業務フローに合うSaaSを、御社の規模・課題に合わせてご提案します。',
    },
    {
      number: '02',
      title: '導入〜定着の伴走',
      subtitle: 'コンサルティング',
      body:
        '「ツールを入れたが使われない」という失敗は絶対に起こさせません。現場の抵抗を読み解き、定着まで責任を持って並走します。',
    },
    {
      number: '03',
      title: 'SaaSで足りなければ自作',
      subtitle: 'システム開発',
      body:
        '既製品では解決できない課題に対して、自社でシステムを開発します。代理店でありながら開発もできる――これがGrayscaleの唯一無二の強みです。',
    },
  ]

  return (
    <section
      id="values"
      className="py-section-lg px-6 bg-paper"
    >
      <div className="max-width-container">
        {/* Eyebrow */}
        <p className="label-mono text-gs-500 mb-12">
          What We Do
        </p>

        <h2 className="text-heading font-display font-black text-ink tracking-ja-tight mb-20">
          3つの提供価値
        </h2>

        <div className="space-y-24">
          {values.map((v) => (
            <article key={v.number} className="grid md:grid-cols-[auto_1fr] gap-8 md:gap-16 items-start border-t border-gs-100 pt-12">
              <div className="font-display font-black text-fluid-display text-gs-100 select-none leading-none w-20">
                {v.number}
              </div>
              <div>
                <p className="label-mono text-gs-500 mb-3">{v.subtitle}</p>
                <h3 className="text-subhead font-display font-black text-ink tracking-ja-tight mb-6">
                  {v.title}
                </h3>
                <p className="text-body text-gs-500 max-w-2xl leading-relaxed">
                  {v.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
