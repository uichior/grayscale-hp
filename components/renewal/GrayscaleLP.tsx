'use client'

import { useState, type CSSProperties } from 'react'
import { useGrayscaleV2 } from './GrayscaleV2'

/**
 * GrayscaleLP — Claude Design 版 LP のマークアップ（React 移植）
 * ロジックは useGrayscaleV2 フックに分離。
 * 配色・タイポ・余白は x-dc プロトタイプの inline スタイルを忠実に再現。
 */

const MINCHO = "var(--font-mincho)"
const KAKU = "var(--font-kaku)"
const GROTESK = "var(--font-grotesk)"
const MONO = "var(--font-mono-dc)"

// Lenis 経由でスムーススクロール（無ければ素の scrollTo）
function go(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 2
  const lenis = (window as Window & { __lenis?: { scrollTo: (t: number) => void } }).__lenis
  if (lenis) lenis.scrollTo(top)
  else window.scrollTo({ top, behavior: 'smooth' })
}

function goTop() {
  const lenis = (window as Window & { __lenis?: { scrollTo: (t: number) => void } }).__lenis
  if (lenis) lenis.scrollTo(0)
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

// グレースケール 5 段マーク
function GrayscaleMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" aria-label="Grayscale mark" role="img">
      <rect x="0" y="0" width="4.4" height="22" fill="#F4F1EA" opacity={1} />
      <rect x="4.4" y="0" width="4.4" height="22" fill="#F4F1EA" opacity={0.78} />
      <rect x="8.8" y="0" width="4.4" height="22" fill="#F4F1EA" opacity={0.56} />
      <rect x="13.2" y="0" width="4.4" height="22" fill="#F4F1EA" opacity={0.36} />
      <rect x="17.6" y="0" width="4.4" height="22" fill="#F4F1EA" opacity={0.18} />
    </svg>
  )
}

const CHIPS: { label: string; bg: string; border?: boolean }[] = [
  { label: 'CRM', bg: '#1A1712' },
  { label: 'SFA', bg: '#544E43' },
  { label: 'MA', bg: '#938C7E' },
  { label: 'ERP', bg: '#C7C2B7' },
  { label: 'BI', bg: '#F4F1EA', border: true },
  { label: 'HRM', bg: '#1A1712' },
  { label: 'CS', bg: '#544E43' },
  { label: 'PJM', bg: '#938C7E' },
  { label: 'ACC', bg: '#C7C2B7' },
  { label: 'WMS', bg: '#F4F1EA', border: true },
]

const SCRUB_LINES = [
  { text: '多くのIT企業は、ツールを売って終わる。', climax: false },
  { text: '提案書を出し、契約を取り、サポートのURLを渡して——仕事は終わり。', climax: false },
  { text: '定着するかどうかは、現場まかせ。', climax: false },
  { text: 'それが、この業界の「当たり前」だった。', climax: false },
  { text: 'Grayscaleは、その反対側から来た。', climax: true },
]

export function GrayscaleLP() {
  const rootRef = useGrayscaleV2()

  return (
    <div ref={rootRef}>
      {/* プログレスバー */}
      <div data-progress style={{ position: 'fixed', top: 0, left: 0, height: 2, width: '0%', background: '#9B7B45', zIndex: 95 }} />

      {/* 開幕カーテン */}
      <div data-curtain style={{ position: 'fixed', inset: 0, zIndex: 120, display: 'flex', pointerEvents: 'none' }}>
        {[
          { bg: '#1A1712', delay: '0.30s' },
          { bg: '#544E43', delay: '0.37s' },
          { bg: '#938C7E', delay: '0.44s' },
          { bg: '#C7C2B7', delay: '0.51s' },
          { bg: '#F4F1EA', delay: '0.58s' },
        ].map((c, i) => (
          <div key={i} style={{ flex: 1, background: c.bg, animation: `gsCurtain 0.95s cubic-bezier(0.76, 0, 0.24, 1) ${c.delay} both` }} />
        ))}
      </div>

      {/* ヘッダー */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 80, mixBlendMode: 'difference', color: '#F4F1EA', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 clamp(20px, 4vw, 48px)', height: 68 }}>
        <button onClick={goTop} style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: 12, color: '#F4F1EA' }}>
          <GrayscaleMark size={22} />
          <span style={{ font: `600 15px/1 ${GROTESK}`, letterSpacing: '0.07em' }}>GRAYSCALE</span>
        </button>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'clamp(14px, 2.6vw, 34px)' }}>
          <button onClick={() => go('philosophy')} style={{ background: 'none', border: 'none', padding: 0, font: `400 11px/1 ${MONO}`, letterSpacing: '0.16em', color: '#F4F1EA' }}>PHILOSOPHY</button>
          <button onClick={() => go('services')} style={{ background: 'none', border: 'none', padding: 0, font: `400 11px/1 ${MONO}`, letterSpacing: '0.16em', color: '#F4F1EA' }}>SERVICES</button>
          <button onClick={() => go('integration')} style={{ background: 'none', border: 'none', padding: 0, font: `400 11px/1 ${MONO}`, letterSpacing: '0.16em', color: '#F4F1EA' }}>INTEGRATION</button>
          <button onClick={() => go('contact')} style={{ background: 'none', border: '1px solid #F4F1EA', borderRadius: 2, padding: '9px 16px', font: `400 11px/1 ${MONO}`, letterSpacing: '0.16em', color: '#F4F1EA' }}>CONTACT</button>
        </nav>
      </header>

      {/* ヒーロー */}
      <section data-screen-label="Hero" style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '110px clamp(20px, 5.5vw, 72px) 44px', boxSizing: 'border-box', overflow: 'hidden', background: '#F4F1EA', color: '#1A1712' }}>
        <canvas data-ink style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', pointerEvents: 'none', mixBlendMode: 'multiply' }} />
        <div data-hero-content style={{ position: 'relative', zIndex: 2, margin: 'auto 0', willChange: 'transform, opacity' }}>
          <p style={{ margin: 0, font: `400 11px/1.8 ${MONO}`, letterSpacing: '0.2em', color: '#938C7E', animation: 'gsFade 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.95s both' }}>GRAYSCALE INC. — SAAS SELECT SHOP / CONSULTING / DEVELOPMENT</p>
          <h1 style={{ margin: '26px 0 0', fontFamily: MINCHO, fontWeight: 600, fontSize: 'clamp(48px, 10vw, 142px)', lineHeight: 1.14, letterSpacing: '0.015em', fontFeatureSettings: "'palt'", textWrap: 'balance' } as CSSProperties}>
            <span style={{ display: 'block', overflow: 'hidden' }}><span style={{ display: 'inline-block', animation: 'gsRise 1.05s cubic-bezier(0.22, 1, 0.36, 1) 1.0s both' }}>全部やるから、</span></span>
            <span style={{ display: 'block', overflow: 'hidden' }}><span style={{ display: 'inline-block', animation: 'gsRise 1.05s cubic-bezier(0.22, 1, 0.36, 1) 1.12s both' }}>本物<span style={{ color: '#9B7B45' }}>。</span></span></span>
          </h1>
          <p style={{ margin: '34px 0 0', maxWidth: '36em', fontFamily: KAKU, fontWeight: 400, fontSize: 'clamp(14px, 1.4vw, 17px)', lineHeight: 2.1, letterSpacing: '0.03em', color: '#544E43', animation: 'gsFade 0.9s cubic-bezier(0.22, 1, 0.36, 1) 1.45s both', textWrap: 'pretty' } as CSSProperties}>自分で使って、確かめたSaaSだけを売る。現場に定着するまで、離れない。届かない部分は、自分たちでつくる。——SaaSのセレクトショップ、株式会社Grayscale。</p>
        </div>
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, animation: 'gsFade 0.9s cubic-bezier(0.22, 1, 0.36, 1) 1.75s both' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
            <span style={{ font: `400 10px/1 ${MONO}`, letterSpacing: '0.24em', color: '#938C7E' }}>SCROLL</span>
            <span style={{ display: 'block', width: 1, height: 44, background: '#1A1712', animation: 'gsCue 1.8s cubic-bezier(0.65, 0, 0.35, 1) infinite' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, textAlign: 'right', font: `400 11px/1 ${MONO}`, letterSpacing: '0.18em', color: '#71695C' }}>
            <span>N° 01 — SELECTION</span>
            <span>N° 02 — ADOPTION</span>
            <span>N° 03 — DEVELOPMENT</span>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section id="philosophy" data-screen-label="Philosophy" style={{ background: '#1A1712', color: '#F4F1EA' }}>
        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', padding: '17px 0', borderBottom: '1px dashed rgba(244, 241, 234, 0.18)' }}>
          <div data-marquee-track style={{ display: 'inline-flex', willChange: 'transform' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} style={{ font: `400 12px/1 ${MONO}`, letterSpacing: '0.26em', color: 'rgba(244, 241, 234, 0.6)', paddingRight: 64 }}>SELECTION — ADOPTION — DEVELOPMENT — INTEGRATION —</span>
            ))}
          </div>
        </div>
        <div data-scrub-wrap style={{ position: 'relative', height: '330vh' }}>
          <div data-scrub-sticky style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 clamp(20px, 6vw, 88px)', boxSizing: 'border-box' }}>
            <p style={{ margin: '0 0 36px', font: `400 11px/1 ${MONO}`, letterSpacing: '0.2em', color: '#938C7E' }}>THE INDUSTRY STANDARD</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {SCRUB_LINES.map((l, i) => (
                <span
                  key={i}
                  data-scrub-line
                  style={l.climax
                    ? { opacity: 0.13, marginTop: 30, color: '#C9AC79', fontFamily: MINCHO, fontWeight: 600, fontSize: 'clamp(30px, 5.2vw, 70px)', lineHeight: 1.4, letterSpacing: '0.02em', fontFeatureSettings: "'palt'" } as CSSProperties
                    : { opacity: 0.13, fontFamily: MINCHO, fontWeight: 500, fontSize: 'clamp(22px, 3.5vw, 46px)', lineHeight: 1.55, letterSpacing: '0.02em', fontFeatureSettings: "'palt'" } as CSSProperties}
                >
                  {l.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Origin */}
      <section data-screen-label="Origin" style={{ background: '#F4F1EA', color: '#1A1712', padding: 'clamp(90px, 14vh, 170px) clamp(20px, 6vw, 88px)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(44px, 6vw, 100px)', maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ flex: '0 1 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
            <p style={{ margin: 0, font: `400 11px/1 ${MONO}`, letterSpacing: '0.2em', color: '#9B7B45' }}>N° 00 — ORIGIN</p>
            <h2 style={{ margin: 0, writingMode: 'vertical-rl', height: 'clamp(260px, 46vh, 460px)', fontFamily: MINCHO, fontWeight: 600, fontSize: 'clamp(36px, 4.6vw, 64px)', lineHeight: 1.4, letterSpacing: '0.08em', fontFeatureSettings: "'palt'" } as CSSProperties}>現場から、来た。</h2>
          </div>
          <div style={{ flex: '1 1 420px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 28, justifyContent: 'center' }}>
            <p data-reveal style={{ margin: 0, fontFamily: KAKU, fontSize: 'clamp(14px, 1.35vw, 16px)', lineHeight: 2.2, letterSpacing: '0.04em', color: '#3B362E', textWrap: 'pretty' } as CSSProperties}>代表は、製造業の現場でDXを10年、自分の手でやってきた。ツール選定の失敗も、新しい仕組みを現場に定着させる苦しみも、すべて自分事として経験している。「入れたけど、使われなかった」が何を意味するか、肌でわかっている。</p>
            <p data-reveal style={{ margin: 0, fontFamily: KAKU, fontSize: 'clamp(14px, 1.35vw, 16px)', lineHeight: 2.2, letterSpacing: '0.04em', color: '#3B362E', textWrap: 'pretty' } as CSSProperties}>役員として、経営に携わった経験も持つ。コストと効果のバランス、組織への影響、意思決定のスピード——経営者が本当に気にしていることを、現場の言葉に翻訳できる。現場の解像度と経営の判断軸を、同時に持っている。</p>
            <p data-reveal style={{ margin: 0, fontFamily: KAKU, fontSize: 'clamp(14px, 1.35vw, 16px)', lineHeight: 2.2, letterSpacing: '0.04em', color: '#3B362E', textWrap: 'pretty' } as CSSProperties}>だから、Grayscaleの提案は「絵に描いた餅」にならない。その経験が、この会社の仕事の形を決めている。</p>
            <div data-reveal style={{ display: 'flex', alignItems: 'baseline', gap: 24, borderTop: '1px dashed #B6B0A4', paddingTop: 30, marginTop: 14 }}>
              <span style={{ font: `700 clamp(72px, 9vw, 124px)/1 ${GROTESK}`, letterSpacing: '-0.04em' }}>10</span>
              <span style={{ font: `400 11px/1.9 ${MONO}`, letterSpacing: '0.16em', color: '#71695C' }}>YEARS ON-SITE<br />製造業DXの現場で、自分の手で。</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services（横スクロール） */}
      <section id="services" data-screen-label="Services" data-h-wrap style={{ position: 'relative', height: '330vh', background: '#FFFFFF', borderTop: '1px dashed #B6B0A4' }}>
        <div data-h-sticky style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
          <div data-h-track style={{ display: 'flex', height: '100%', width: '300vw', willChange: 'transform' }}>
            <ServiceArticle no="N° 01" tag="SAAS SELECT SHOP" tagColor="#938C7E" eng="Selection" jp="合わないものは、売らない。" desc="自分が実際に使い、効果を確かめたSaaSだけをラインナップに置く。「とりあえず有名なものを」ではなく、「これがこの会社に効く」という確信だけを提案する。バイヤーが、売れるからではなく惚れたものだけを仕入れるのと、同じ感覚で。" footL="WE ONLY STOCK WHAT WE USE." footR="01 / 03" bg="#FFFFFF" color="#1A1712" />
            <ServiceArticle no="N° 02" tag="HANDS-ON CONSULTING" tagColor="#938C7E" eng="Adoption" jp="導入してからが、本番だ。" desc="契約して終わり、ではない。業務フローの再構築、社内研修、現場の抵抗感の解消、定着支援、そして内製化支援まで。ツールが業務に溶け込み、現場の人が自然に使うようになるまで、離れない。それがGrayscaleの伴走の形だ。" footL="WE STAY UNTIL IT STICKS." footR="02 / 03" bg="#F1EEE7" color="#1A1712" borderLeft />
            <ServiceArticle no="N° 03" tag="IN-HOUSE ENGINEERING" tagColor="rgba(244, 241, 234, 0.5)" noColor="#C9AC79" eng="Development" jp="届かない部分は、つくる。" desc="ホームページや制作物の話ではない。社内ポータル、生産管理システム、業務アプリ——現場の業務に直結するツールを、自分たちの手で開発する。SaaSで届かない最後の距離を、コードで埋める。" descColor="rgba(244, 241, 234, 0.72)" footL="IF IT DOESN'T EXIST, WE BUILD IT." footR="03 / 03" footColor="rgba(244, 241, 234, 0.5)" footBorder="rgba(244, 241, 234, 0.25)" bg="#1A1712" color="#F4F1EA" dark />
          </div>
        </div>
      </section>

      {/* Integration（チップ集約） */}
      <section id="integration" data-screen-label="Integration" data-conv-wrap style={{ position: 'relative', height: '300vh', background: '#F4F1EA', color: '#1A1712' }}>
        <div data-conv-sticky style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '88px clamp(20px, 5vw, 64px) 36px', boxSizing: 'border-box', textAlign: 'center' }}>
          <div data-conv-head>
            <p style={{ margin: '0 0 18px', font: `400 11px/1 ${MONO}`, letterSpacing: '0.2em', color: '#9B7B45' }}>N° 04 — INTEGRATION</p>
            <h2 style={{ margin: 0, fontFamily: MINCHO, fontWeight: 600, fontSize: 'clamp(22px, 3.2vw, 42px)', lineHeight: 1.5, letterSpacing: '0.02em', fontFeatureSettings: "'palt'" } as CSSProperties}>SaaSが増えるほど、現場は混乱する。</h2>
          </div>
          <div data-conv-stage style={{ position: 'relative', flex: 1, width: '100%', minHeight: 0 }}>
            {CHIPS.map((c, i) => (
              <div key={i} data-chip style={{ position: 'absolute', left: '50%', top: '50%', width: 48, height: 120, borderRadius: 3, background: c.bg, transform: 'translate(-50%, -50%)', willChange: 'transform', ...(c.border ? { border: '1px solid rgba(26, 23, 18, 0.22)', boxSizing: 'border-box' } : {}) }}>
                <span data-chip-label style={{ position: 'absolute', top: -26, left: '50%', transform: 'translateX(-50%)', font: `400 10px/1 ${MONO}`, letterSpacing: '0.14em', color: '#71695C', whiteSpace: 'nowrap' }}>{c.label}</span>
              </div>
            ))}
          </div>
          <div data-conv-caption style={{ opacity: 0, willChange: 'transform, opacity', maxWidth: 760 }}>
            <p style={{ margin: 0, fontFamily: MINCHO, fontWeight: 600, fontSize: 'clamp(22px, 3vw, 38px)', lineHeight: 1.6, letterSpacing: '0.02em', fontFeatureSettings: "'palt'" } as CSSProperties}>増やすのではなく、<span style={{ borderBottom: '2px solid #9B7B45', paddingBottom: 2 }}>整理して、一本化する</span>。</p>
            <p style={{ margin: '20px 0 0', fontFamily: KAKU, fontSize: 'clamp(13px, 1.3vw, 15px)', lineHeight: 2.1, letterSpacing: '0.04em', color: '#544E43', textWrap: 'pretty' } as CSSProperties}>本当に必要なSaaSだけを厳選し、API連携でひとつのポータルに統合する。それでも賄えない専門業務には、専用のツールを開発する。</p>
          </div>
        </div>
      </section>

      {/* Proof（タイピング） */}
      <section data-screen-label="Proof" style={{ background: '#FFFFFF', color: '#1A1712', borderTop: '1px dashed #B6B0A4', padding: 'clamp(90px, 14vh, 170px) clamp(20px, 6vw, 88px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: 'clamp(44px, 5vw, 88px)', maxWidth: 1280, margin: '0 auto', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
            <p data-reveal style={{ margin: 0, font: `400 11px/1 ${MONO}`, letterSpacing: '0.2em', color: '#9B7B45' }}>N° 05 — PROOF</p>
            <h2 data-reveal style={{ margin: 0, fontFamily: MINCHO, fontWeight: 600, fontSize: 'clamp(30px, 4.2vw, 56px)', lineHeight: 1.4, letterSpacing: '0.02em', fontFeatureSettings: "'palt'" } as CSSProperties}>このサイトも、<br />私たちが書いた。</h2>
            <p data-reveal style={{ margin: 0, maxWidth: '36em', fontFamily: KAKU, fontSize: 'clamp(14px, 1.35vw, 16px)', lineHeight: 2.2, letterSpacing: '0.04em', color: '#544E43', textWrap: 'pretty' } as CSSProperties}>設計も、コードも、アニメーションも、外注していない。代理店でありながら、作る側の人間でもある。だから、ツールの良し悪しを本当の意味で判断できる。</p>
            <p data-reveal style={{ margin: 0, borderTop: '1px dashed #B6B0A4', paddingTop: 24, fontFamily: MINCHO, fontWeight: 600, fontSize: 'clamp(18px, 2.1vw, 27px)', lineHeight: 1.7, letterSpacing: '0.02em', color: '#87693A', fontFeatureSettings: "'palt'", textWrap: 'pretty' } as CSSProperties}>「作れる会社が選ぶSaaSは、本物だ」——<br />この一文は、このページの存在が証明している。</p>
          </div>
          <div data-type-card data-reveal style={{ background: '#1A1712', borderRadius: 4, padding: 'clamp(22px, 3vw, 34px)', boxShadow: '0 24px 60px -30px rgba(26, 23, 18, 0.45)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, borderBottom: '1px dashed rgba(244, 241, 234, 0.18)', paddingBottom: 14, marginBottom: 20, font: `400 10px/1 ${MONO}`, letterSpacing: '0.18em', color: 'rgba(244, 241, 234, 0.45)' }}>
              <span>GRAYSCALE.JP — LP.TSX</span>
              <span>BUILT IN-HOUSE</span>
            </div>
            <pre style={{ margin: 0, minHeight: 330, font: `400 13px/1.9 ${MONO}`, color: '#C7C2B7', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}><span data-type-text /><span style={{ display: 'inline-block', width: 8, height: 15, background: '#C9AC79', marginLeft: 3, verticalAlign: -2, animation: 'gsBlink 1.1s steps(1) infinite' }} /></pre>
          </div>
        </div>
      </section>

      {/* Contact */}
      <ContactArea />

      {/* カスタムカーソル */}
      <div data-cursor style={{ position: 'fixed', top: 0, left: 0, width: 12, height: 12, borderRadius: '50%', background: '#F4F1EA', mixBlendMode: 'difference', pointerEvents: 'none', zIndex: 130, opacity: 0, transform: 'translate3d(-100px, -100px, 0)', willChange: 'transform' }} />
    </div>
  )
}

// ─── Service Article ──────────────────────────────────────────
function ServiceArticle(props: {
  no: string; noColor?: string; tag: string; tagColor: string
  eng: string; jp: string; desc: string; descColor?: string
  footL: string; footR: string; footColor?: string; footBorder?: string
  bg: string; color: string; borderLeft?: boolean; dark?: boolean
}) {
  return (
    <article style={{ width: '100vw', height: '100%', flex: '0 0 auto', boxSizing: 'border-box', padding: '100px clamp(20px, 6vw, 88px) 48px', display: 'flex', flexDirection: 'column', background: props.bg, color: props.color, ...(props.borderLeft ? { borderLeft: '1px solid rgba(26, 23, 18, 0.1)' } : {}) }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', font: `400 11px/1 ${MONO}`, letterSpacing: '0.2em', color: props.noColor || '#9B7B45' }}>
        <span>{props.no}</span>
        <span style={{ color: props.tagColor }}>{props.tag}</span>
      </div>
      <div style={{ margin: 'auto 0', padding: '40px 0' }}>
        <p style={{ margin: 0, font: `600 clamp(54px, 8.5vw, 122px)/0.98 ${GROTESK}`, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>{props.eng}</p>
        <h3 style={{ margin: '30px 0 0', fontFamily: MINCHO, fontWeight: 600, fontSize: 'clamp(24px, 3.4vw, 44px)', lineHeight: 1.5, letterSpacing: '0.02em', fontFeatureSettings: "'palt'" } as CSSProperties}>{props.jp}</h3>
        <p style={{ margin: '22px 0 0', maxWidth: '38em', fontFamily: KAKU, fontSize: 'clamp(14px, 1.35vw, 16px)', lineHeight: 2.1, letterSpacing: '0.04em', color: props.descColor || '#544E43', textWrap: 'pretty' } as CSSProperties}>{props.desc}</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px dashed ${props.footBorder || '#B6B0A4'}`, paddingTop: 16, font: `400 10px/1 ${MONO}`, letterSpacing: '0.18em', color: props.footColor || '#938C7E' }}>
        <span>{props.footL}</span>
        <span>{props.footR}</span>
      </div>
    </article>
  )
}

// ─── Contact（CTA + フォーム + フッター） ─────────────────────
type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'
interface FormData { name: string; company: string; email: string; message: string }

function ContactArea() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormData>({ name: '', company: '', email: '', message: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [status, setStatus] = useState<SubmitStatus>('idle')

  const set = (f: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(p => ({ ...p, [f]: e.target.value }))
    if (errors[f]) setErrors(p => ({ ...p, [f]: undefined }))
  }

  const validate = (d: FormData) => {
    const er: Partial<Record<keyof FormData, string>> = {}
    if (!d.name.trim()) er.name = 'お名前を入力してください'
    if (!d.email.trim()) er.email = 'メールアドレスを入力してください'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) er.email = '正しいメールアドレスを入力してください'
    if (!d.message.trim()) er.message = 'ご相談内容を入力してください'
    return er
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const er = validate(form)
    if (Object.keys(er).length) { setErrors(er); return }
    setStatus('submitting')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(`status ${res.status}`)
      setStatus('success')
    } catch (err) {
      console.error('[contact] submit failed:', err)
      setStatus('error')
    }
  }

  const fieldStyle: CSSProperties = {
    width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(244,241,234,0.25)',
    padding: '12px 0', color: '#F4F1EA', fontFamily: KAKU, fontWeight: 300, fontSize: 15, outline: 'none',
  }
  const labelStyle: CSSProperties = { font: `400 10px/1 ${MONO}`, letterSpacing: '0.16em', color: 'rgba(244,241,234,0.5)', display: 'block', marginBottom: 8, textAlign: 'left' }
  const errStyle: CSSProperties = { font: `400 10px/1.6 ${MONO}`, letterSpacing: '0.04em', color: '#C9AC79', marginTop: 6, textAlign: 'left' }

  return (
    <section id="contact" data-screen-label="Contact" style={{ background: '#1A1712', color: '#F4F1EA' }}>
      <div style={{ padding: 'clamp(110px, 18vh, 210px) clamp(20px, 6vw, 88px)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
        <p data-reveal style={{ margin: 0, font: `400 11px/1 ${MONO}`, letterSpacing: '0.22em', color: '#C9AC79' }}>CONTACT — FREE HEARING</p>
        <h2 data-reveal style={{ margin: 0, fontFamily: MINCHO, fontWeight: 600, fontSize: 'clamp(34px, 6.2vw, 82px)', lineHeight: 1.3, letterSpacing: '0.02em', fontFeatureSettings: "'palt'", textWrap: 'balance' } as CSSProperties}>まずは、話を<br />聞かせてほしい。</h2>
        <p data-reveal style={{ margin: 0, maxWidth: '36em', fontFamily: KAKU, fontSize: 'clamp(14px, 1.35vw, 16px)', lineHeight: 2.1, letterSpacing: '0.04em', color: 'rgba(244, 241, 234, 0.66)', textWrap: 'pretty' } as CSSProperties}>SaaSの検討を始めたばかりでも、今の業務を整理したいだけでも構いません。初期段階の相談を、歓迎しています。</p>

        {!open && status !== 'success' && (
          <div data-reveal style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, marginTop: 8 }}>
            <button data-hover onClick={() => setOpen(true)} style={{ background: '#F4F1EA', color: '#1A1712', border: 'none', borderRadius: 2, padding: '19px 44px', fontFamily: KAKU, fontWeight: 500, fontSize: 15, letterSpacing: '0.12em', display: 'flex', alignItems: 'center', gap: 14, transition: 'background 0.3s ease' }}>
              無料ヒアリングを予約する<span style={{ fontFamily: MONO }}>→</span>
            </button>
            <span style={{ font: `400 10px/1 ${MONO}`, letterSpacing: '0.2em', color: 'rgba(244, 241, 234, 0.4)' }}>HEARING IS FREE — ONLINE OK</span>
            <span style={{ font: `400 11px/1.8 ${MONO}`, letterSpacing: '0.1em', color: 'rgba(244, 241, 234, 0.5)' }}>
              または <a href="mailto:info@grayscale.jp" style={{ color: '#C9AC79' }}>info@grayscale.jp</a> / <a href="tel:080-1011-7531" style={{ color: '#C9AC79' }}>080-1011-7531</a>
            </span>
          </div>
        )}

        {open && status !== 'success' && (
          <form onSubmit={submit} noValidate style={{ width: '100%', maxWidth: 520, marginTop: 12, display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div>
              <label htmlFor="cf-name" style={labelStyle}>NAME — お名前 *</label>
              <input id="cf-name" type="text" value={form.name} onChange={set('name')} placeholder="山田 太郎" style={fieldStyle} disabled={status === 'submitting'} autoComplete="name" />
              {errors.name && <p style={errStyle}>{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="cf-company" style={labelStyle}>COMPANY — 会社名</label>
              <input id="cf-company" type="text" value={form.company} onChange={set('company')} placeholder="株式会社○○（任意）" style={fieldStyle} disabled={status === 'submitting'} autoComplete="organization" />
            </div>
            <div>
              <label htmlFor="cf-email" style={labelStyle}>MAIL — メールアドレス *</label>
              <input id="cf-email" type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" style={fieldStyle} disabled={status === 'submitting'} autoComplete="email" />
              {errors.email && <p style={errStyle}>{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="cf-message" style={labelStyle}>MESSAGE — ご相談内容 *</label>
              <textarea id="cf-message" value={form.message} onChange={set('message')} placeholder="どんな初期段階のご相談でも歓迎します。" rows={4} style={{ ...fieldStyle, resize: 'none' }} disabled={status === 'submitting'} />
              {errors.message && <p style={errStyle}>{errors.message}</p>}
            </div>
            <button data-hover type="submit" disabled={status === 'submitting'} style={{ background: '#F4F1EA', color: '#1A1712', border: 'none', borderRadius: 2, padding: '17px 40px', fontFamily: KAKU, fontWeight: 500, fontSize: 15, letterSpacing: '0.12em', opacity: status === 'submitting' ? 0.5 : 1 }}>
              {status === 'submitting' ? '送信中...' : '送信する →'}
            </button>
            {status === 'error' && <p style={errStyle}>送信に失敗しました。恐れ入りますが直接ご連絡ください。</p>}
          </form>
        )}

        {status === 'success' && (
          <div data-reveal style={{ marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <p style={{ margin: 0, fontFamily: MINCHO, fontWeight: 600, fontSize: 'clamp(22px, 3vw, 32px)', color: '#C9AC79' }}>送信が完了しました。</p>
            <p style={{ margin: 0, fontFamily: KAKU, fontWeight: 300, fontSize: 14, lineHeight: 2, color: 'rgba(244,241,234,0.66)' }}>1〜2営業日以内にご連絡いたします。<br />お急ぎの場合は 080-1011-7531 まで。</p>
          </div>
        )}
      </div>

      <footer style={{ borderTop: '1px dashed rgba(244, 241, 234, 0.18)', padding: '26px clamp(20px, 4vw, 48px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <GrayscaleMark size={20} />
          <span style={{ font: `400 10px/1.7 ${MONO}`, letterSpacing: '0.16em', color: 'rgba(244, 241, 234, 0.5)' }}>© 2026 株式会社GRAYSCALE</span>
        </div>
        <span style={{ font: `400 10px/1.7 ${MONO}`, letterSpacing: '0.16em', color: 'rgba(244, 241, 234, 0.5)' }}>DESIGNED, CODED &amp; ANIMATED IN-HOUSE</span>
      </footer>
    </section>
  )
}
