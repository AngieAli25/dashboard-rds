/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF7FF',
          100: '#D9EDFF',
          200: '#BCE2FF',
          300: '#8ED2FF',
          400: '#59B8FF',
          500: '#247DFF', // Primary color
          600: '#0F62FE',
          700: '#0B4FEB',
          800: '#1041BE',
          900: '#143D95',
          950: '#11275A',
        },
        accent: {
          50: '#FEF4E7',
          100: '#FCE6C1',
          200: '#F9CC86',
          300: '#F6AD41',
          400: '#F59532', // Accent color
          500: '#EF7918',
          600: '#D55D0E',
          700: '#B14210',
          800: '#903414',
          900: '#762C14',
          950: '#421407',
        },
        gray: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}