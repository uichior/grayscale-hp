import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Zen_Old_Mincho, Zen_Kaku_Gothic_New, Familjen_Grotesk, Space_Mono } from 'next/font/google'
import { SmoothScroll } from '@/components/renewal/SmoothScroll'

/**
 * 新デザイン（Claude Design版）のフォント構成。
 * - Zen Old Mincho     … ディスプレイ見出しの主役（明朝）
 * - Zen Kaku Gothic New … 日本語本文
 * - Familjen Grotesk   … 欧文ディスプレイ・大きな数字
 * - Space Mono         … ラベル・ロット番号・メタ情報（monospace）
 * カスタムカーソルと各種スクロール演出は GrayscaleV2 コンポーネント内に内包。
 */
const zenMincho = Zen_Old_Mincho({
  subsets: ['latin'],
  variable: '--font-mincho',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const zenKaku = Zen_Kaku_Gothic_New({
  subsets: ['latin'],
  variable: '--font-kaku',
  display: 'swap',
  weight: ['300', '400', '500', '700'],
})

const familjen = Familjen_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-mono-dc',
  display: 'swap',
  weight: ['400', '700'],
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${zenMincho.variable} ${zenKaku.variable} ${familjen.variable} ${spaceMono.variable}`}>
      <SmoothScroll>
        <Component {...pageProps} />
      </SmoothScroll>
    </div>
  )
}
