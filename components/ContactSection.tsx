import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Send, CheckCircle2 } from 'lucide-react'

const FIELDS = [
  { id: 'company', label: '会社名', type: 'text', placeholder: '株式会社〇〇', required: false },
  { id: 'name', label: 'お名前', type: 'text', placeholder: '山田 太郎', required: true },
  { id: 'email', label: 'メールアドレス', type: 'email', placeholder: 'yamada@example.com', required: true },
  { id: 'tel', label: '電話番号', type: 'tel', placeholder: '000-0000-0000', required: false },
]

export function ContactSection() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section id="contact" className="bg-[#080808] px-6 py-28">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left side */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-mono text-xs tracking-[0.25em] text-neutral-500 uppercase mb-4"
            >
              Contact
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-white leading-snug"
            >
              さあ、
              <br />
              始めましょう。
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-6 text-neutral-400 text-sm leading-relaxed"
            >
              DXについて何から始めればよいかわからない方も、
              具体的なご相談がある方も、まずはお気軽にご連絡ください。
              <br className="hidden md:block" />
              初回相談は無料です。
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-10 space-y-3"
            >
              {[
                { label: '電話', value: '080-1011-7531', href: 'tel:080-1011-7531' },
                { label: 'メール', value: 'info@grayscale.jp', href: 'mailto:info@grayscale.jp' },
              ].map(({ label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#111111] px-5 py-4 hover:border-sky-500/40 hover:bg-[#0f1520] transition-all group"
                >
                  <div>
                    <div className="text-xs font-mono text-neutral-600 mb-0.5">{label}</div>
                    <div className="text-white text-sm font-medium">{value}</div>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-neutral-600 group-hover:text-sky-400 transition-colors"
                  />
                </a>
              ))}
            </motion.div>

            {/* Trust signals */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              {['初回相談無料', '秘密厳守', '2営業日以内に返信'].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3.5 py-1.5 text-xs text-neutral-500"
                >
                  <span className="h-1 w-1 rounded-full bg-sky-500" />
                  {item}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right side: Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {sent ? (
              <div className="rounded-2xl border border-sky-500/20 bg-[#0c1a28] p-12 text-center">
                <CheckCircle2 size={48} className="mx-auto text-sky-400 mb-5" />
                <h3 className="text-xl font-bold text-white mb-3">送信しました</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  お問い合わせありがとうございます。
                  <br />
                  2営業日以内にご連絡いたします。
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-white/[0.06] bg-[#111111] p-8 space-y-5"
              >
                {FIELDS.map(({ id, label, type, placeholder, required }) => (
                  <div key={id}>
                    <label htmlFor={id} className="block text-xs font-mono text-neutral-500 mb-2">
                      {label}
                      {required && <span className="ml-1 text-sky-500">*</span>}
                    </label>
                    <input
                      id={id}
                      type={type}
                      placeholder={placeholder}
                      required={required}
                      className="w-full rounded-lg border border-white/[0.08] bg-[#1a1a1a] px-4 py-3 text-sm text-white placeholder-neutral-600 focus:border-sky-500/60 focus:outline-none focus:ring-1 focus:ring-sky-500/30 transition-colors"
                    />
                  </div>
                ))}

                <div>
                  <label htmlFor="message" className="block text-xs font-mono text-neutral-500 mb-2">
                    相談内容<span className="ml-1 text-sky-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    placeholder="お困りのことや相談したい内容をご記入ください"
                    className="w-full rounded-lg border border-white/[0.08] bg-[#1a1a1a] px-4 py-3 text-sm text-white placeholder-neutral-600 focus:border-sky-500/60 focus:outline-none focus:ring-1 focus:ring-sky-500/30 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 hover:bg-sky-400 px-6 py-3.5 text-sm font-bold text-white transition-colors"
                >
                  送信する <Send size={14} />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
