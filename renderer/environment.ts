export const environment = {
  cityName: 'Solingen',
  primaryColor: '#004373',
  secondaryColor: null,
  onPrimaryColor: null,
  onSecondaryColor: null,
  backgroundColor: null,
  backgroundColorDark: null,
  // parseUrl: 'http://localhost:1337/parse',
  // parseAppId: '***REMOVED***',
  // parseClientKey: 'myclientkey',
  // parseJavascriptKey: '***REMOVED***',

  parseUrl: process.env.NEXT_PUBLIC_PARSE_URL,
  parseAppId: process.env.NEXT_PUBLIC_PARSE_APP_ID,
  parseJavascriptKey: process.env.NEXT_PUBLIC_PARSE_JAVASCRIPT_KEY,
  parseUsername: process.env.NEXT_PUBLIC_PARSE_USERNAME,
  parsePassword: process.env.NEXT_PUBLIC_PARSE_PASSWORD,
  parseMasterKey: process.env.NEXT_PUBLIC_PARSE_MASTERKEY,

  screenshotDir: '/home/kiosk/screenshots'
}
