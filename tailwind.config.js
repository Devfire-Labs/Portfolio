module.exports = {
  mode: 'jit',
  purge: ['./public/index.html', './src/**/*.svelte'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      serif: ['PT Serif', 'serif'],
    },
    extend: {
      animation: {
        'spin-slow': 'spin 7s linear infinite',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
}
