export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF6F0', ivory: '#FFFDF9', blush: '#EBD3CF', rose: '#B0666F',
        sand: '#E9DCCB', cocoa: '#4E3A34', mocha: '#8A6F64',
      },
      fontFamily: { display: ['"Cormorant Garamond"', 'serif'], sans: ['Karla', 'system-ui', 'sans-serif'] },
      boxShadow: { soft: '0 6px 24px -10px rgba(78,58,52,.25)' },
    },
  },
  plugins: [],
}
