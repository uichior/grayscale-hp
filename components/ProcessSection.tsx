import React from 'react'
import { motion } from 'framer-motion'

const STEPS = [
  {
    n: '01',
    title: 'ヒアリング',
    desc: '現状の業務フローや課題、目標をじっくりお聞きします。オンライン・訪問どちらにも対応しています。',
  },
  {
    n: '02',
    title: '要件整理・ご提案',
    desc: 'ヒアリング内容をもとに課題を整理し、最適なソリューションと概算見積もりをご提案します。',
  },
  {
    n: '03',
    title: '開発・制作',
    desc: '定期的な進捗共有を行いながら、丁寧かつスピーディーに開発・制作を進めます。',
  },
  {
    n: '04',
    title: '納品・検証',
    desc: '成果物をご確認いただき、必要な修正・調整を行ったうえで最終納品します。',
  },
  {
    n: '05',
    title: '運用・サポート',
    desc: '稼働後も継続的にサポート。小さな困りごとにも素早く対応し、長期的にお客様を支えます。',
  },
]

export function ProcessSection() {
  return (
    <section id="process" className="bg-[#0d0d0d] px-6 py-28">
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-mono text-xs tracking-[0.25em] text-neutral-500 uppercase mb-4"
        >
          Process
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-white mb-16"
        >
          ご依頼の流れ
        </motion.h2>

        <div className="space-y-0 divide-y divide-white/5">
          {STEPS.map(({ n, title, desc }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group grid md:grid-cols-[96px_1fr_2fr] gap-6 md:gap-10 py-10 hover:bg-white/[0.015] transition-colors px-4 -mx-4 rounded-xl"
            >
              {/* Number */}
              <div className="font-mono text-5xl font-extrabold text-white/[0.07] group-hover:text-sky-500/20 transition-colors leading-none">
                {n}
              </div>

              {/* Title */}
              <div className="flex items-start pt-1">
                <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                  {title}
                </h3>
              </div>

              {/* Description */}
              <div className="flex items-start pt-1">
                <p className="text-sm text-neutral-500 leading-relaxed max-w-lg">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
