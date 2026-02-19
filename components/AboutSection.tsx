import React from 'react'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

export function AboutSection() {
  return (
    <section id="about" className="bg-[#0d0d0d] px-6 py-28">
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeUp}
          className="font-mono text-xs tracking-[0.25em] text-neutral-500 uppercase mb-4"
        >
          About Us
        </motion.p>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left: headline + mission/vision */}
          <div>
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              variants={fadeUp}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-snug"
            >
              地域と企業の
              <br />
              未来を、ともに
              <span className="text-sky-400">描く。</span>
            </motion.h2>

            <div className="mt-12 space-y-8">
              {[
                {
                  label: 'ミッション',
                  text: '製造業で培ったDX体験を地域の皆様に寄り添いながら提供',
                },
                {
                  label: 'ビジョン',
                  text: '茨城のすべての企業にDXの第一歩を',
                },
              ].map(({ label, text }, i) => (
                <motion.div
                  key={label}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i + 2}
                  variants={fadeUp}
                  className="border-l-2 border-sky-500 pl-5"
                >
                  <p className="text-xs font-mono tracking-widest text-sky-400 uppercase mb-2">
                    {label}
                  </p>
                  <p className="text-neutral-200 text-lg leading-relaxed">{text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: founder story */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-5 text-neutral-400 leading-[1.9]"
          >
            <p>
              株式会社Grayscaleは2025年7月、茨城県水戸市に設立されました。代表の星雄一郎が製造業の現場で積み重ねてきたDX推進の経験を、地域の中小企業に届けたいという想いから生まれた会社です。
            </p>
            <p>
              私たちが向き合うのは、「DXしなければならないのはわかるが、何から始めればよいかわからない」という声です。システム導入から運用まで、お客様のペースに合わせた伴走型支援で、デジタル変革の第一歩をご一緒します。
            </p>
            <p>
              茨城に根ざし、茨城と共に成長する。それが私たちGrayscaleの在り方です。
            </p>

            {/* Representative card */}
            <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                星
              </div>
              <div>
                <div className="text-white font-semibold">星 雄一郎</div>
                <div className="text-xs text-neutral-500 mt-0.5">代表取締役</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
