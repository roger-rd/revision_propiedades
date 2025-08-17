/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: '#0735cdd7',
        secondary: '#0721cb',
        accent: '#f6f7f9',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px #14b8a6' },
          '50%': { boxShadow: '0 0 20px #0f766e' },
        },
      },
    },
  },
  plugins: [],
}

