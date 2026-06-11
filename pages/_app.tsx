import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import { SmoothScroll } from '@/components/renewal/SmoothScroll'
import { CustomCursor } from '@/components/renewal/CustomCursor'

/**
 * Inter — 欧文見出し・本文（variable font、weight 100–900）
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter-var',
  display: 'swap',
})

/**
 * Noto Sans JP — 日本語（weight 100–900）
 * display: optional で初回レンダーをブロックしない。
 * preload: false でリソースヒントを出さない（LCP 改善）
 * 使用ウェイトを絞る（200/400/700/900 の4種のみ）
 */
const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-var',
  display: 'optional',  // swap → optional でレンダーブロッキング解消
  weight: ['200', '400', '700', '900'],  // 7種 → 4種に絞る
  preload: false,
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.variable} ${notoSansJP.variable}`}>
      <CustomCursor />
      <SmoothScroll>
        <Component {...pageProps} />
      </SmoothScroll>
    </div>
  )
}
