/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Syne"', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#0a0a0f',
          900: '#0f0f18',
          800: '#16161f',
          700: '#1e1e2a',
          600: '#2a2a38',
          500: '#3a3a4f',
          400: '#5a5a75',
          300: '#8888a0',
          200: '#b0b0c8',
          100: '#d8d8e8',
          50:  '#f0f0f6',
        },
        accent: {
          DEFAULT: '#7c6af7',
          hover: '#6b59e8',
          light: '#a89df8',
          glow: 'rgba(124, 106, 247, 0.15)',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}

