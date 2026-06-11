import React from 'react'
import Head from 'next/head'
import { MouseFollower } from '@/components/MouseFollower'
import { CrispChat } from '@/components/CrispChat'
import { InteractiveHeader } from '@/components/InteractiveHeader'
import { InteractiveHero } from '@/components/InteractiveHero'
import { SafeQuickContact } from '@/components/SafeQuickContact'
import { ScrollRevealText } from '@/components/ScrollRevealText'
import { ServicesCarousel } from '@/components/ServicesCarousel'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

export default function Home() {
  return (
    <>
      <Head>
        <title>Grayscale - デジタルクリエイティブスタジオ</title>
        <meta name="description" content="アイデアを形に。革新的なデザインとテクノロジーで、新しい体験を創造します" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MouseFollower />
      <CrispChat />
      <InteractiveHeader />
      
      <main className="relative bg-white">
        <InteractiveHero />

        <section className="relative px-4 py-32">
          {/* 茨城県画像背景（モバイル用） */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute inset-0 flex items-center justify-center md:hidden"
          >
            <img
              src="/ibaraki.png"
              alt="茨城県"
              className="h-80 w-auto opacity-10 pointer-events-none"
            />
          </motion.div>
          
          <div className="mx-auto max-w-7xl relative z-10">
            <div className="flex items-center justify-center gap-8 max-w-5xl mx-auto">
              <div className="text-center md:text-right flex-1 md:flex-none">
                <ScrollRevealText
                  text="IBARAKIの 課題と向き合う"
                  className="font-mono text-4xl font-light leading-relaxed text-gray-800 md:text-5xl"
                />
                <ScrollRevealText
                  text="地域とともに歩む DXパートナー"
                  className="mt-4 font-mono text-4xl font-light leading-relaxed text-gray-800 md:text-5xl"
                />
              </div>
              
              {/* デスクトップ用画像 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="relative hidden md:block"
              >
                <img
                  src="/ibaraki.png"
                  alt="茨城県"
                  className="h-64 w-auto opacity-80 transition-opacity hover:opacity-100"
                />
              </motion.div>
            </div>
          </div>
        </section>
        
        <section id="services" className="relative overflow-hidden bg-gray-900 px-4 py-24">
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
          
          <div className="relative mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="font-mono text-5xl font-bold text-white">SERVICES</h2>
              <div className="mx-auto mt-4 h-px w-24 bg-gray-600" />
            </div>
            
            <ServicesCarousel />
          </div>
        </section>

        {/* Contact CTA */}
        <section id="contact" className="relative overflow-hidden px-4 py-32">
          {/* 方眼紙背景 */}
          <div className="absolute inset-0">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="contact-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgb(229 231 235)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#contact-grid)" />
            </svg>
          </div>
          
          <div className="relative mx-auto max-w-4xl">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-center font-mono text-4xl font-bold text-gray-900 md:text-5xl">
                さあ、始めましょう
              </h2>
              
              <p className="mt-6 text-center font-mono text-lg text-gray-600">
                どんな小さなアイデアでも大歓迎です
              </p>
              
              <div className="mt-12">
                <SafeQuickContact />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 px-4 py-8">
          <div className="mx-auto max-w-7xl text-center">
            <p className="font-mono text-sm text-gray-500">
              © 2026 Grayscale. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </>
  )
}