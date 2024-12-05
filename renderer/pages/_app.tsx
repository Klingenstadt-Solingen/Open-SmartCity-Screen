import React, { useEffect } from 'react'
import type { AppProps } from 'next/app'

import ApiComponent from '../common/renderless/ApiComponent'
import { init as initMatomo } from '@socialgouv/matomo-next'

const MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL
const MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID

import 'tailwindcss'
import '../styles/global.css'
import '../styles/fonts.css'

import * as Sentry from '@sentry/react'

const replayIntegration = Sentry.replayIntegration()
const replayCanvasIntegration = Sentry.replayCanvasIntegration()

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        integrations: [
          Sentry.browserTracingIntegration(),
          replayIntegration,
          replayCanvasIntegration,
          Sentry.browserProfilingIntegration(),
          Sentry.extraErrorDataIntegration()
        ],
        tracesSampleRate: 1.0, //0.5,
        replaysSessionSampleRate: 1.0, // 0.1,
        replaysOnErrorSampleRate: 1.0
      })
    }
    initMatomo({ url: MATOMO_URL, siteId: MATOMO_SITE_ID })
  }, [])

  return (
    <ApiComponent>
      <Component {...pageProps} />
    </ApiComponent>
  )
}

export default App
