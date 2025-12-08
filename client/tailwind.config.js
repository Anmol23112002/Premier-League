/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          green: '#84f973',
          red: '#ff3355'
        }
      },
      boxShadow: {
        'neon-green': '0 0 25px rgba(132, 249, 115, 0.7)'
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(132, 249, 115, 0.5)' },
          '50%': { boxShadow: '0 0 24px rgba(132, 249, 115, 1)' }
        }
      },
      animation: {
        glow: 'glow 1.8s ease-in-out infinite'
      }
    }
  },
  plugins: []
};


