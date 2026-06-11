'use client'

import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

/**
 * ContactSection — お問い合わせ
 *
 * 旧ContactFormの送信仕組み: シミュレートのみ（外部エンドポイントなし）。
 * 同じアプローチを踏襲 + mailto: フォールバックリンクを明示。
 * フォームはシンプルな4項目（名前・会社名・メール・相談内容）。
 *
 * デザイン: bg-ink（黒背景）でMetaSectionの白から転調。
 * お問い合わせ＝最後の行動喚起なので強いコントラストで締める。
 */

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

interface FormData {
  name: string
  company: string
  email: string
  message: string
}

// ─── バリデーション ──────────────────────────────────────────────────────────

function validate(data: FormData): Partial<Record<keyof FormData, string>> {
  const errors: Partial<Record<keyof FormData, string>> = {}
  if (!data.name.trim())        errors.name    = 'お名前を入力してください'
  if (!data.email.trim())       errors.email   = 'メールアドレスを入力してください'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
                                errors.email   = '正しいメールアドレスを入力してください'
  if (!data.message.trim())     errors.message = 'ご相談内容を入力してください'
  return errors
}

// ─── フォーム ────────────────────────────────────────────────────────────────

function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    company: '',
    email: '',
    message: '',
  })
  const [errors, setErrors]     = useState<Partial<Record<keyof FormData, string>>>({})
  const [status, setStatus]     = useState<SubmitStatus>('idle')

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validate(formData)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setStatus('submitting')
    // ─ 送信処理
    // 旧サイトと同様、現時点では外部エンドポイントなし。
    // mailto: ベースのフォールバック動線を Contact 欄に別途明示。
    // API エンドポイント追加時は fetch('/api/contact', ...) に差し替え。
    await new Promise(resolve => setTimeout(resolve, 1200))
    setStatus('success')
  }

  const inputBase =
    'w-full bg-transparent border-b border-gs-700 py-3 text-paper placeholder:text-gs-700 ' +
    'focus:outline-none focus:border-gs-400 transition-colors duration-200 ' +
    'font-ja font-light tracking-ja-normal'

  const inputStyle = { fontSize: 'clamp(0.9375rem, 1.3vw, 1.0625rem)' }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-start gap-4 py-8">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--color-signal)' }}
          aria-hidden
        >
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M1 5l4 4L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p
          className="font-display font-black text-paper tracking-ja-tight leading-[1.1]"
          style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}
        >
          送信完了しました。
        </p>
        <p
          className="font-ja font-light text-gs-400 leading-[1.8] tracking-ja-normal"
          style={{ fontSize: 'clamp(0.875rem, 1.2vw, 1rem)' }}
        >
          1〜2営業日以内にご連絡いたします。<br />
          お急ぎの場合はお電話（080-1011-7531）にてご連絡ください。
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-8">

        {/* 名前 */}
        <div>
          <label className="label-mono text-gs-500 block mb-2" style={{ fontSize: '0.6rem', letterSpacing: '0.1em' }}>
            NAME — お名前 <span style={{ color: 'var(--color-signal)' }}>*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={set('name')}
            placeholder="山田 太郎"
            className={inputBase}
            style={inputStyle}
            disabled={status === 'submitting'}
            autoComplete="name"
          />
          {errors.name && <ErrorMessage msg={errors.name} />}
        </div>

        {/* 会社名 */}
        <div>
          <label className="label-mono text-gs-500 block mb-2" style={{ fontSize: '0.6rem', letterSpacing: '0.1em' }}>
            COMPANY — 会社名
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={set('company')}
            placeholder="株式会社○○（任意）"
            className={inputBase}
            style={inputStyle}
            disabled={status === 'submitting'}
            autoComplete="organization"
          />
        </div>

        {/* メール */}
        <div>
          <label className="label-mono text-gs-500 block mb-2" style={{ fontSize: '0.6rem', letterSpacing: '0.1em' }}>
            MAIL — メールアドレス <span style={{ color: 'var(--color-signal)' }}>*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={set('email')}
            placeholder="your@email.com"
            className={inputBase}
            style={inputStyle}
            disabled={status === 'submitting'}
            autoComplete="email"
          />
          {errors.email && <ErrorMessage msg={errors.email} />}
        </div>

        {/* 相談内容 */}
        <div>
          <label className="label-mono text-gs-500 block mb-2" style={{ fontSize: '0.6rem', letterSpacing: '0.1em' }}>
            MESSAGE — ご相談内容 <span style={{ color: 'var(--color-signal)' }}>*</span>
          </label>
          <textarea
            value={formData.message}
            onChange={set('message')}
            placeholder="どんな初期段階のご相談でも歓迎します。&#10;「SaaSを検討したい」「今の業務を整理したい」など気軽にご記入ください。"
            className={`${inputBase} resize-none`}
            style={{ ...inputStyle, minHeight: '8rem' }}
            disabled={status === 'submitting'}
          />
          {errors.message && <ErrorMessage msg={errors.message} />}
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="group relative overflow-hidden w-full sm:w-auto px-10 py-4
                     border border-paper text-paper font-display font-semibold
                     tracking-ja-snug hover:bg-paper hover:text-ink
                     transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ fontSize: 'clamp(0.9375rem, 1.3vw, 1.0625rem)' }}
        >
          {status === 'submitting' ? (
            <span className="flex items-center gap-3">
              <span
                className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full inline-block"
                style={{ animation: 'spin 0.8s linear infinite' }}
                aria-hidden
              />
              送信中...
            </span>
          ) : (
            '送信する →'
          )}
        </button>

        {status === 'error' && (
          <p
            className="label-mono"
            style={{ color: 'var(--color-signal)', fontSize: '0.65rem', letterSpacing: '0.08em' }}
          >
            送信に失敗しました。恐れ入りますが直接ご連絡ください。
          </p>
        )}
      </div>
    </form>
  )
}

function ErrorMessage({ msg }: { msg: string }) {
  return (
    <p
      className="mt-2 label-mono"
      style={{ color: 'var(--color-signal)', fontSize: '0.6rem', letterSpacing: '0.08em' }}
      role="alert"
    >
      {msg}
    </p>
  )
}

// ─── ContactSection ───────────────────────────────────────────────────────────

export function ContactSection() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const el = containerRef.current
    if (!el) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const eyebrow  = el.querySelector<HTMLElement>('.contact-eyebrow')
    const heading  = el.querySelector<HTMLElement>('.contact-heading')
    const subtext  = el.querySelector<HTMLElement>('.contact-subtext')
    const contacts = el.querySelector<HTMLElement>('.contact-info')
    const formEl   = el.querySelector<HTMLElement>('.contact-form-wrapper')

    const left  = [eyebrow, heading, subtext, contacts].filter(Boolean) as HTMLElement[]
    const right = [formEl].filter(Boolean) as HTMLElement[]

    gsap.set(left,  { y: 24, opacity: 0 })
    gsap.set(right, { y: 32, opacity: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 78%',
        toggleActions: 'play none none none',
      },
    })

    left.forEach((t, i) => {
      tl.to(t, { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' }, i * 0.1)
    })
    tl.to(right, { y: 0, opacity: 1, duration: 0.75, ease: 'power2.out' }, 0.2)

    return () => tl.kill()
  }, { scope: containerRef })

  return (
    <section
      id="contact"
      ref={containerRef}
      className="py-section-lg section-padding bg-ink"
    >
      <div className="max-width-container">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_6fr] gap-16 lg:gap-24">

          {/* ── 左: 見出し + 連絡先 ── */}
          <div>
            <p
              className="contact-eyebrow label-mono text-gs-500 mb-10"
              style={{ opacity: 0 }}
            >
              Contact — お問い合わせ
            </p>

            <h2
              className="contact-heading font-display font-black text-paper tracking-ja-tight leading-[1.0] mb-8 sm:mb-10"
              style={{
                fontSize: 'clamp(2rem, 5.5vw, 4.5rem)',
                opacity: 0,
              }}
            >
              まずは、話を<br />
              聞かせてください。
            </h2>

            <p
              className="contact-subtext font-ja font-light text-gs-400 tracking-ja-normal leading-[1.9] mb-12 sm:mb-16"
              style={{ fontSize: 'clamp(0.9375rem, 1.4vw, 1.0625rem)', maxWidth: '32em', opacity: 0 }}
            >
              「SaaSを検討したい」「今の業務を整理したい」<br />
              どんな初期段階のご相談も歓迎です。<br />
              ヒアリングは無料です。
            </p>

            {/* 直接連絡先 */}
            <div className="contact-info space-y-5" style={{ opacity: 0 }}>
              <ContactItem
                label="MAIL"
                display="info@grayscale.jp"
                href="mailto:info@grayscale.jp"
              />
              <ContactItem
                label="TEL"
                display="080-1011-7531"
                href="tel:080-1011-7531"
              />
            </div>
          </div>

          {/* ── 右: フォーム ── */}
          <div className="contact-form-wrapper" style={{ opacity: 0 }}>
            <ContactForm />
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── ContactItem ─────────────────────────────────────────────────────────────

function ContactItem({ label, display, href }: { label: string; display: string; href: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <span
        className="label-mono text-gs-700 flex-shrink-0"
        style={{ fontSize: '0.6rem', letterSpacing: '0.12em', minWidth: '2.5rem' }}
      >
        {label}
      </span>
      <a
        href={href}
        className="font-display font-light text-gs-300 hover:text-paper transition-colors duration-200 tracking-ja-snug"
        style={{ fontSize: 'clamp(0.875rem, 1.4vw, 1.0625rem)' }}
      >
        {display}
      </a>
    </div>
  )
}
