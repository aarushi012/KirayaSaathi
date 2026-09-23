/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#121D33',
          surface: '#17243B',
          card: '#1B2942',
          inner: '#202F49',
          border: 'rgba(130, 150, 190, 0.18)',
          'border-subtle': 'rgba(130, 150, 190, 0.12)',
          'border-strong': 'rgba(130, 150, 190, 0.28)',
          heading: '#F8FAFC',
          text: '#E2E8F0',
          secondary: '#B8C4D6',
          muted: '#8FA0B8',
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
