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
 * display: swap でフォント未着時はシステムフォントで描画し、
 * 読み込み完了後に置換。タイポグラフィ主役サイトのため optional は不採用。
 * 使用ウェイトを絞る（200/400/500/700/900 の5種）
 * ※ 500: ヒーロー「導く。」/ ValuesSection jaLabel で fontWeight:500 指定あり
 */
const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-var',
  display: 'swap',
  weight: ['200', '400', '500', '700', '900'],
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
