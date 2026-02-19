import React from 'react'
import { motion } from 'framer-motion'
import {
  Code2,
  Globe,
  ShoppingCart,
  Database,
  Layers,
  Sparkles,
  Zap,
  BarChart3,
  Settings2,
} from 'lucide-react'

const SERVICES = [
  {
    icon: Code2,
    title: 'システム受託開発',
    desc: '業務効率化のためのカスタムシステムを、設計から納品・保守まで一貫して開発します。',
    tag: 'Development',
  },
  {
    icon: Globe,
    title: 'ホームページ制作',
    desc: 'ブランドの世界観を反映した、集客につながるホームページを丁寧に制作します。',
    tag: 'Web',
  },
  {
    icon: ShoppingCart,
    title: 'ECサイト構築',
    desc: '購買体験を最大化するECサイトの設計・開発・運用支援をトータルに行います。',
    tag: 'EC',
  },
  {
    icon: Database,
    title: 'データベース設計',
    desc: 'ビジネス要件に最適化された、スケーラブルで堅牢なデータ基盤を構築します。',
    tag: 'Database',
  },
  {
    icon: Layers,
    title: 'UI/UXデザイン',
    desc: 'ユーザーの行動を深く理解し、使いやすく美しいインターフェースを設計します。',
    tag: 'Design',
  },
  {
    icon: Sparkles,
    title: 'ブランディング',
    desc: 'ロゴ・VI・コンセプトなど、企業ブランドの戦略的な設計と視覚表現を支援します。',
    tag: 'Brand',
  },
  {
    icon: Zap,
    title: 'DX推進支援',
    desc: '業務プロセスの棚卸しから、最適なデジタルツールの選定・導入・定着まで伴走します。',
    tag: 'DX',
  },
  {
    icon: BarChart3,
    title: 'データ分析',
    desc: '経営・業務データを可視化・分析し、意思決定を支えるダッシュボードやレポートを提供します。',
    tag: 'Analytics',
  },
  {
    icon: Settings2,
    title: 'Accessシステム改修',
    desc: '既存のAccessシステムのトラブル対応・機能追加・クラウド移行を丁寧に支援します。',
    tag: 'Legacy',
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="bg-[#080808] px-6 py-28">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-mono text-xs tracking-[0.25em] text-neutral-500 uppercase mb-4"
            >
              Services
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-white"
            >
              サービス一覧
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-sm text-sm text-neutral-500 leading-relaxed"
          >
            企画・設計から開発・運用まで、
            デジタル課題を総合的に解決します。
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05] rounded-2xl overflow-hidden">
          {SERVICES.map(({ icon: Icon, title, desc, tag }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group relative bg-[#080808] p-8 hover:bg-[#0f1520] transition-colors duration-300"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-sky-400 group-hover:bg-sky-500/15 group-hover:text-sky-300 transition-colors duration-300">
                  <Icon size={20} />
                </div>
                <span className="font-mono text-[10px] tracking-widest text-neutral-700 group-hover:text-sky-800 transition-colors">
                  {tag}
                </span>
              </div>
              <h3 className="mb-3 text-base font-bold text-white">{title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
