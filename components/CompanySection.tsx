import React from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin } from 'lucide-react'

const ROWS = [
  { label: '会社名', value: '株式会社Grayscale' },
  { label: '代表取締役', value: '星 雄一郎' },
  { label: '設立', value: '2025年7月7日' },
  { label: '所在地', value: '茨城県水戸市笠原町728-4' },
  { label: '資本金', value: '100万円' },
  { label: '事業内容', value: 'DXコンサルティング / システム開発 / Web制作 / データ分析' },
  { label: '電話', value: '080-1011-7531' },
  { label: 'メール', value: 'info@grayscale.jp' },
]

export function CompanySection() {
  return (
    <section id="company" className="bg-[#0d0d0d] px-6 py-28">
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-mono text-xs tracking-[0.25em] text-neutral-500 uppercase mb-4"
        >
          Company
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-4xl md:text-5xl font-bold text-white"
        >
          会社概要
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Table */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="divide-y divide-white/[0.05]"
          >
            {ROWS.map(({ label, value }) => (
              <div key={label} className="grid grid-cols-[140px_1fr] py-5 gap-4">
                <span className="text-xs font-mono text-neutral-600 tracking-wider uppercase pt-0.5 flex-shrink-0">
                  {label}
                </span>
                <span className="text-sm text-neutral-200 leading-relaxed">{value}</span>
              </div>
            ))}
          </motion.div>

          {/* Contact cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Location card */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#111111] p-6 flex items-start gap-4">
              <div className="mt-0.5 h-10 w-10 flex-shrink-0 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
                <MapPin size={18} />
              </div>
              <div>
                <div className="text-xs font-mono text-neutral-600 tracking-widest mb-1">所在地</div>
                <div className="text-sm text-white leading-relaxed">
                  茨城県水戸市笠原町728-4
                </div>
                <div className="mt-2 text-xs text-neutral-600">
                  水戸駅より車で約15分
                </div>
              </div>
            </div>

            {/* Phone card */}
            <a
              href="tel:080-1011-7531"
              className="group rounded-2xl border border-white/[0.06] bg-[#111111] p-6 flex items-start gap-4 hover:border-sky-500/30 hover:bg-[#0f1520] transition-all"
            >
              <div className="mt-0.5 h-10 w-10 flex-shrink-0 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 group-hover:bg-sky-500/20 transition-colors">
                <Phone size={18} />
              </div>
              <div>
                <div className="text-xs font-mono text-neutral-600 tracking-widest mb-1">電話</div>
                <div className="text-sm text-white group-hover:text-sky-300 transition-colors font-medium">
                  080-1011-7531
                </div>
                <div className="mt-1 text-xs text-neutral-600">平日 9:00〜18:00</div>
              </div>
            </a>

            {/* Email card */}
            <a
              href="mailto:info@grayscale.jp"
              className="group rounded-2xl border border-white/[0.06] bg-[#111111] p-6 flex items-start gap-4 hover:border-sky-500/30 hover:bg-[#0f1520] transition-all"
            >
              <div className="mt-0.5 h-10 w-10 flex-shrink-0 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 group-hover:bg-sky-500/20 transition-colors">
                <Mail size={18} />
              </div>
              <div>
                <div className="text-xs font-mono text-neutral-600 tracking-widest mb-1">メール</div>
                <div className="text-sm text-white group-hover:text-sky-300 transition-colors font-medium break-all">
                  info@grayscale.jp
                </div>
                <div className="mt-1 text-xs text-neutral-600">24時間受付</div>
              </div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
