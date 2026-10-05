/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ONE UNIFIED BACKGROUND FOR THE ENTIRE WEBSITE
        paper: {
          DEFAULT: '#faf7f2', // The single unified background everywhere
          surface: '#faf7f2', // Unified to exact same color
          subtle: '#faf7f2',  // Unified to exact same color
          blush: '#faf7f2',   // Unified to exact same color
          border: '#ddd3c4',  // Clean 1px hairline border
          blushBorder: '#ddd3c4',
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
          soft: '#faf7f2',  // Unified
          subtle: '#faf7f2', // Unified
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
              backgroundColor: '#faf7f2',
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
              backgroundColor: '#faf7f2',
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
