import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: 'var(--accent)',
        surface: 'var(--surface)',
        gray: {
          600: 'var(--gray-600)',
          800: 'var(--gray-800)',
        },
        border: 'var(--border)',
      },
      fontFamily: {
        sans: ['General Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    typography,
  ],
}