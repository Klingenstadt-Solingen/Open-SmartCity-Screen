import React from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../utils/dexie'

export default function Footer(): React.JSX.Element {
  const weather = useLiveQuery(async () => {
    return db.weather.toCollection().first()
  })

  if (typeof weather === 'undefined') {
    return <></>
  } else {
    const messages = [
      'Wetter: ' + weather.values.lufttemperatur.value + weather.values.lufttemperatur.unit
    ]
    return (
      <div className="text-3xl font-normal w-screen border-t-2 border-primary-color flex items-center bg-background-color-dark z-0">
        <p className="w-full whitespace-nowrap flex gap-1">
          <span
            className="inline-block w-full"
            style={{ animation: 'scrolling-left1 24s linear infinite' }}
          >
            {`+++ ${messages.join(' +++ ')} +++`}
          </span>

          <span
            className="inline-block w-full"
            style={{
              transform: 'translateX(calc(100vw))',
              animation: 'scrolling-left2 24s linear infinite',
              animationDelay: '6s'
            }}
          >
            {`+++ ${messages.join(' +++ ')} +++`}
          </span>
        </p>
      </div>
    )
  }
}
