'use client'

/**
 * RenewalHeader — プレースホルダー
 *
 * TODO(後続エージェント):
 * - Grayscale ロゴ（テキストロゴ or SVG）
 * - ナビゲーションリンク（Story / Values / Proof / Contact）
 * - CTA ボタン（お問い合わせ）
 * - スクロールで背景を切り替える透明ヘッダー
 * - SP: ハンバーガーメニュー
 */
export function RenewalHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between">
      <div className="font-display font-black text-ink tracking-ja-tight">
        Grayscale
      </div>
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gs-500">
        <a href="#story">Story</a>
        <a href="#values">Values</a>
        <a href="#proof">Proof</a>
        <a href="#contact" className="text-ink border border-ink px-4 py-2 hover:bg-ink hover:text-paper transition-colors">
          Contact
        </a>
      </nav>
      {/* TODO: SP hamburger */}
    </header>
  )
}
