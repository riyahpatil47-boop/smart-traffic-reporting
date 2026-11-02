/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef2f8',
          100: '#d5ddee',
          200: '#aabbd9',
          300: '#7f94c2',
          400: '#5a72ac',
          500: '#3b528f',
          600: '#2c3e75',
          700: '#223159',
          800: '#192542',
          900: '#101a30',
          950: '#0a1122',
        },
        traffic: {
          50: '#fff5ed',
          100: '#ffe8d4',
          200: '#ffcea8',
          300: '#ffac70',
          400: '#ff8437',
          500: '#fb6511',
          600: '#ec4f06',
          700: '#c43a08',
          800: '#9c2f0f',
          900: '#7e2910',
          950: '#451206',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(16 26 48 / 0.08), 0 1px 2px -1px rgb(16 26 48 / 0.06)',
        'card-hover': '0 8px 24px -6px rgb(16 26 48 / 0.12), 0 2px 6px -2px rgb(16 26 48 / 0.08)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out',
        'scale-in': 'scale-in 0.18s ease-out',
        'slide-in': 'slide-in 0.25s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
