import React, { useEffect } from 'react'
import type { AppProps } from 'next/app'

import ApiComponent from '../common/renderless/ApiComponent'
import { init } from '@socialgouv/matomo-next'

const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID

import 'tailwindcss'
import '../styles/global.css'
import '../styles/fonts.css'

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    init({ url: MATOMO_URL, siteId: MATOMO_SITE_ID })
  }, [])

  return (
    <ApiComponent>
      <Component {...pageProps} />
    </ApiComponent>
  )
}

export default App
