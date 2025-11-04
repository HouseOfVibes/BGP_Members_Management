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
        },
        // Status Color System
        'status': {
          'success': {
            DEFAULT: '#10B981', // green-500
            'light': '#D1FAE5', // green-100
            'dark': '#047857'   // green-700
          },
          'warning': {
            DEFAULT: '#F59E0B', // amber-500
            'light': '#FEF3C7', // amber-100
            'dark': '#D97706'   // amber-600
          },
          'error': {
            DEFAULT: '#EF4444', // red-500
            'light': '#FEE2E2', // red-100
            'dark': '#DC2626'   // red-600
          },
          'info': {
            DEFAULT: '#3B82F6', // blue-500
            'light': '#DBEAFE', // blue-100
            'dark': '#1D4ED8'   // blue-700
          },
          'pending': {
            DEFAULT: '#6B7280', // gray-500
            'light': '#F3F4F6', // gray-100
            'dark': '#374151'   // gray-700
          }
        },
        // Member Status Colors
        'member': {
          'active': '#10B981',      // green
          'pending': '#F59E0B',     // amber
          'inactive': '#6B7280',    // gray
          'suspended': '#EF4444'    // red
        },
        // Priority Colors
        'priority': {
          'high': '#DC2626',        // red-600
          'medium': '#F59E0B',      // amber-500
          'low': '#10B981',         // green-500
          'none': '#9CA3AF'         // gray-400
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