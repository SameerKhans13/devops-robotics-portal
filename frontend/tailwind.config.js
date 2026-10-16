/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: {
          darkest: '#f8fafc',
          dark: '#f1f5f9',
          card: '#ffffff',
          cardHover: '#f8fafc',
          border: '#e2e8f0',
          borderSubtle: '#f1f5f9',
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
