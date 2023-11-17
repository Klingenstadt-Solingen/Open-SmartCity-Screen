import { useLiveQuery } from 'dexie-react-hooks'
import React, { useEffect, useState } from 'react'
import { db } from '../../../utils/dexie'
import Clock from '../../icons/Clock'

export default function Header(): React.JSX.Element {
  const busStop = useLiveQuery(async () => {
    return db.stops.toCollection().first()
  })

  const [time, setTime] = useState(
    new Date().toLocaleTimeString('de-DE', {
      timeZone: 'Europe/Berlin',
      hour12: false,
      hour: 'numeric',
      minute: 'numeric'
    })
  )

  useEffect(() => {
    setInterval(() => {
      setTime(
        new Date().toLocaleTimeString('de-DE', {
          timeZone: 'Europe/Berlin',
          hour12: false,
          hour: 'numeric',
          minute: 'numeric'
        })
      )
    }, 3000)
  })

  if (typeof busStop === 'undefined') {
    return <></>
  } else {
    return (
      <div className="text-5xl text-left text-secondary-color font-bold bg-primary-color py-5">
        <img
          src="/images/busstop.png"
          className="absolute z-50 shadow-2xl rounded-full m-0 ml-20 w-40"
        ></img>
        <span className="ml-72">{busStop.name}</span>
        <span className="absolute text-on-primary-color font-light right-0 top-6 mr-20 flex items-center">
          {new Intl.DateTimeFormat('de-DE').format(new Date())}
          <div className="h-full mx-6">
            <Clock height="38" width="38"></Clock>
          </div>
          {time} Uhr
        </span>
      </div>
    )
  }
}
