/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neonBlue: '#00D4FF',
        neonCyan: '#00F5FF',
        neonPurple: '#7F5AF0',
        midnight: '#060711'
      },
      boxShadow: {
        glow: '0 0 24px rgba(0, 212, 255, 0.45)'
      },
      backdropBlur: {
        glass: '18px'
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite',
        gradientShift: 'gradientShift 10s ease infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 16px rgba(0,212,255,0.2)' },
          '50%': { boxShadow: '0 0 34px rgba(127,90,240,0.5)' }
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      }
    }
  },
  plugins: []
};
