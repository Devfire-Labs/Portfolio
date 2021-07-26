module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        ptserif: ['PT Serif']
      },
      animation: {
        'spin-slow': 'spin 9s linear infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-9deg)' },
          '50%': { transform: 'rotate(9deg)' },
        }
      },
      colors: {
        ProtaBlack: '#333333'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
