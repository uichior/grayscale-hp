'use client'

/**
 * RenewalFooter — フッター
 *
 * - 確定情報（§2）を正確に掲載
 * - SNSリンク
 * TODO(後続エージェント):
 * - 会社概要モーダル（InteractiveHeader から移植検討）
 * - ナビゲーションリンク
 */
export function RenewalFooter() {
  return (
    <footer className="border-t border-gs-100 px-6 py-12 bg-paper">
      <div className="max-width-container">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <p className="font-display font-black text-ink text-xl tracking-ja-tight mb-3">
              Grayscale
            </p>
            <p className="text-sm-fluid text-gs-500 leading-relaxed">
              代理店 × コンサル × 開発を一気通貫で。
            </p>
          </div>

          {/* Company info */}
          <div>
            <p className="label-mono text-gs-500 mb-4">Company</p>
            <address className="not-italic space-y-1 text-sm-fluid text-gs-500 leading-relaxed">
              <p>株式会社Grayscale</p>
              <p>代表取締役 星 雄一郎</p>
              <p>〒310-0852 茨城県水戸市笠原町728-4</p>
              <p>設立: 2025年7月7日</p>
              <p>
                <a href="tel:080-1011-7531" className="hover:text-ink transition-colors">
                  080-1011-7531
                </a>
              </p>
              <p>
                <a href="mailto:info@grayscale.jp" className="hover:text-ink transition-colors">
                  info@grayscale.jp
                </a>
              </p>
            </address>
          </div>

          {/* SNS */}
          <div>
            <p className="label-mono text-gs-500 mb-4">Follow</p>
            <ul className="space-y-2 text-sm-fluid">
              <li>
                <a
                  href="https://facebook.com/grayscale310"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gs-500 hover:text-ink transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/grayscale310"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gs-500 hover:text-ink transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/grayscale310"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gs-500 hover:text-ink transition-colors"
                >
                  X (Twitter)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gs-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gs-400">
            © 2026 株式会社Grayscale. All rights reserved.
          </p>
          <p className="text-xs text-gs-400 label-mono">
            Built by Grayscale
          </p>
        </div>
      </div>
    </footer>
  )
}
