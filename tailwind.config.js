/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cute: {
          bg: '#faf7f9',
          card: '#ffffff',
          cardSoft: '#fff5f7',
          cardLavender: '#fbf7ff',
          cardMint: '#f0fdf4',
          cardSky: '#f0f9ff',
          border: '#fbcfe8',
          borderSubtle: '#fdf2f8',
          borderAccent: '#f472b6',
          pink: '#f472b6',
          pinkDeep: '#ec4899',
          pinkLight: '#fdf2f8',
          lavender: '#c084fc',
          mint: '#34d399',
          sky: '#38bdf8',
          amber: '#fbbf24',
          rose: '#fb7185',
          textMain: '#1e1b4b',
          textMuted: '#64748b',
          textPink: '#db2777',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
        display: ['"Fredoka"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'cute-sm': '0 4px 15px -1px rgba(244, 114, 182, 0.12), 0 0 0 1px rgba(251, 207, 232, 0.8)',
        'cute-card': '0 12px 30px -4px rgba(244, 114, 182, 0.15), 0 0 0 1px rgba(251, 207, 232, 0.9)',
        'cute-glow': '0 0 25px -2px rgba(244, 114, 182, 0.35)',
        'cute-pill': '0 2px 8px 0 rgba(244, 114, 182, 0.18)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: '#334155',
            a: {
              color: '#db2777',
              textDecoration: 'none',
              fontWeight: '600',
              '&:hover': {
                color: '#be185d',
                textDecoration: 'underline',
              },
            },
            strong: {
              color: '#0f172a',
            },
            code: {
              color: '#db2777',
              backgroundColor: '#fdf2f8',
              padding: '0.2rem 0.4rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: '1px solid #fce7f3',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            h1: {
              color: '#1e1b4b',
              fontFamily: '"Fredoka", "Plus Jakarta Sans", sans-serif',
              fontWeight: '700',
            },
            h2: {
              color: '#1e1b4b',
              fontFamily: '"Fredoka", "Plus Jakarta Sans", sans-serif',
              fontWeight: '700',
            },
            h3: {
              color: '#1e1b4b',
              fontFamily: '"Fredoka", "Plus Jakarta Sans", sans-serif',
            },
            h4: {
              color: '#1e1b4b',
            },
            blockquote: {
              borderLeftColor: '#f472b6',
              borderLeftWidth: '4px',
              color: '#475569',
              backgroundColor: '#fff5f7',
              padding: '0.75rem 1.25rem',
              borderRadius: '0 1rem 1rem 0',
              fontStyle: 'normal',
            },
            hr: {
              borderColor: '#fce7f3',
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
