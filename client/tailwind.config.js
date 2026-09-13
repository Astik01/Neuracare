/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Sora"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#effcf9',
          100: '#c7f5ea',
          200: '#96ead9',
          300: '#5fd8c3',
          400: '#33bfab',
          500: '#199e8e',
          600: '#0f7d73',
          700: '#0f625d',
          800: '#124e4c',
          900: '#124240',
        },
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgb(15 98 93 / 0.08), 0 8px 24px -8px rgb(15 98 93 / 0.12)',
        card: '0 1px 2px rgb(15 23 42 / 0.04), 0 1px 3px rgb(15 23 42 / 0.06)',
        glow: '0 0 0 1px rgb(15 98 93 / 0.06), 0 20px 40px -12px rgb(15 98 93 / 0.25)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};
