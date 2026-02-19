import React from 'react'
import { motion } from 'framer-motion'
import { Factory, MapPin, Link2 } from 'lucide-react'

const STRENGTHS = [
  {
    icon: Factory,
    title: '製造業DX経験',
    desc: '工場・製造現場を知るエンジニアが直接対応。現場目線で課題を的確に把握し、実効性の高い解決策を提案します。',
    highlight: '現場を知る、だから刺さる。',
  },
  {
    icon: MapPin,
    title: '地域密着型支援',
    desc: '茨城県水戸市に拠点を置き、必要に応じて直接訪問。顔の見えるコミュニケーションで、安心してご相談いただけます。',
    highlight: '近くにいる、だから速い。',
  },
  {
    icon: Link2,
    title: 'ワンストップ対応',
    desc: '企画・設計・開発・運用まで一社で完結。複数の会社をまたぐ必要がなく、窓口を一本化してスムーズに進められます。',
    highlight: '一社完結、だから楽。',
  },
]

export function StrengthsSection() {
  return (
    <section className="bg-[#080808] px-6 py-28">
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-mono text-xs tracking-[0.25em] text-neutral-500 uppercase mb-4"
        >
          Why Grayscale
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-4xl md:text-5xl font-bold text-white"
        >
          選ばれる理由
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-6">
          {STRENGTHS.map(({ icon: Icon, title, desc, highlight }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="group rounded-2xl border border-white/[0.06] bg-[#111111] p-8 hover:border-sky-500/30 hover:bg-[#0f1520] transition-all duration-300"
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 group-hover:bg-sky-500/20 group-hover:text-sky-300 transition-colors">
                <Icon size={22} />
              </div>
              <p className="mb-3 font-mono text-xs tracking-widest text-sky-500/70 group-hover:text-sky-400 transition-colors">
                {highlight}
              </p>
              <h3 className="mb-3 text-lg font-bold text-white">{title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
