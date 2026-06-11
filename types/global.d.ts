import type Lenis from 'lenis'

declare global {
  interface Window {
    /**
     * SmoothScroll.tsx が expose する Lenis インスタンス。
     * RenewalHeader / RenewalFooter 等のアンカースクロール（scrollTo）に使用する。
     */
    __lenis: Lenis | undefined
  }
}

export {}
