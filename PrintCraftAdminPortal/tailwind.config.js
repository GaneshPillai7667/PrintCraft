/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#2563eb',
        accent: '#6366f1',
        highlight: '#0ea5e9',
      },
      boxShadow: {
        soft: '0 12px 35px rgba(15, 23, 42, 0.08)',
        glow: '0 0 24px rgba(37, 99, 235, 0.35)',
      },
      backdropBlur: {
        glass: '18px',
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
        gradientShift: 'gradientShift 10s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 16px rgba(37,99,235,0.2)' },
          '50%': { boxShadow: '0 0 34px rgba(99,102,241,0.5)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
