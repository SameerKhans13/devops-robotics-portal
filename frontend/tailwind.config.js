/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: {
          darkest: '#090d16',
          dark: '#0e1526',
          card: '#131b2e',
          cardHover: '#18233c',
          border: 'rgba(255, 255, 255, 0.08)',
          borderSubtle: 'rgba(255, 255, 255, 0.04)',
        },
        brand: {
          blue: '#38bdf8',
          cyan: '#06b6d4',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          violet: '#8b5cf6',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'card-subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
        'glow-blue': '0 0 20px -3px rgba(56, 189, 248, 0.25)',
      },
    },
  },
  plugins: [],
}
