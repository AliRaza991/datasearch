/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        navy: {
          900: '#03142E',
          800: '#05224D',
          700: '#0D2F66',
        },
      },
      boxShadow: {
        card: '0 4px 20px rgba(0,0,0,0.04)',
        'card-hover': '0 12px 36px rgba(0,0,0,0.1)',
        hero: '0 10px 40px rgba(108,62,244,0.3)',
        nav: '0 2px 12px rgba(0,0,0,0.04)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
    },
  },
  plugins: [],
}
