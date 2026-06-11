'use client'

/**
 * StorySection — "なぜGrayscaleは本物なのか" プレースホルダー
 *
 * TODO(後続エージェント):
 * - 「現場で10年DXをやった人間が選ぶSaaS」という信頼の根拠をスクロールストーリーで
 * - GSAP ScrollTrigger で段落が順次フェードイン（useGSAP + scope で管理）
 * - 数字を signal カラーでアクセント
 * - 「製造業で10年 → だから選定が本物 → 導入も実装もできる」の3ステップ構造
 */
export function StorySection() {
  return (
    <section
      id="story"
      className="py-section-lg px-6 bg-gs-900 text-paper"
    >
      <div className="max-width-container">
        {/* Eyebrow */}
        <p className="label-mono text-gs-400 mb-12">
          Why Grayscale
        </p>

        {/* Lead */}
        <h2 className="text-heading font-display font-black text-paper tracking-ja-tight max-w-3xl">
          「本当にいいものしか<br />紹介しない」という自負は、
          <br />
          <span className="text-signal">現場10年</span>から来ている。
        </h2>

        {/* Body */}
        <div className="mt-16 grid md:grid-cols-3 gap-12 text-body text-gs-400 leading-relaxed">
          <div>
            <p className="text-sm-fluid font-medium text-gs-200 mb-3 label-mono">01 — 選定</p>
            <p>
              製造業の現場でDXを推進してきた10年間の経験があるから、
              使い物になるSaaSとそうでないものの違いが体感でわかります。
            </p>
          </div>
          <div>
            <p className="text-sm-fluid font-medium text-gs-200 mb-3 label-mono">02 — 伴走</p>
            <p>
              導入して終わりではありません。定着まで並走し、
              現場の抵抗を乗り越えるところまで責任を持ちます。
            </p>
          </div>
          <div>
            <p className="text-sm-fluid font-medium text-gs-200 mb-3 label-mono">03 — 開発</p>
            <p>
              SaaSで解決できない課題は、自分たちで作ります。
              このサイト自体が、その技術力の証明です。
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
