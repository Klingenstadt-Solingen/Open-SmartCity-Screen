import { environment } from './environment'

export const content = [
  './renderer/pages/**/*.{js,ts,jsx,tsx}',
  './renderer/common/**/*.{js,ts,jsx,tsx}'
]
export const theme = {
  extend: {
    fontSize: {
      '6xl': ['4.3rem', '1.2']
    },
    colors: {
      'primary-color': environment.primaryColor || '#004373',
      'secondary-color': environment.secondaryColor || '#ffbf00',
      'tertiary-color': environment.tertiaryColor || 'green',
      'on-primary-color': environment.onPrimaryColor || '#FFFFFF',
      'on-secondary-color': environment.onSecondaryColor || '#000000',
      'background-color': environment.backgroundColor || '#FFFFFF',
      'on-background-color': environment.onBackgroundColor || '#000000',
      'background-color-dark': environment.backgroundColorDark || '#f2f2f2'
    },
    transitionDuration: {
      'app-speed': '600ms'
    },
    gridTemplateRows: {
      header: '6.5% 93.5%',
      footer: '96.5% 3.5%',
      headerFooter: '6.5% 90% 3.5%',
      full: '100vh'
    }
  }
}
export const plugins = []
