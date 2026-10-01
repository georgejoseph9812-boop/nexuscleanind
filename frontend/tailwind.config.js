/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // fresh green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d', // deep forest green
          950: '#052e16',
        },
        primary: {
          DEFAULT: '#0F5132', // deep green
          hover: '#0A3B24',
          light: '#E8F5E9',
          dark: '#082F1D',
        },
        secondary: {
          DEFAULT: '#10B981', // fresh mint green
          hover: '#059669',
          light: '#D1FAE5',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
          dark: '#B45309',
        },
        critical: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
          dark: '#B91C1C',
        },
        charcoal: {
          DEFAULT: '#0F172A',
          muted: '#64748B',
          soft: '#334155',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
        'soft': '0 4px 12px -2px rgba(0,0,0,0.06), 0 2px 6px -1px rgba(0,0,0,0.04)',
        'soft-md': '0 8px 24px -4px rgba(0,0,0,0.08), 0 4px 10px -2px rgba(0,0,0,0.04)',
        'soft-lg': '0 14px 34px -6px rgba(0,0,0,0.1), 0 6px 14px -3px rgba(0,0,0,0.05)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
