'use client'

import { SafeQuickContact } from '@/components/SafeQuickContact'

/**
 * ContactSection — お問い合わせ プレースホルダー
 *
 * TODO(後続エージェント):
 * - ContactForm / SafeQuickContact の流用または再デザイン
 * - 電話番号・メールアドレスの掲載
 * - GSAP フェードイン
 * - 入力フォームのスタイルをデザイントークンに合わせる
 */
export function ContactSection() {
  return (
    <section
      id="contact"
      className="py-section-lg px-6 bg-paper"
    >
      <div className="max-width-container">
        {/* Eyebrow */}
        <p className="label-mono text-gs-500 mb-12">
          Contact
        </p>

        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-heading font-display font-black text-ink tracking-ja-tight mb-6">
              まずは話してみましょう。
            </h2>
            <p className="text-body text-gs-500 leading-relaxed mb-8">
              「SaaSを検討したい」「今の業務を整理したい」
              どんな初期段階のご相談も歓迎です。
              ヒアリングは無料です。
            </p>
            <div className="space-y-4 text-sm-fluid">
              <div className="flex items-center gap-3 text-gs-500">
                <span className="label-mono">MAIL</span>
                <a href="mailto:info@grayscale.jp" className="text-ink hover:text-signal transition-colors">
                  info@grayscale.jp
                </a>
              </div>
              <div className="flex items-center gap-3 text-gs-500">
                <span className="label-mono">TEL</span>
                <a href="tel:080-1011-7531" className="text-ink hover:text-signal transition-colors">
                  080-1011-7531
                </a>
              </div>
            </div>
          </div>

          <div>
            <SafeQuickContact />
          </div>
        </div>
      </div>
    </section>
  )
}
