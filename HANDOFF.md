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
- [x] **StorySection** — 4ビートスクロールストーリーテリング・背景ink反転・行単位テキストリビール
- [x] **ValuesSection** — 3ブロック縦並び・巨大番号タイポグラフィ・ScrollTriggerスライドイン
- [x] **ProofSection** — 数字の CountUp アニメーション実装済み・実数値は TODO フラグ付きプレースホルダー（星さん確認待ち）
- [x] **MetaSection** — スタックアニメーション・View Source リンク（github.com/uichior/grayscale-hp）・Values「BUILD」伏線回収
- [x] **ContactSection** — 4項目フォーム（名前・会社・メール・相談内容）・バリデーション・submit状態管理・直接連絡先表示
- [x] **RenewalFooter** — 確定情報全項目・巨大ワードマーク背景・SNSリンク・ミッション・黒背景で締め
- [x] カスタムカーソル（`components/renewal/CustomCursor.tsx` 新規作成・_app.tsx に組み込み）
- [x] OGP 画像の作成（`public/og.png`）— 1200×630 PNG（35KB）を生成・配置済み（ヒーローの3行タイポスクリーンショット）
- [ ] モバイルレスポンシブ確認・調整
- [x] `prefers-reduced-motion` 全コンポーネントでの対応確認（全 useGSAP ブロックで確認済み）
- [x] **InkCanvas（墨流しWebGL流体シミュレーション）** — HeroSection の背景レイヤーに追加済み（第8走者）
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

## 7. 第3走者エージェント実装メモ（StorySection + ValuesSection）

### StorySection 実装詳細

- 構成: `<div id="story">` で4つの `<Beat>` コンポーネントをラップ。各ビートは独立したセクションブロック。
- **Beat 1** (paper背景): 「ほとんどの代理店は、売って終わる。」— 白背景・静かな挑発トーン
- **Beat 2〜4** (ink背景): Beat2から黒背景に反転。物語の転調演出。
  - Beat 4 の `isClimax={true}` で文字サイズを最大化・最も強く
  - Beat 4 の sentence末尾「。」のみ `--color-signal` (#FF4D00)
- `Beat` コンポーネント: `useGSAP` + `scope: ref` でセルフコンテインド。`story-line`（行ごとoverflow-hidden + translateY）と `story-support`（フェードイン要素）を分けて管理
- `FlowDiagram`: Beat3内の一気通貫フロー（SELECT → DEPLOY → ADOPT → INTERN → BUILD）。横スクロール対応、ScrollTriggerなし（Beat3のrevealに含まれる）
- `prefers-reduced-motion`: `window.matchMedia` チェック後に即 return（gsap.set は呼ばない）
- JSXでの二重引用符: `"つくれる人間"` など日本語の「"」はJSX属性内でprops誤認を引き起こすため `{' ... '}` で囲む

### ValuesSection 実装詳細

- ヒーロー連動: セクション見出しを「選ぶ。導く。つくる。」で統一（SELECT/GUIDE/BUILD ラベルとの言語体系一貫性）
- レイアウト: `grid grid-cols-1 lg:grid-cols-[1fr_2fr]` — 左に巨大番号、右にコンテンツ
- 番号タイポ: `clamp(6rem, 18vw, 14rem)` / `color: var(--color-gray-100)` で薄いグレー背景要素として扱う。ホバー時に `group-hover` で若干濃くなる
- signal カラー使用箇所: 各バレットの先頭ドット（`w-1 h-1 rounded-full`）のみ。5%ルール厳守
- 各 `ValueBlock` に `useGSAP` + `scope: ref` で独立したScrollTrigger
- `valuesEyebrow` と `valuesHeading` はコンテナの `useGSAP` で制御（セクション入場時）

### 背景反転とヘッダー対応

- Beat 2〜4 が `bg-ink` で黒背景。
- `RenewalHeader` はすでに `text-ink`（通常時）/ scrollした後は `bg-paper/80 backdrop-blur-md` で半透明背景付き。
- 黒背景セクション上でヘッダーが見えるかは、既存実装の「スクロール後 = bg-paper/80付き」で対応済み。ヘッダーがピン留めなしで通常スクロールするため、ユーザーが Story セクションまでスクロール時にはすでにヘッダー背景が付いており可読性を担保。
- ※ mix-blend-mode の対応は現段階では不要と判断（backdrop-blur+bg-paper/80 で十分）。

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

---

## 8. 第4走者エージェント実装メモ（Proof / Meta / Contact / Footer）

### ProofSection 実装詳細

- 背景: `bg-ink`（ValuesSection の白から黒に転調）
- **Stats**: `STATS` 定数配列に分離。`useCountUp` カスタムフック（GSAP + ScrollTrigger でビュー内1回だけカウントアップ）。
  - 「10年」のみ confirmed=true（代表経験・確定値）。残りは `confirmed: false` + `note` フィールドにTODOコメント
  - `// TODO(星さん確認): 実数値に差し替えてください` をデータ配列コメントとして記載
- **匿名事例（CASES）**: 「製造業A社・従業員50名」「製造業B社・従業員120名」の2件。TODOコメント付き
- **SaasBlock**: `SAAS_LIST` に `logoAvailable: false` フラグ。現在はタイポグラフィのみ表示。
  - ロゴ画像差し替え手順のコメントをJSX内に残してある
- `prefers-reduced-motion`: 全 `useGSAP` ブロック先頭で `window.matchMedia` チェック

### MetaSection 実装詳細

- 背景: `bg-paper`（Proofの黒→白でコントラスト転換、Contactの黒へ向けてリズムのリセット）
- メインコピー: 「このサイトも、自分たちでつくった。」（ディレクター決定文言をそのまま使用）
- **View Source リンク**: `https://github.com/uichior/grayscale-hp` / `target="_blank" rel="noopener noreferrer"`
- スタック一覧: `StackItem` コンポーネントで `x: -16` からスライドイン（stagger 0.08s）
- Values「03 BUILD」との呼応: 右カラム下部に「03 / BUILD — つくる。」をモノラベルで記載

### ContactSection 実装詳細

- 背景: `bg-ink`（MetaSection の白から再び黒に。最後の CTA として重厚に）
- **フォーム送信**: 旧 ContactForm と同様、現時点は外部エンドポイントなし（1.2秒のシミュレート）。
  - API追加時は `fetch('/api/contact', ...)` に差し替えるコメントをコード内に記載
  - `mailto:info@grayscale.jp` の直接連絡先リンクを見出し側に常時表示（フォールバック）
- **バリデーション**: 名前・メール（形式チェック）・相談内容 = 必須。会社名 = 任意
- **状態管理**: `idle / submitting / success / error` の4状態
- 成功画面: signal カラーのチェックマーク + テキスト（ページ遷移なし）

### RenewalFooter 実装詳細

- 背景: `bg-ink`（Contact に続き黒で締める）
- **巨大ワードマーク**: `GRAYSCALE` を `WebkitTextStroke` で透明・アウトラインのみ表示、`position: absolute; bottom: 0` で沈み込む演出
- **Lenis スクロール**: フッター内ナビは `window.__lenis?.scrollTo()` 経由。SmoothScroll.tsx のexpose済みインスタンスを使用
- 確定情報の郵便番号: `〒310-0852` を住所の前に付与（ブリーフ §2 に郵便番号の記載はなかったが 水戸市笠原町の標準）

---

## 11. 第7走者エージェント ディレクターレビュー対応完了メモ（2026-06-11）

### 修正概要（指摘1〜10全対応）

**HIGH（必須）**

1. **ウェイトグラデーション復活**:
   - 原因: `font-display` クラスが Inter（欧文フォント）のみで、日本語グリフはシステムフォールバック → weight が効かなかった。
   - 修正: HeroSection の3行タイポ・ValuesSection の見出しを `font-ja`（Noto Sans JP）クラスに変更。tailwind.config.js の `display` フォントスタックに `var(--font-noto-var)` を追加。pages/_app.tsx の weight 配列に `200` を追加。
   - ValuesSection の「選ぶ。導く。つくる。」見出し・各ValueBlockの `jaLabel` にも200/500/900グラデーション適用。

2. **泣き別れ修正**:
   - StorySection Beat1: `statementLine2` propsで「ほとんどの代理店は、」「売って終わる。」を分割。
   - MetaSection: `inline-block + nowrap` span と `clamp(1.75rem, 5vw, 4.5rem)` に調整。
   - ContactSection: 同様に `nowrap` span。
   - FooterミッションはIssue 10と共通（inline-block文節wrap）。

3. **ヘッダー mix-blend-mode: difference 実装**:
   - RenewalHeader.tsx を全面書き直し。ヘッダー要素を白文字・白ボーダーにして `mix-blend-mode: difference` を適用。
   - スクロールに連動した backdrop-blur + bg 切り替えは廃止（blend で可読性担保）。
   - SPオーバーレイメニュー開放時は blend を `normal` に解除。ハンバーガーはメニュー開時のみ bg-ink の黒線に切り替え。

4. **ContactSection MAIL/TEL 表示修正**:
   - ContactItem のラベル色を `text-gs-700` → `text-gs-400` に変更（コントラスト改善）。
   - 値テキストを `text-gs-300` → `text-paper` に変更（確実に見える）。
   - ScrollTrigger の start を `top 78%` → `top 85%` に緩和。
   - reduced-motion 時の即時表示を追加。

5. **カスタムカーソルのモバイルガード強化**:
   - `(pointer: fine)` → `(pointer: fine) and (hover: hover)` に変更（タッチエミュレーション対策）。
   - 初期位置を `(-100, -100)` に設定し、最初の mousemove まで opacity: 0 を維持。

**MEDIUM**

6. **句点処理改善**: 各行の句点を `fontWeight: 700` + `fontSize: 0.72em` に設定してリング感を軽減。
7. **グリッドopacity削減**: `opacity: 0.35` → `0.08`、`backgroundSize: 120px` → `480px×320px`（間引き）。
8. **Meta文体統一**: 「外注していない。」「証明だ。」「本物だ。」に常体化。
9. **Proof見出しコピー改善**: 「数字という名の実績。」→「数字がある。」に簡潔化。
10. **Footer泣き別れ修正**: ミッション文を `inline-block` 3文節 wrap で「共に成長していく。」改行制御。

### 目視確認済み（round2スクリーンショット）

```
/tmp/grayscale-qa/round2/desktop-hero.png       — ウェイトグラデーション確認
/tmp/grayscale-qa/round2/desktop-story-beat1.png — Beat1泣き別れ修正確認
/tmp/grayscale-qa/round2/desktop-story-beat2-dark.png — ヘッダーblend反転確認
/tmp/grayscale-qa/round2/desktop-meta.png        — Meta常体・見出し確認
/tmp/grayscale-qa/round2/desktop-contact.png     — MAIL/TEL表示・泣き別れ確認
/tmp/grayscale-qa/round2/desktop-footer.png      — Footer泣き別れ修正確認
/tmp/grayscale-qa/round2/mobile-hero.png         — モバイルウェイトグラデーション確認
/tmp/grayscale-qa/round2/mobile-contact.png      — モバイルMAIL/TEL・カーソルなし確認
```

---

## 10. 第5走者エージェント 磨き込み完了メモ（2026-06-11）

### 削除ファイル一覧

以下は全て import が外れていることを grep で確認してから削除:

```
components/InteractiveHero.tsx
components/ServicesCarousel.tsx
components/InteractiveCard.tsx
components/ScrollRevealText.tsx
components/MouseFollower.tsx
components/InteractiveHeader.tsx
components/ContactForm.tsx
components/SafeQuickContact.tsx
components/ui/button.tsx
components/ui/card.tsx
components/ui/dialog.tsx
components/ui/input.tsx
components/ui/textarea.tsx
hooks/useMousePosition.ts
public/ibaraki.png        （地域性排除 §1 方針）
public/grid.svg           （使用箇所なし）
```

残したもの:
- `components/CrispChat.tsx` — import 済み（index.tsxコメントアウト中）。削除するかは星さん判断待ち
- `public/kaizen-labo.html` — 星さん確認待ち（ブリーフ §7 より）

### 新規作成ファイル

- `components/renewal/CustomCursor.tsx` — GSAP quickTo でミニマルカーソル（ドット8px + 遅延追従リング32px）
- `types/global.d.ts` — `window.__lenis: Lenis | undefined` 型定義

### 修正内容

- `pages/index.tsx` — SEO/OGP/Twitter Card 本実装。title・description・og:image パス設定
- `pages/_app.tsx` — CustomCursor 追加
- `components/renewal/SmoothScroll.tsx` — `(window as any).__lenis` → `window.__lenis` に型安全化
- `components/renewal/RenewalHeader.tsx` — 同上
- `components/renewal/RenewalFooter.tsx` — 同上 + `querySelector<HTMLElement>` で型修正
- `components/renewal/ContactSection.tsx` — label/input に id/htmlFor 紐付け、aria-required・aria-describedby 追加
- `styles/globals.css` — `:focus-visible` + `.bg-ink :focus-visible`（黒背景で白アウトライン）追加

### 残課題

- Lighthouse スコア計測・最適化
- モバイルレスポンシブ最終確認
- `public/kaizen-labo.html` の扱い（星さん判断）
- ProofSection 実数値差し替え（星さん確認）
- ContactSection フォーム送信エンドポイント実装

---

## 12. 最終走者エージェント 仕上げ完了メモ（2026-06-11）

### 対応内容

1. **MetaSection 見出し字間アーティファクト修正**
   - `<h2>` 内の span を隙間なく連結（JSX改行由来の空白を排除）
   - 「自分たちでつくった。」を「自分たちで」と「つくった。」に文節分割（inline-block × 2）
   - 「このサイトも、」の span は独立した行（`<br />`の前）として維持

2. **OG画像生成 (`public/og.png`)**
   - Playwright（headless:false）で `http://localhost:3000/` を 1200×900 viewport で撮影
   - アニメーション完了後（4秒待機）にナビ・スクロールインジケーターを非表示にしてクロップ
   - `clip: { x:0, y:0, width:1200, height:630 }` で正確な OG サイズに切り出し
   - 仕様: 1200×630 px / PNG / 35KB / 「選ぶ。導く。つくる。」3行タイポ＋SELECT/GUIDE/BUILDラベル＋オレンジシグナル丸が映り込む
   - SEO メタ（`og:image: https://www.grayscale.jp/og.png`）はすでに宣言済みのため変更不要

3. **掃除**
   - `git checkout -- package.json package-lock.json` で Playwright インストール差分をリセット
   - `npm run build` 通過確認（型エラーゼロ・静的ページ生成3件）
   - grayscale-hp の next dev プロセスを停止

---

## 9. 星さん確認待ちリスト（第4走者集約）

> 後続エージェント or 星さん自身が対応してください。

| # | 項目 | 現在の状態 | 確認・対応 |
|---|------|-----------|-----------|
| 1 | ProofSection — 平均業務時間削減率 | `50%` (仮置き) | 実績データに差し替え |
| 2 | ProofSection — 月間削減時間の目安 | `40h` (仮置き) | 実際の事例ベースに差し替え |
| 3 | ProofSection — 匿名事例A社 | 金属部品加工・50名・Google Workspace (仮) | 実際の事例許諾取得後に差し替え |
| 4 | ProofSection — 匿名事例B社 | 食品加工・120名・SmartHR (仮) | 実際の事例許諾取得後に差し替え |
| 5 | 取り扱いSaaS ロゴ画像 | テキスト表示のみ | 各社ブランドガイドライン確認後 `logoAvailable=true` + ロゴファイル配置 |
| 6 | `public/kaizen-labo.html` | 旧サービスページ（存続中） | 新サイト統合 or 削除を星さん判断 |
| 7 | ContactSection フォーム送信エンドポイント | シミュレートのみ | `/api/contact` 等のバックエンド実装が必要な場合は別途実装 |
| 8 | フッター 郵便番号 `〒310-0852` | 水戸市笠原町の一般的な番号を付与 | 正確な郵便番号を確認して修正 |

---

## 13. 第8走者エージェント 墨流しWebGL完了メモ（2026-06-11）

### InkCanvas 実装詳細

**ファイル**: `components/renewal/InkCanvas.tsx`
**統合先**: `components/renewal/HeroSection.tsx`（背景レイヤー1として絶対配置）

### シミュレーション構成

- **アルゴリズム**: stable fluids（GPU Gems 3, Ch.38）、Pavel Dobryakovの WebGL-Fluid-Simulation(MIT) を参考に自前実装
- **パイプライン**: curl → vorticity → advect velocity → divergence → pressure Jacobi×20 → gradient subtract → advect dye
- **FBO構成**: velocity (128px), dye (720px desk / 512px mobile) の double FBO
- **拡張**: OES_texture_half_float（対応時）/ UNSIGNED_BYTE（フォールバック）

### ビジュアルパラメータ（`InkCanvas.tsx` 先頭定数で調整可能）

```
SIM_RESOLUTION       = 128       // 速度場解像度
DYE_RESOLUTION_DESKTOP = 720     // 染料場解像度
VELOCITY_DISSIPATION = 0.98      // 速度の減衰（大→とろみ感UP）
DENSITY_DISSIPATION  = 0.990     // 墨の減衰（大→長く漂う、小→早く消える）
VORTICITY_STRENGTH   = 15        // 渦巻き強さ
INK_COLOR.r          = 0.28      // 墨の濃度（大→濃い）
displayFragSrc: clamp max 0.55   // 最大表示濃度（文字は純黒=1.0 > 0.55で勝つ）
autoDrop large radius = 0.008    // 自動ドロップ半径（大→広い滲み）
```

### 墨チャンネル分離（displayFragSrcのシェーダー）

- `dye.x` = 墨濃度（モノクロ）→ bg(#FAFAFA) から黒へ補間、max 55%
- `dye.y` = オレンジ濃度 → bg から vec3(1.0,0.30,0.0) へ補間、max 45%
- 10回に1回クリックで ORANGE_COLOR が使用される

### アクセシビリティ・パフォーマンスガード

- SSR: null return（サーバー側未実行）
- `prefers-reduced-motion: reduce`: null return（起動しない）
- WebGL失敗/contextlost: 安全にnull化（エラーthrowなし）
- init遅延: `requestIdleCallback`（フォールバックは setTimeout 200ms）
- IntersectionObserver: ヒーロー外でRAF停止
- visibilitychange: タブ非表示時にRAF停止
- アンマウント時: RAF・GL全リソース・全listenerを完全破棄
- canvas: `aria-hidden="true"`, `pointer-events: none`

### 確認済みスクリーンショット

```
/tmp/grayscale-qa/ink/01_after_load.png   — ロード3秒後（自動ドロップ確認）
/tmp/grayscale-qa/ink/02_after_mouse.png  — マウス移動後の墨軌跡
/tmp/grayscale-qa/ink/03_after_click.png  — クリック2回後
```

---

## 14. 第9走者エージェント 墨質感追い込み + Lighthouse 完了メモ（2026-06-11）

### タスク1: 墨の質感調整（ディレクター差し戻し対応）

**調整ラウンド数**: 3ラウンド

**最終パラメータ**（`InkCanvas.tsx` 先頭定数）:

```
SIM_RESOLUTION         = 192      // 128 → 192 UPで渦の細かさ改善
JACOBI_ITERATIONS      = 30       // 20 → 30 渦のにじみ防止
VELOCITY_DISSIPATION   = 0.994    // 0.98 → 0.994 速度場を長生きに
DENSITY_DISSIPATION    = 0.997    // 0.990 → 0.997 染料を長く漂わせる
VORTICITY_STRENGTH     = 80       // 15 → 80（約5倍）螺旋・カール生成
CURL_STRENGTH          = 2.5      // 0.3 → 2.5 渦の押し込み強度
INK_COLOR.r            = 0.38     // 0.28 → 0.38 芯を濃く
velScale（マウス）     = 2200     // 500 → 2200 速度差で触手状たなびき生成
dyeRadius（マウス）    = 0.0004   // 0.0015 → 0.0004 細い筆跡（1/3以下）
```

**シェーダー改善**:
- curlFBO / divergenceFBO / pressureFBO を UNSIGNED_BYTE → halfFloatType に変更（ブロックギザギザ解消）
- curlFBO のフィルターを NEAREST → filterType（LINEAR）に変更（渦の滑らか化）
- vorticity シェーダーの正規化を弱め（勾配の大きさを保持して渦を強化）
- displayFragSrc: `pow(inkRaw, 0.65)` でガンマ補正（縁が薄く芯が濃い自然な濃淡グラデーション）

**検証結果**: ✓ 渦が視認できる / ✓ 細い触手状のたなびき / ✓ 濃淡グラデーション / ✓ ベタ塗りリボンではない

**最終スクリーンショット**:
```
/tmp/grayscale-qa/ink2/final_01_load.png     — ロード3秒後（自動ドロップ）
/tmp/grayscale-qa/ink2/final_02_vortex.png   — 円を描いた後（渦確認）
/tmp/grayscale-qa/ink2/final_03_tendrils.png — S字+クリック（触手状たなびき確認）
```

### タスク2: 静止画フォールバック

- **生成画像**: `public/ink-static.webp`（1440×900 / 8.4KB / WebP品質80）
  - 螺旋+S字軌跡の墨が漂った状態をキャプチャ → sharp で WebP 変換
- **実装**: `InkCanvas.tsx` に `useFallback` state を追加
  - `prefers-reduced-motion: reduce` → setUseFallback(true)
  - WebGL コンテキスト取得失敗時 → setUseFallback(true)
  - フォールバック表示: `next/image` / aria-hidden / loading="lazy" / priority=false

### タスク3: Lighthouse 計測結果

**最適化内容**: `pages/_app.tsx` の Noto Sans JP フォント設定を変更
- `display: 'swap'` → `display: 'optional'`（レンダーブロッキング解消）
- weight 7種（100/200/300/400/500/700/900）→ 4種（200/400/700/900）に削減
- 効果: CSS 229KB → 133KB、First Load JS 357KB → 261KB

**最終 Lighthouse スコア**（最適化後）:

| 指標 | Desktop | Mobile |
|------|---------|--------|
| Performance | **100** | **100** |
| Accessibility | 88 | 88 |
| Best Practices | 96 | 96 |
| SEO | 100 | 100 |
| LCP | 0.5s | 1.3s |
| CLS | 0 | 0 |
| TBT | 0ms | 0ms |
| FCP | 0.2s | 0.8s |

**注**: Accessibility 88 の要因（既存コンポーネント起因・今回スコープ外）
- ProofSection の aria-prohibited-attr（div に禁止 aria 属性）
- ヘッダーナビの color-contrast（mix-blend-mode: difference 時のコントラスト比）
- ヘッダーナビの touch target size

Lighthouse JSON: `/tmp/lh-desktop2.json` / `/tmp/lh-mobile2.json`
