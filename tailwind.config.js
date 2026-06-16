/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* ── Grayscale Design Tokens ── */
        ink:    'var(--color-ink)',
        paper:  'var(--color-paper)',
        signal: 'var(--color-signal)',

        /* Grayscale step aliases */
        gs: {
          950: 'var(--color-gray-950)',
          900: 'var(--color-gray-900)',
          700: 'var(--color-gray-700)',
          500: 'var(--color-gray-500)',
          400: 'var(--color-gray-400)',
          200: 'var(--color-gray-200)',
          100: 'var(--color-gray-100)',
          50:  'var(--color-gray-50)',
        },

        /* Legacy neutral scale — kept for backward compat */
        gray: {
          50:  '#FAFAFA',
          100: '#E5E5E5',
          200: '#D4D4D4',
          300: '#B5B5B5',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A',
        },
      },

      fontFamily: {
        /* 新デザイン（Claude Design版） */
        mincho:  ['var(--font-mincho)', 'Zen Old Mincho', 'Hiragino Mincho ProN', 'serif'],
        kaku:    ['var(--font-kaku)', 'Zen Kaku Gothic New', 'Hiragino Kaku Gothic ProN', 'sans-serif'],
        grotesk: ['var(--font-grotesk)', 'Familjen Grotesk', 'sans-serif'],
        mono:    ['var(--font-mono-dc)', 'Space Mono', 'monospace'],
        /* 互換用エイリアス */
        sans:    ['var(--font-kaku)', 'Zen Kaku Gothic New', 'system-ui', 'sans-serif'],
        ja:      ['var(--font-kaku)', 'Zen Kaku Gothic New', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        /* Fluid scale via CSS custom properties */
        'fluid-hero':    ['var(--font-size-hero)',    { lineHeight: '0.95' }],
        'fluid-display': ['var(--font-size-display)', { lineHeight: '1.0'  }],
        'fluid-heading': ['var(--font-size-heading)', { lineHeight: '1.1'  }],
        'fluid-subhead': ['var(--font-size-subhead)', { lineHeight: '1.3'  }],
        'fluid-body':    ['var(--font-size-body)',    { lineHeight: '1.75' }],

        /* Static fallbacks */
        'xs':   ['0.75rem',   { lineHeight: '1.5'  }],
        'sm':   ['0.875rem',  { lineHeight: '1.5'  }],
        'base': ['1rem',      { lineHeight: '1.75' }],
        'lg':   ['1.125rem',  { lineHeight: '1.75' }],
        'xl':   ['1.25rem',   { lineHeight: '1.75' }],
        '2xl':  ['1.5rem',    { lineHeight: '2'    }],
        '3xl':  ['1.875rem',  { lineHeight: '2.25' }],
        '4xl':  ['2.25rem',   { lineHeight: '2.5'  }],
        '5xl':  ['3rem',      { lineHeight: '1.2'  }],
        '6xl':  ['3.75rem',   { lineHeight: '1.2'  }],
        '7xl':  ['4.5rem',    { lineHeight: '1.1'  }],
        '8xl':  ['6rem',      { lineHeight: '1.0'  }],
        '9xl':  ['8rem',      { lineHeight: '0.95' }],
        '10xl': ['11rem',     { lineHeight: '0.9'  }],
      },

      letterSpacing: {
        'ja-tight':  '-0.04em',
        'ja-snug':   '-0.03em',
        'ja-normal': '-0.02em',
      },

      spacing: {
        'section-sm': 'var(--spacing-section-sm)',
        'section-md': 'var(--spacing-section-md)',
        'section-lg': 'var(--spacing-section-lg)',
      },

      animation: {
        'fade-in':    'fadeIn 0.6s ease-out',
        'slide-up':   'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'zoom-in':    'zoomIn 0.5s ease-out',
        'float':      'float 6s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        slideDown: {
          '0%':   { transform: 'translateY(-24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',      opacity: '1' },
        },
        zoomIn: {
          '0%':   { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)'   },
          '50%':      { transform: 'translateY(-16px)' },
        },
      },

      backdropBlur: {
        xs: '2px',
      },

      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0,0,0,.07), 0 10px 20px -2px rgba(0,0,0,.04)',
        'dark': '0 10px 40px -15px rgba(0,0,0,.3)',
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
