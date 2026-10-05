/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#faf7f2', // Warm porcelain ivory
          surface: '#f4ede4', // Soft linen alabaster
          subtle: '#ebe2d5', // Delicate warm taupe
          blush: '#fbf5f2', // Gentle whisper of rose-linen
          border: '#ddd3c4', // Refined hairline border
          blushBorder: '#e8d5ce', // Delicate soft rose-taupe border
          darkBorder: '#bfb3a2',
        },
        ink: {
          DEFAULT: '#221e1f', // Deep warm espresso charcoal ink
          muted: '#69605d', // Soft warm graphite
          light: '#9d938f',
        },
        crimson: {
          DEFAULT: '#8b263e', // Deep velvet rosewood / antique crimson
          muted: '#a33d54', // Muted dusty rose accent
          soft: '#f7ebed', // Delicate blush background
          subtle: '#fdf7f8',
        }
      },
      fontFamily: {
        serif: ['"Newsreader"', 'Georgia', 'Cambria', 'serif'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        none: 'none',
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '2px',
        md: '4px',
        lg: '4px',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: '#221e1f',
            a: {
              color: '#8b263e',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              fontWeight: '500',
              '&:hover': {
                color: '#221e1f',
              },
            },
            strong: {
              color: '#221e1f',
              fontWeight: '600',
            },
            code: {
              color: '#221e1f',
              backgroundColor: '#f4ede4',
              padding: '0.15rem 0.35rem',
              borderRadius: '2px',
              fontWeight: '500',
              border: '1px solid #ddd3c4',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            h1: {
              color: '#221e1f',
              fontFamily: '"Newsreader", Georgia, serif',
              fontWeight: '600',
              letterSpacing: '-0.01em',
            },
            h2: {
              color: '#221e1f',
              fontFamily: '"Newsreader", Georgia, serif',
              fontWeight: '600',
              letterSpacing: '-0.01em',
            },
            h3: {
              color: '#221e1f',
              fontFamily: '"Newsreader", Georgia, serif',
              fontWeight: '600',
            },
            blockquote: {
              borderColor: '#ddd3c4',
              borderWidth: '1px',
              color: '#554e4c',
              backgroundColor: '#fbf5f2',
              padding: '1rem 1.25rem',
              borderRadius: '2px',
              fontStyle: 'normal',
            },
            hr: {
              borderColor: '#ddd3c4',
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
