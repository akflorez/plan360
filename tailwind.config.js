/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f4f6fa',
          100: '#e5ebf5',
          200: '#ccd9ea',
          300: '#a3be3a',
          400: '#739bcd',
          500: '#507eb2',
          600: '#3e6597',
          700: '#33527b',
          800: '#0B1B3D', // Deep Blue
          900: '#08142e',
          950: '#050c1c',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Emerald Green
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        aqua: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#8b5cf6', // Soft Purple
          600: '#7c3aed',
          700: '#6d28d9',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 4px 20px -2px rgba(11, 27, 61, 0.05), 0 2px 8px -1px rgba(11, 27, 61, 0.03)',
        premiumHover: '0 12px 30px -4px rgba(11, 27, 61, 0.1), 0 4px 12px -2px rgba(11, 27, 61, 0.05)',
        glass: '0 8px 32px 0 rgba(11, 27, 61, 0.06)',
      }
    },
  },
  plugins: [],
}
