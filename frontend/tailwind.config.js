/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          beige: '#FCF8F5',
          orange: '#FF460D',
          yellow: '#FED400',
        },
        neutral: {
          gray: '#C7C9C4',
          darkGreen: '#344648',
          black: '#151515',
        }
      },
      fontFamily: {
        'neue': ['PP Neue Montreal', 'sans-serif'],
        'barlow': ['Barlow Semi Condensed', 'sans-serif'],
      },
      fontWeight: {
        'thin': '100',
        'book': '400',
        'bold': '700',
        'black': '900',
      },
      fontSize: {
        // Tamaños para combinaciones tipográficas según manual
        'hero-sm': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'hero-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'hero-lg': ['4rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'hero-xl': ['5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
      },
    },
  },
  plugins: [],
}
