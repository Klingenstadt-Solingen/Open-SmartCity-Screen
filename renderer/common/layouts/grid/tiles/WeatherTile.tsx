import React from 'react'
import WeatherPanel from '../panels/WeatherPanel'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../../utils/dexie'
import Weather from '../../../icons/Weather'

type setCenter = (panel: React.JSX.Element) => void

interface Props {
  isOpen: boolean
  tilePos: number
  setCenter: setCenter
  accessabilityCode: number
  config?: any
}

export default function WeatherTile(props: Props): React.JSX.Element {
  let cssForTitle: React.CSSProperties = {}
  if (props.isOpen) {
    if (props.tilePos < 3) {
      switch (props.accessabilityCode) {
        case 0:
          cssForTitle = {}
          break
        case 1:
          cssForTitle = { opacity: 0 }
          break
        case 2:
          cssForTitle = { position: 'absolute', bottom: '4.4rem', marginBottom: '0' }
          break
      }
    } else {
      switch (props.accessabilityCode) {
        case 0:
          cssForTitle = {}
          break
        case 1:
          cssForTitle = {}
          break
        case 2:
          cssForTitle = { opacity: 0 }
          break
      }
    }
  }

  const weather = useLiveQuery(async () => {
    return db.weather.toCollection().first()
  })
  if (typeof weather === 'undefined') {
    return <></>
  } else {
    return (
      <div className="w-full p-12 bg-secondary-color text-primary-color h-full overflow-hidden">
        <div className="text-left text-6xl font-bold tracking-wide" style={cssForTitle}>
          Aktuelles
          <br />
          Wetter.
        </div>
        <div
          className="transition-opacity duration-app-speed"
          style={props.isOpen ? { opacity: 0 } : { opacity: 1 }}
        >
          <div className="text-left text-xl font-extralight text-on-secondary-color">
            {weather.shortName}
          </div>

          <div className="mx-auto mt-9 w-56 h-56 rounded-full bg-white flex justify-center items-center">
            <Weather width="100%" height="60%" />
          </div>

          <div className="text-9xl mt-10 font-bold">
            <span>{weather.values?.lufttemperatur?.value.toFixed(1)}</span>
            <span className="font-thin text-6xl align-top">
              {weather.values?.lufttemperatur?.unit}
            </span>
          </div>

          <div className="text-on-secondary-color font-thin text-lg mt-2">
            aktualisiert am{' '}
            {new Intl.DateTimeFormat('de-DE').format(new Date(weather.dateObserved?.iso))}
          </div>

          <button
            id="btnInWeatherTile"
            className="w-60 h-14 rounded-lg text-2xl mt-10 bg-primary-color text-on-primary-color"
            onMouseDown={() => props.setCenter(<WeatherPanel weather={weather} />)}
          >
            weitere Daten
          </button>
        </div>
      </div>
    )
  }
}
