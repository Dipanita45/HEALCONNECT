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
      'xs': '350px',
      'sm': '512px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    fontFamily: {
      sans: ['sofia-pro', 'sans-serif'],
      display: ['cubano', 'sans-serif'],
      body: ['sofia-pro', 'sans-serif'],
      code: ['attribute-mono', 'sans-serif'],
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
      link: '#0000ee',
      blue: colors.blue,
      green: colors.green,
      pink: colors.pink,
      purple: colors.purple,
      orange: colors.orange,
      red: colors.red,
      yellow: colors.yellow,
    },
    extend: {
      colors:{
        gray: {
          900: '#202225',
          800: '#2f3136',
          700: '#36393f',
          600: '#4f545c',
          500: '#6B7280',
          400: '#d4d7dc',
          300: '#e3e5e8',
          200: '#ebedef',
          100: '#f2f3f5',
        },
      },
      typography: {
        DEFAULT: {
          scss: {
            h1: {
              'font-weight': 'normal',
              'font-size': '1.75rem',
            },
            h2: {
              'font-weight': 'normal',
              'font-size': '1.50rem',
            },
            h3: {
              'font-weight': 'normal',
              'font-size': '1.25rem',
            },
            h4: {
              'font-weight': 'normal',
              'font-size': '1rem',
            },
            h5: {
              'font-weight': 'normal',
              'font-size': '0.75rem',
            }
          },
        },
      },
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ]
};
