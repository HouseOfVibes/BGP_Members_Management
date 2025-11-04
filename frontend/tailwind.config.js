/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // BGP Brand Colors
        'bgp': {
          'dark': '#212121',
          'darker': '#1a1a1a',
          'gold': {
            DEFAULT: '#9c8040',
            'hover': '#b59448',
            'active': '#8a6f37'
          },
          'teal': {
            DEFAULT: '#009688',
            'hover': '#00796b'
          },
          'gray': {
            'light': '#f5f5f5',
            'medium': '#cccccc',
            'dark': '#666666'
          }
        }
      },
      fontFamily: {
        'sans': ['Inter', 'Arial', 'sans-serif'],
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
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}