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
        <title>株式会社Grayscale | 代理店 × コンサル × 開発</title>
        <meta
          name="description"
          content="現場10年のDX経験と自社開発力を持つ唯一無二の存在。SaaS選定から導入・定着・自社開発まで一気通貫で伴走する株式会社Grayscale。"
        />
        <meta property="og:title" content="株式会社Grayscale | 代理店 × コンサル × 開発" />
        <meta
          property="og:description"
          content="「作れる会社が選ぶSaaSだから、本物。」現場10年のDX知見と開発力で、選定から定着まで一気通貫でご支援します。"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.grayscale.jp" />
        <meta name="twitter:card" content="summary_large_image" />
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
