/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      xs: '350px',
      sm: '512px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    fontFamily: {
      sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      display: ['Poppins', 'Space Grotesk', 'system-ui', 'sans-serif'],
      body: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      code: ['JetBrains Mono', 'Consolas', 'monospace'],
      poppins: ['Poppins', 'sans-serif'],
      inter: ['Inter', 'sans-serif'],
    },
    colors: {
      white: '#ffffff',
      black: '#000000',
      gray1: '#f8f8f8',
      gray2: '#dbe1e8',
      gray3: '#b2becd',
      gray4: '#6c7983',
      gray5: '#454e56',
      gray6: '#2a2e35',
      gray7: '#12181b',
      link: '#2563eb',        // improved link contrast
      blue: colors.blue,
      green: colors.green,
      pink: colors.pink,
      purple: colors.purple,
      orange: colors.orange,
      red: colors.red,
      yellow: colors.yellow,
    },
    extend: {
      colors: {
        /* WCAG-friendly gray scale for dark mode */
        gray: {
          900: '#0f172a',   // slate-900
          800: '#1e293b',   // slate-800
          700: '#334155',   // slate-700
          600: '#475569',   // slate-600
          500: '#94a3b8',   // slate-400 (body text)
          400: '#cbd5e1',   // slate-300
          300: '#e2e8f0',   // slate-200
          200: '#f1f5f9',   // slate-100
          100: '#f8fafc',   // near white
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#111827', // gray-900
            h1: { color: '#111827' },
            h2: { color: '#111827' },
            h3: { color: '#111827' },
            p: { color: '#374151' }, // gray-700
          },
        },
        dark: {
          css: {
            color: '#e5e7eb', // gray-200
            h1: { color: '#f9fafb' },
            h2: { color: '#f3f4f6' },
            h3: { color: '#e5e7eb' },
            p: { color: '#d1d5db' }, // gray-300
          },
        },
      },
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ]
};
