module.exports = {
  content: ['./renderer/pages/**/*.{js,ts,jsx,tsx}', './renderer/common/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontSize: {
        '6xl': ['4.3rem', '1.2']
      },
      colors: {
        'solingen-yellow': '#ffbf00',
        'solingen-blue': '#004373',
        'solingen-grey': '#f2f2f2'
      },
      gridTemplateColumns: {
        '50/50': '1fr, 1fr'
      }
    }
  },
  plugins: []
}
