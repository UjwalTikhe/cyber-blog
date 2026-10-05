/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#07090e',
          surface: '#0d111a',
          card: '#111726',
          cardHover: '#161f33',
          border: '#1f293d',
          borderSubtle: '#172033',
          borderAccent: '#334155',
          emerald: '#10b981',
          emeraldGlow: 'rgba(16, 185, 129, 0.15)',
          cyan: '#06b6d4',
          cyanGlow: 'rgba(6, 182, 212, 0.15)',
          amber: '#f59e0b',
          rose: '#f43f5e',
          purple: '#a855f7',
          muted: '#64748b',
          textMuted: '#94a3b8',
          textMain: '#f1f5f9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'cyber-sm': '0 2px 8px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(31, 41, 61, 0.8)',
        'cyber-md': '0 8px 24px -4px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(31, 41, 61, 0.9)',
        'cyber-glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
        'cyber-glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.25)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: '#cbd5e1',
            a: {
              color: '#10b981',
              '&:hover': {
                color: '#34d399',
              },
            },
            strong: {
              color: '#f8fafc',
            },
            code: {
              color: '#38bdf8',
              backgroundColor: '#111726',
              padding: '0.2rem 0.4rem',
              borderRadius: '0.25rem',
              fontWeight: '500',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            h1: {
              color: '#f8fafc',
              fontFamily: '"Space Grotesk", sans-serif',
            },
            h2: {
              color: '#f8fafc',
              fontFamily: '"Space Grotesk", sans-serif',
            },
            h3: {
              color: '#f8fafc',
            },
            h4: {
              color: '#f8fafc',
            },
            blockquote: {
              borderLeftColor: '#10b981',
              color: '#94a3b8',
              backgroundColor: 'rgba(16, 185, 129, 0.04)',
              padding: '0.75rem 1.25rem',
              borderRadius: '0 0.5rem 0.5rem 0',
            },
            hr: {
              borderColor: '#1f293d',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
