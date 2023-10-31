import React from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../utils/dexie'

interface Props {
  isOnline: boolean
}
export default function Footer({ isOnline }: Props): React.JSX.Element {
  const weather = useLiveQuery(async () => {
    return await db.weather.toCollection().first()
  })

  if (typeof weather === 'undefined') {
    return <></>
  } else {
    const messages = [
      'Hochwassergefahr an der Wupper',
      'Wetter: ' + weather.values.lufttemperatur.value + weather.values.lufttemperatur.unit
    ]
    return (
      <div className="text-3xl font-normal w-screen border-t-2 border-primary-color flex items-center bg-background-color-dark z-0">
        <p className="w-full whitespace-nowrap flex gap-1">
          <span
            className="inline-block w-full"
            style={{ animation: 'scrolling-left1 24s linear infinite' }}
          >
            {isOnline ? `+++ ${messages.join(' +++ ')} +++` : '!!! Jetzt Offline !!!'}
          </span>

          <span
            className="inline-block w-full"
            style={{
              transform: 'translateX(calc(100vw))',
              animation: 'scrolling-left2 24s linear infinite',
              animationDelay: '6s'
            }}
          >
            {isOnline ? `+++ ${messages.join(' +++ ')} +++` : '!!! Jetzt Offline !!!'}
          </span>
        </p>
      </div>
    )
  }
}
