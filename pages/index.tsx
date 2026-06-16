import Head from 'next/head'
import { GrayscaleLP } from '@/components/renewal/GrayscaleLP'

const TITLE = '株式会社Grayscale — 全部やるから、本物。'
const DESC = '自分で使って確かめたSaaSだけを売る。現場に定着するまで離れない。届かない部分は自分たちでつくる。——SaaSのセレクトショップ、株式会社Grayscale。'

export default function Home() {
  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        {/* OGP */}
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.grayscale.jp" />
        <meta property="og:image" content="https://www.grayscale.jp/og.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="株式会社Grayscale" />
        <meta property="og:locale" content="ja_JP" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content="https://www.grayscale.jp/og.jpg" />
        {/* 基本 */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://www.grayscale.jp" />
      </Head>

      <GrayscaleLP />
    </>
  )
}
