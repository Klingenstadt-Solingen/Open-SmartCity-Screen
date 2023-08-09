import React from 'react'
import type { AppProps } from 'next/app'

import ApiComponent from '../common/renderless/ApiComponent'

import 'tailwindcss'
import '../styles/global.css'
import '../styles/fonts.css'

function App({ Component, pageProps }: AppProps) {
  return (
    <ApiComponent>
      <Component {...pageProps} />
    </ApiComponent>
  )
}

export default App
