import React from 'react'
import Head from 'next/head'
import { NavBar } from '@/components/NavBar'
import { HeroSection } from '@/components/HeroSection'
import { AboutSection } from '@/components/AboutSection'
import { ServicesSection } from '@/components/ServicesSection'
import { ProcessSection } from '@/components/ProcessSection'
import { StrengthsSection } from '@/components/StrengthsSection'
import { CompanySection } from '@/components/CompanySection'
import { ContactSection } from '@/components/ContactSection'
import { FooterSection } from '@/components/FooterSection'

export default function Home() {
  return (
    <>
      <Head>
        <title>株式会社Grayscale｜茨城のDXパートナー</title>
        <meta
          name="description"
          content="製造業DXの現場経験を活かし、茨城の企業のデジタル変革を支援。システム開発・Web制作・DX推進支援をワンストップで提供します。"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />

      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProcessSection />
        <StrengthsSection />
        <CompanySection />
        <ContactSection />
        <FooterSection />
      </main>
    </>
  )
}
