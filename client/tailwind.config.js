// client/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2f8',
          100: '#b3d9e8',
          200: '#80c0d8',
          300: '#4da7c8',
          400: '#1a8eb8',
          500: '#156395',
          600: '#175f92',
          700: '#124a75',
          800: '#0e3658',
          900: '#0a223b',
        },
        secondary: {
          50: '#f0f9ed',
          100: '#d4f0c4',
          200: '#b8e79b',
          300: '#9cde72',
          400: '#80d549',
          500: '#56b234',
          600: '#44902a',
          700: '#336e20',
          800: '#224c16',
          900: '#112a0c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}