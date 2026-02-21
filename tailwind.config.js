/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Sora"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#0B0F1A',
          900: '#0F172A',
          850: '#111827',
          800: '#121A2B',
          700: '#1F2937',
          600: '#273449',
        },
        electric: {
          400: '#4CC9F0',
          500: '#3A86FF',
          600: '#2C6BFF',
        },
        live: {
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
        },
        positive: {
          500: '#22C55E',
        },
        danger: {
          500: '#EF4444',
        },
        field: '#0C1424',
        glow: '#1C263D',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(76,201,240,0.12), 0 18px 60px rgba(8,12,24,0.7)',
        glass: '0 14px 40px rgba(5,8,16,0.7)',
        lift: '0 20px 40px rgba(3,7,18,0.6)',
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at 15% 20%, rgba(58,134,255,0.2), transparent 55%), radial-gradient(circle at 80% 10%, rgba(249,115,22,0.22), transparent 50%), radial-gradient(circle at 50% 80%, rgba(76,201,240,0.18), transparent 60%)',
        'section-gradient':
          'linear-gradient(135deg, rgba(17,24,39,0.9), rgba(15,23,42,0.7))',
      },
    },
  },
  plugins: [],
}
