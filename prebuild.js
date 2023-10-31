const prompt = require('prompt-sync')()
const fs = require('fs')

const primaryColor = prompt('What is your primary color? ')
const secondaryColor = prompt('What is your secondary color? ')
const onPrimaryColor = prompt('What is your on primary color? ')
const onSecondaryColor = prompt('What is your on secondary color? ')
const backgroundColor = prompt('What is your background color? ')
const backgroundColorDark = prompt('What is your darker background color? ')

const cityName = prompt('What is your city name? ')

const environment = {
  cityName: cityName,
  primaryColor: primaryColor,
  secondaryColor: secondaryColor,
  onPrimaryColor: onPrimaryColor,
  onSecondaryColor: onSecondaryColor,
  backgroundColor: backgroundColor,
  backgroundColorDark: backgroundColorDark
}

fs.writeFileSync(
  './renderer/environment.ts',
  'export const environment = ' + JSON.stringify(environment)
)
