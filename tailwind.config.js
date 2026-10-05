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
          DEFAULT: '#f7f6f2',
          surface: '#eeede7',
          subtle: '#e7e5df',
          border: '#d8d6ce',
          darkBorder: '#b8b5ac',
        },
        ink: {
          DEFAULT: '#1c1917',
          muted: '#68645e',
          light: '#a8a29e',
        },
        crimson: {
          DEFAULT: '#881337',
          subtle: '#fff1f2',
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
        lg: '6px',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: '#1c1917',
            a: {
              color: '#881337',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              fontWeight: '500',
              '&:hover': {
                color: '#1c1917',
              },
            },
            strong: {
              color: '#1c1917',
              fontWeight: '600',
            },
            code: {
              color: '#1c1917',
              backgroundColor: '#eeede7',
              padding: '0.15rem 0.35rem',
              borderRadius: '2px',
              fontWeight: '500',
              border: '1px solid #d8d6ce',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            h1: {
              color: '#1c1917',
              fontFamily: '"Newsreader", Georgia, serif',
              fontWeight: '600',
              letterSpacing: '-0.01em',
            },
            h2: {
              color: '#1c1917',
              fontFamily: '"Newsreader", Georgia, serif',
              fontWeight: '600',
              letterSpacing: '-0.01em',
            },
            h3: {
              color: '#1c1917',
              fontFamily: '"Newsreader", Georgia, serif',
              fontWeight: '600',
            },
            blockquote: {
              borderColor: '#d8d6ce',
              borderWidth: '1px',
              color: '#57534e',
              backgroundColor: '#eeede7',
              padding: '1rem 1.25rem',
              borderRadius: '2px',
              fontStyle: 'normal',
            },
            hr: {
              borderColor: '#d8d6ce',
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
