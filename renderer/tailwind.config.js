module.exports = {
  content: ['./renderer/pages/**/*.{js,ts,jsx,tsx}', './renderer/common/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '1px',
      md: '1600px',
      lg: '1920px'
    },
    extend: {
      fontSize: {
        '6xl': ['4.3rem', '1.2']
      },
      colors: {
        'solingen-yellow': '#ffbf00',
        'solingen-blue': '#004373',
        'solingen-grey': '#f2f2f2'
      },
      transitionDuration: {
        'solingen-speed': '600ms'
      },
      gridTemplateRows: {
        base: '6.5% 90% 3.5%'
      }
    }
  },
  plugins: []
}
