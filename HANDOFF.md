# HANDOFF — Grayscale コーポレートサイト リニューアル

> 作成: 2026-06-11 / 担当: 土台フェーズ エージェント
> 後続エージェントはこのドキュメントを読んでから実装を開始すること。
> 発注ブリーフは `/RENEWAL_BRIEF.md` に全文あり。設計判断の最終根拠はブリーフ。

---

## 1. 確定デザイントークン

### カラーパレット（CSS変数）

```css
--color-ink:      #0A0A0A   /* ほぼ黒 — テキスト・ボーダー主色 */
--color-paper:    #FAFAFA   /* ほぼ白 — 背景主色 */
--color-signal:   #FF4D00   /* シグナルオレンジ — 差し色1色のみ。画面の5%未満厳守 */

/* グレースケール段階 */
--color-gray-950: #0A0A0A
--color-gray-900: #171717
--color-gray-700: #404040
--color-gray-500: #737373
--color-gray-400: #A3A3A3
--color-gray-200: #D4D4D4
--color-gray-100: #E5E5E5
--color-gray-50:  #FAFAFA
```

Tailwind では `text-ink` / `bg-paper` / `text-signal` / `text-gs-500` 等でアクセスできる。

### フォント変数

```css
--font-inter-var   /* Inter variable font（next/font/google で注入）*/
--font-noto-var    /* Noto Sans JP variable font（next/font/google で注入）*/
```

Tailwind クラス:
- `font-sans` / `font-display` → Inter（欧文見出し・本文）
- `font-ja` → Noto Sans JP（日本語）
- `font-mono` → JetBrains Mono（**ラベル・キャプション用のみ。見出し使用禁止**）

### タイポスケール（fluid type）

```css
--font-size-hero:    clamp(3.5rem, 12vw, 11rem)   /* .text-hero */
--font-size-display: clamp(2.5rem,  7vw,  6rem)   /* .text-display */
--font-size-heading: clamp(1.75rem, 4vw,  3rem)   /* .text-heading */
--font-size-subhead: clamp(1.25rem, 2vw,  1.75rem)/* .text-subhead */
--font-size-body:    clamp(1rem,    1.2vw, 1.125rem)/* .text-body */
--font-size-sm:      clamp(0.875rem, 1vw, 0.9375rem)/* .text-sm-fluid */
```

Tailwind でも `text-fluid-hero` / `text-fluid-display` 等で使用可（globals.css の `.text-hero` 等のユーティリティクラスも使用可）。

### 日本語letter-spacing ユーティリティ

```
tracking-ja-tight   → letter-spacing: -0.04em   （見出し最大引き締め）
tracking-ja-snug    → letter-spacing: -0.03em
tracking-ja-normal  → letter-spacing: -0.02em   （本文見出し程度）
```

### 余白規約

```
--spacing-section-sm: clamp(4rem,  8vw,  8rem)   /* py-section-sm */
--spacing-section-md: clamp(6rem, 10vw, 12rem)   /* py-section-md */
--spacing-section-lg: clamp(8rem, 14vw, 16rem)   /* py-section-lg */
```

セクション間余白は `py-section-md` or `py-section-lg` を使う。`py-8` 等の固定値で済ませない。

### signal カラーの使用ルール

- **使用可能箇所**: 数字のハイライト・ホバー状態・カーソル・CTA 小アクセント・インジケーター
- **使用禁止**: 背景全面・大きな装飾エリア・テキストブロック全体
- **目安**: 1画面あたり視覚的に占める割合 5% 未満

---

## 2. SmoothScroll / GSAP 使い方規約

### SmoothScroll の仕組み（`components/renewal/SmoothScroll.tsx`）

```
_app.tsx → SmoothScroll でラップ
          └─ Lenis 初期化（lerp: 0.1）
          └─ gsap.ticker.add(time => lenis.raf(time * 1000))
          └─ gsap.ticker.lagSmoothing(0)
          └─ lenis.on('scroll', ScrollTrigger.update)
          └─ ScrollTrigger.refresh() をマウント後に実行
```

**prefers-reduced-motion: reduce の場合は Lenis を起動しない**（通常スクロールにフォールバック）。

### ScrollTrigger をコンポーネントで使う場合

```tsx
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

export function MySection() {
  const container = useRef<HTMLElement>(null)

  useGSAP(() => {
    // ← scope を必ず指定してセレクターを安全に
    gsap.from('.my-element', {
      scrollTrigger: {
        trigger: '.my-element',
        start: 'top 80%',
        end: 'top 20%',
        scrub: false,   // scrub=true はscrolljackingに近くなるので慎重に
      },
      y: 32,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
    })
  }, { scope: container })

  return <section ref={container}>...</section>
}
```

### ScrollTrigger の重要な注意点

- `scrub: true` の多用は scrolljacking に近い体験になるため原則禁止。フェードイン等の one-time trigger（`scrub: false`）を使う。
- `pin: true` （スクロール停止ピン）も原則禁止（scrolljacking）。
- レイアウト変更後は `ScrollTrigger.refresh()` を呼ぶこと。
- Framer Motion と GSAP の ScrollTrigger を**同じ要素に混用しない**。どちらかに統一する。

### Framer Motion との使い分け

| 用途 | 推奨 |
|------|------|
| シンプルなフェードイン（whileInView） | Framer Motion |
| スクロール連動のタイムライン演出 | GSAP ScrollTrigger |
| ページ入場アニメーション（Hero等） | GSAP |
| UI コンポーネントの hover/tap | Framer Motion |

---

## 3. ファイル構成規約

```
components/
  renewal/           ← ★ 新規コンポーネントは全部ここ
    SmoothScroll.tsx    済: Lenis+GSAP統合
    RenewalHeader.tsx   済: プレースホルダー
    HeroSection.tsx     済: プレースホルダー
    StorySection.tsx    済: プレースホルダー
    ValuesSection.tsx   済: プレースホルダー
    ProofSection.tsx    済: プレースホルダー
    MetaSection.tsx     済: プレースホルダー
    ContactSection.tsx  済: プレースホルダー
    RenewalFooter.tsx   済: プレースホルダー
  ─── 旧コンポーネント（削除禁止・importを外した状態）───
  InteractiveHero.tsx
  InteractiveHeader.tsx   ← 会社概要モーダル流用検討可
  ServicesCarousel.tsx    ← 廃止予定（削除はPR後）
  ContactForm.tsx         ← 流用検討可
  SafeQuickContact.tsx    ← ContactSection に流用中
  MouseFollower.tsx       ← 後続で再実装検討
  CrispChat.tsx
  ScrollRevealText.tsx

pages/
  index.tsx    ← 新スケルトン（各セクションをimport）
  _app.tsx     ← SmoothScroll でラップ、next/font/google でフォント注入
  _document.tsx← lang="ja" 確認済み

styles/
  globals.css  ← デザイントークン CSS変数、fluid type ユーティリティ

tailwind.config.js ← CSS変数をTailwindトークンとして拡張済み
```

---

## 4. 各セクション実装状況チェックリスト

### 土台フェーズ（本エージェント担当）

- [x] `npm install lenis gsap @gsap/react`
- [x] next/font/google で Inter (variable) + Noto Sans JP セットアップ
- [x] globals.css にデザイントークン（CSS変数）を定義
- [x] tailwind.config.js を拡張（`ink` / `paper` / `signal` / `gs-*` / `font-display` / `font-ja` / `tracking-ja-*` / `text-fluid-*` / `py-section-*`）
- [x] `components/renewal/SmoothScroll.tsx` 作成（Lenis + GSAP ticker 統合）
- [x] `pages/_app.tsx` を SmoothScroll でラップ
- [x] `pages/_document.tsx` を lang="ja" に確認
- [x] `pages/index.tsx` を新スケルトンに置き換え（旧importコメントアウト）
- [x] 全セクションのプレースホルダーコンポーネント作成
- [x] `npm run build` 通過確認（型エラーゼロ）

### 後続エージェントへの作業（未着手）

- [x] **RenewalHeader** — テキストロゴ・ナビ（Story/Services/Proof/Contact、日英併記）・SPハンバーガー＋フルスクリーンオーバーレイ・スクロールで透明→backdrop-blur+border
- [x] **HeroSection** — 巨大タイポ3行（選ぶ/導く/つくる、weight 200→500→900のグラデーション）・clip-path + translateY GSAP reveal・パンチライン「全部やるから、本物。」・パララックス（ScrollTrigger scrub）
- [ ] **StorySection** — 段落スクロール連動フェードイン・数字のシグナルカラー
- [ ] **ValuesSection** — 3ブロックのスライドイン・SaaSロゴグリッド
- [ ] **ProofSection** — 数字の CountUp アニメーション・実数値をクライアント（星さん）確認して更新
- [ ] **MetaSection** — スタック一覧アニメーション・Lighthouse スコア掲載
- [ ] **ContactSection** — SafeQuickContact のデザインをトークンに合わせる
- [ ] **RenewalFooter** — 会社概要モーダル（InteractiveHeader から移植検討）
- [ ] カスタムカーソル（MouseFollower 再実装）
- [ ] OGP 画像の作成（`public/og.png`）
- [ ] モバイルレスポンシブ確認・調整
- [ ] `prefers-reduced-motion` 全コンポーネントでの対応確認
- [ ] Lighthouse スコア計測・最適化

---

## 5. 後続エージェントへの重要注意点

### NG（ブリーフ §8 より）

```
❌ font-mono を見出しに使う（.label-mono クラスはラベル・キャプション用のみ）
❌ 「茨城」「地域」を Hero・本文に出す（フッターの住所表記のみ可）
❌ scrolljacking（scrub: true や pin: true の安易な使用）
❌ Three.js / WebGL / 3D 演出
❌ パフォーマンスを演出のために犠牲にする
❌ @studio-freight/lenis パッケージ（→ lenis を使う）
```

### 実数値確認が必要な箇所

`ProofSection.tsx` の stats に `??` が入っている部分は、クライアント（星 雄一郎さん / hoshi@grayscale.jp）に確認が必要：
- 導入支援実績（社数）
- 平均業務時間削減率
- 具体的な事例（匿名可）

### signal カラーの使いすぎに注意

`text-signal` / `bg-signal` は画面の 5% 未満に抑える。スクロールしながら常に目に入る場所（ヘッダーなど）への多用は避ける。

### SaaS ロゴ使用時

SmartHR・Google Workspace 等のロゴは各社のブランドガイドラインに従うこと。
白黒またはグレーでの掲示が安全（カラーバージョンは許諾範囲を確認）。

---

## 6. 第2走者エージェント実装メモ（RenewalHeader + HeroSection）

### RenewalHeader 実装詳細

- テキストロゴ「Grayscale」: `font-display font-bold text-ink`（Inter、Inter Bold相当）
- ナビアイテム: Story/Services/Proof/Contact + 日本語サブラベル（.label-mono）
- スクロール状態変化: `window.scrollY > 48` で `backdrop-blur-md border-b bg-paper/80` に切り替え
- SPハンバーガー: 3本線を CSS transition で X に変形、フルスクリーンオーバーレイで各ナビ巨大テキスト表示
- Lenisアンカー: `window.__lenis` 経由で `scrollTo` を呼ぶ。SmoothScroll.tsx が `(window).__lenis = lenis` でexpose済み
- メニュー開閉: `document.body.style.overflow = 'hidden'` でスクロールロック、ESC/リンククリックで閉じる

### HeroSection 実装詳細

- 巨大タイポ3行: `font-size: clamp(3.5rem, 12vw, 11rem)`、各行を `overflow-hidden` でラップしてclip-path reveal
  - 行1「選ぶ。」: fontWeight 200
  - 行2「導く。」: fontWeight 500
  - 行3「つくる。」: fontWeight 900（句点「。」のみ `--color-signal` = #FF4D00）
  - 各行の右側に SELECT / GUIDE / BUILD ラベル（`.label-mono`、sm以上表示）
- 入場アニメーション: `gsap.timeline` で行ごとに `clipPath: 'inset(0 0 0% 0)'` + `y: 0` を stagger 実行（合計約1秒）
- パンチライン「全部やるから、本物。」: `font-display font-black`、fluid type clamp(1.5rem, 3.5vw, 2.75rem)
- サブコピー: Noto Sans JP、font-light、最大36em幅
- パララックス: `typoBgRef` div を ScrollTrigger + scrub 1.2 で `-12%` Y移動（pinなし）
- 背景: 120px グリッド、opacity 0.35（方眼ではなく単線、既視感を避ける）
- `prefers-reduced-motion: reduce`: 即時表示（gsap.set で全要素を表示状態に）
- スクロールインジケーター: SCROLL + CSS animation の縦線（純粋CSS、軽量）
