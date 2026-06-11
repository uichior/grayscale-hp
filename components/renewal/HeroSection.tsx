'use client'

/**
 * HeroSection — プレースホルダー
 *
 * TODO(後続エージェント):
 * - 巨大タイポ（--font-size-hero / clamp(3.5rem, 12vw, 11rem)）で
 *   「代理店 × コンサル × 開発」を宣言
 * - Inter ExtraBlack(900) × Regular(300) のウェイトコントラストで緊張感
 * - GSAP テキストアニメーション（SplitText or clip-path reveal）
 * - カスタムカーソルとの連携
 * - scrolljacking は絶対にしない
 */
export function HeroSection() {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center px-6 pt-24 pb-section-md bg-paper"
    >
      <div className="max-width-container w-full">
        {/* Eyebrow label */}
        <p className="label-mono text-gs-500 mb-8">
          株式会社 Grayscale
        </p>

        {/* Main headline — 後続エージェントが GSAP reveal を実装 */}
        <h1
          className="text-hero font-display font-black text-ink tracking-ja-tight leading-[0.95] overflow-hidden"
        >
          <span className="block">代理店 ×</span>
          <span className="block">コンサル ×</span>
          <span className="block text-gs-700">開発。</span>
        </h1>

        {/* Sub copy */}
        <p className="mt-10 text-subhead font-ja font-light text-gs-500 max-w-xl tracking-ja-normal">
          「作れる会社が選ぶSaaSだから、本物。」
          <br />
          現場10年のDX知見と、ゼロから開発できる技術力で、
          <br className="hidden sm:block" />
          選定から定着まで一気通貫で伴走します。
        </p>

        {/* CTA */}
        <div className="mt-12 flex items-center gap-6">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-ink text-paper px-8 py-4 text-sm font-medium
                       hover:bg-gs-700 transition-colors"
          >
            相談する（無料）
            <span aria-hidden>→</span>
          </a>
          <a
            href="#story"
            className="text-sm font-medium text-gs-500 hover:text-ink transition-colors"
          >
            Grayscaleとは ↓
          </a>
        </div>
      </div>
    </section>
  )
}
