import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}'
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        navy:    'var(--color-navy)',
        primary: 'var(--color-primary)',
        orange:  'var(--color-orange)',
        teal:    'var(--color-teal)',
        purple:  'var(--color-purple)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error:   'var(--color-error)',
        'text-primary':   'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted':     'var(--color-text-muted)',
        surface:         'var(--color-surface)',
        'surface-raised': 'var(--color-surface-raised)',
        border:          'var(--color-border)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        'xs':   'var(--radius-xs)',
        DEFAULT: 'var(--radius-md)',
        'md':   'var(--radius-md)',
        'lg':   'var(--radius-lg)',
        'xl':   'var(--radius-xl)',
        'pill': 'var(--radius-pill)',
      },
      boxShadow: {
        'xs':    'var(--shadow-xs)',
        'sm':    'var(--shadow-sm)',
        'md':    'var(--shadow-md)',
        'lg':    'var(--shadow-lg)',
        'xl':    'var(--shadow-xl)',
        'focus': 'var(--shadow-focus)',
      },
      transitionDuration: {
        'fast':   '100ms',
        'normal': '150ms',
        'slow':   '250ms',
        'slower': '400ms',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config
