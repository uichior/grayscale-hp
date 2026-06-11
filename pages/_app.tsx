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
 * Noto Sans JP — 日本語（variable font、weight 100–900）
 * axes: ['wght'] で可変ウェイト軸を有効化。
 * weight 配列指定は個別ファイルになるため variable を使う。
 */
const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-var',
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '700', '900'],
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
