import Head from 'next/head'
import { RenewalHeader }  from '@/components/renewal/RenewalHeader'
import { HeroSection }    from '@/components/renewal/HeroSection'
import { StorySection }   from '@/components/renewal/StorySection'
import { ValuesSection }  from '@/components/renewal/ValuesSection'
import { ProofSection }   from '@/components/renewal/ProofSection'
import { MetaSection }    from '@/components/renewal/MetaSection'
import { ContactSection } from '@/components/renewal/ContactSection'
import { RenewalFooter }  from '@/components/renewal/RenewalFooter'

// ── 旧コンポーネントのimportは外す（ファイルは残す）──
// import { MouseFollower }      from '@/components/MouseFollower'
// import { CrispChat }          from '@/components/CrispChat'
// import { InteractiveHeader }  from '@/components/InteractiveHeader'
// import { InteractiveHero }    from '@/components/InteractiveHero'
// import { SafeQuickContact }   from '@/components/SafeQuickContact'
// import { ScrollRevealText }   from '@/components/ScrollRevealText'
// import { ServicesCarousel }   from '@/components/ServicesCarousel'

export default function Home() {
  return (
    <>
      <Head>
        <title>株式会社Grayscale | 選ぶ。導く。つくる。— SaaS代理店 × 伴走コンサル × 自社開発</title>
        <meta
          name="description"
          content="製造業10年のDX実践知見を持つ代表が、SaaS選定・導入伴走・システム自社開発を一気通貫で担う唯一無二のパートナー。作れる会社が選ぶから、本物のSaaSをご提供します。"
        />
        {/* OGP */}
        <meta property="og:title" content="株式会社Grayscale | 選ぶ。導く。つくる。— SaaS代理店 × 伴走コンサル × 自社開発" />
        <meta
          property="og:description"
          content="製造業10年のDX実践知見を持つ代表が、SaaS選定・導入伴走・システム自社開発を一気通貫で担う唯一無二のパートナー。作れる会社が選ぶから、本物のSaaSをご提供します。"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.grayscale.jp" />
        <meta property="og:image" content="https://www.grayscale.jp/og.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="株式会社Grayscale" />
        <meta property="og:locale" content="ja_JP" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="株式会社Grayscale | 選ぶ。導く。つくる。— SaaS代理店 × 伴走コンサル × 自社開発" />
        <meta
          name="twitter:description"
          content="製造業10年のDX実践知見を持つ代表が、SaaS選定・導入伴走・システム自社開発を一気通貫で担う唯一無二のパートナー。作れる会社が選ぶから、本物のSaaSをご提供します。"
        />
        <meta name="twitter:image" content="https://www.grayscale.jp/og.png" />
        {/* 基本 */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://www.grayscale.jp" />
      </Head>

      {/*
        セクション構成:
        1. Header   — 固定ヘッダー + ナビ
        2. Hero     — 巨大タイポで唯一無二のポジショニングを宣言
        3. Story    — なぜGrayscaleは本物か（信頼の根拠）
        4. Values   — 3つの提供価値
        5. Proof    — 実績・数字・取り扱いSaaSロゴ
        6. Meta     — このサイト自体が技術力の証明
        7. Contact  — お問い合わせ
        8. Footer   — 会社確定情報・SNS
      */}
      <RenewalHeader />

      <main>
        <HeroSection />
        <StorySection />
        <ValuesSection />
        <ProofSection />
        <MetaSection />
        <ContactSection />
      </main>

      <RenewalFooter />
    </>
  )
}
