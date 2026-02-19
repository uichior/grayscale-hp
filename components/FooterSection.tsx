import React from 'react'

const FOOTER_LINKS = [
  { label: 'サービス', href: '#services' },
  { label: 'について', href: '#about' },
  { label: '進め方', href: '#process' },
  { label: '会社概要', href: '#company' },
  { label: 'お問い合わせ', href: '#contact' },
]

export function FooterSection() {
  return (
    <footer className="bg-[#080808] border-t border-white/[0.05] px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <p className="font-mono text-lg font-bold tracking-[0.2em] text-white">GRAYSCALE</p>
            <p className="mt-1 text-xs text-neutral-600">株式会社Grayscale</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-3">
            {FOOTER_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="text-xs text-neutral-500 hover:text-white transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-xs text-neutral-700">
            茨城県水戸市笠原町728-4　／　080-1011-7531　／　info@grayscale.jp
          </p>
          <p className="text-xs text-neutral-700">
            © 2025 株式会社Grayscale. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
