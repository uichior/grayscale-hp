import React from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'

const MARQUEE_ITEMS = [
  'システム受託開発',
  'ホームページ制作',
  'ECサイト構築',
  'データベース設計',
  'UI/UXデザイン',
  'ブランディング',
  'DX推進支援',
  'データ分析',
  'Accessシステム改修',
]

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden bg-[#080808]"
      style={{
        backgroundImage: [
          'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        ].join(','),
        backgroundSize: '60px 60px',
      }}
    >
      {/* Glow blobs */}
      <div className="pointer-events-none absolute top-1/3 -left-48 h-[500px] w-[500px] rounded-full bg-sky-700/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-2/3 -right-24 h-80 w-80 rounded-full bg-indigo-700/8 blur-[100px]" />

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-6 pt-24 pb-12">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center gap-2.5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
          <span className="font-mono text-xs tracking-widest text-neutral-500">
            茨城県水戸市 ─ DXコンサルティング
          </span>
        </motion.div>

        {/* Headline */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-white leading-[1.05] tracking-tight"
          >
            デジタルで、
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
              企業を変える。
            </span>
          </motion.h1>
        </div>

        {/* Sub headline */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-8 max-w-lg text-base md:text-lg text-neutral-400 leading-relaxed"
        >
          製造業で培ったDXの現場経験を活かし、
          <br className="hidden md:block" />
          茨城のすべての企業に、デジタル変革の第一歩を。
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a
            href="#services"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-black hover:bg-neutral-100 transition-colors"
          >
            サービスを見る <ArrowUpRight size={15} />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
          >
            無料相談を予約
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.85 }}
          className="mt-16 flex flex-wrap items-end gap-12 border-t border-white/5 pt-10"
        >
          {[
            { num: '9', label: 'サービス領域' },
            { num: '100%', label: '伴走型サポート' },
            { num: '∞', label: '継続的な改善' },
          ].map(({ num, label }) => (
            <div key={label}>
              <div className="text-4xl font-extrabold text-white font-mono">{num}</div>
              <div className="mt-1 text-xs text-neutral-600 tracking-widest">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scrolling ticker */}
      <div className="overflow-hidden border-t border-white/5 py-3.5">
        <div className="flex w-max animate-marquee items-center gap-10">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="whitespace-nowrap font-mono text-[11px] tracking-[0.2em] text-neutral-700"
            >
              {item}
              <span className="mx-5 text-sky-900">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-[72px] left-8 flex items-center gap-2 text-neutral-600 hover:text-neutral-400 transition-colors"
      >
        <ArrowDown size={14} className="animate-bounce" />
        <span className="font-mono text-[10px] tracking-widest">SCROLL</span>
      </motion.a>
    </section>
  )
}
