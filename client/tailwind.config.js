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
          950: '#060911',
          900: '#0B101D',
          850: '#0F172A',
          800: '#131C33',
          750: '#182441',
          700: '#1E2D4F',
          600: '#2C3E6B',
          500: '#475569',
        },
        brand: {
          cyan: '#06B6D4',
          electric: '#00E5FF',
          blue: '#3B82F6',
          indigo: '#6366F1',
        },
        risk: {
          low: '#10B981',
          'low-bg': 'rgba(16, 185, 129, 0.12)',
          moderate: '#F59E0B',
          'moderate-bg': 'rgba(245, 158, 11, 0.12)',
          high: '#EF4444',
          'high-bg': 'rgba(239, 68, 68, 0.12)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.3)',
        'glow-card': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
