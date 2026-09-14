/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        rock: {
          bg: '#120a36',
          panel: '#170c49',
          panel2: '#0d2f61',
          border: 'rgba(95, 231, 255, 0.24)',
          gold: '#00b8ff',
          goldlight: '#5fe7ff',
          ember: '#ff4fa3',
          emberlight: '#ff8fc3',
          cream: '#ffffff',
          muted: 'rgba(255, 255, 255, 0.82)',
          yellow: '#ffd233',
          lime: '#b8ef00',
          violet: '#7d3cff',
          coral: '#ff7a30',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
        italic: ['"Playfair Display"', 'serif'],
      },
      backgroundImage: {
        'grad-gold': 'linear-gradient(120deg, #00b8ff 0%, #7d3cff 32%, #ff4fa3 64%, #ffd233 100%)',
        'grad-rainbow-soft': 'linear-gradient(135deg, rgba(0,184,255,0.28) 0%, rgba(125,60,255,0.22) 28%, rgba(255,79,163,0.24) 54%, rgba(255,210,51,0.24) 100%)',
        'hero-radial':
          'radial-gradient(circle at 18% 12%, rgba(255,79,163,0.28) 0%, transparent 44%), radial-gradient(circle at 84% 24%, rgba(0,184,255,0.28) 0%, transparent 48%), radial-gradient(circle at 52% 88%, rgba(255,210,51,0.24) 0%, transparent 44%), radial-gradient(circle at 66% 42%, rgba(125,60,255,0.22) 0%, transparent 40%)',
      },
    },
  },
  plugins: [],
}
