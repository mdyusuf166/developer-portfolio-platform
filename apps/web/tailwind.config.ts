import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        'muted-foreground': 'rgb(var(--muted-foreground) / <alpha-value>)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        destructive: 'rgb(var(--destructive) / <alpha-value>)'
      },
      boxShadow: {
        soft: '0 22px 50px rgba(15, 23, 42, 0.12)',
        glow: '0 0 0 1px rgba(14, 165, 233, 0.1), 0 18px 40px rgba(14, 165, 233, 0.18)'
      },
      borderRadius: {
        xl: '1.25rem',
        '2xl': '1.5rem'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"SFMono-Regular"', 'ui-monospace', 'monospace']
      }
    }
  },
  plugins: []
} satisfies Config;
