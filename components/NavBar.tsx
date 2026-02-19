import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'

const NAV_LINKS = [
  { label: 'サービス', href: '#services' },
  { label: 'について', href: '#about' },
  { label: '進め方', href: '#process' },
  { label: '会社概要', href: '#company' },
]

export function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#080808]/90 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="#"
          className="font-mono text-lg font-bold tracking-[0.2em] text-white hover:opacity-70 transition-opacity"
        >
          GRAYSCALE
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-400 rounded-full transition-colors"
        >
          無料相談 <ArrowUpRight size={14} />
        </a>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-neutral-300 hover:text-white transition-colors"
          aria-label="メニュー"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-[#080808]/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="px-6 py-6 space-y-5">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className="block text-base text-neutral-300 hover:text-white transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </a>
              ))}
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-sky-500 rounded-full"
                onClick={() => setOpen(false)}
              >
                無料相談 <ArrowUpRight size={14} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
