/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        rock: {
          bg: '#fff8ef',
          panel: '#ffffff',
          panel2: '#fff4fb',
          border: 'rgba(255, 111, 181, 0.2)',
          gold: '#00c2ff',
          goldlight: '#7ce8ff',
          ember: '#ff6fb5',
          emberlight: '#ff9fce',
          cream: '#5b2b86',
          muted: 'rgba(91, 88, 114, 0.88)',
          yellow: '#ffd84d',
          lime: '#c4f000',
          violet: '#8c52ff',
          coral: '#ff8a5b',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
        italic: ['"Playfair Display"', 'serif'],
      },
      backgroundImage: {
        'grad-gold': 'linear-gradient(120deg, #00c2ff 0%, #8c52ff 35%, #ff6fb5 65%, #ffd84d 100%)',
        'grad-rainbow-soft': 'linear-gradient(135deg, rgba(0,194,255,0.18) 0%, rgba(140,82,255,0.14) 28%, rgba(255,111,181,0.18) 54%, rgba(255,216,77,0.2) 100%)',
        'hero-radial':
          'radial-gradient(circle at 18% 12%, rgba(255,111,181,0.22) 0%, transparent 44%), radial-gradient(circle at 84% 24%, rgba(0,194,255,0.22) 0%, transparent 48%), radial-gradient(circle at 52% 88%, rgba(255,216,77,0.18) 0%, transparent 44%), radial-gradient(circle at 66% 42%, rgba(140,82,255,0.14) 0%, transparent 40%)',
      },
    },
  },
  plugins: [],
}
