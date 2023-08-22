import React from 'react'
import WeatherPanel from '../panels/WeatherPanel'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../../utils/dexie'

type setCenter = (panel: React.JSX.Element) => void

interface Props {
  isOpen: boolean
  tilePos: number
  setCenter: setCenter
}

export default function MapTile(props: Props): React.JSX.Element {
  const weather = useLiveQuery(async () => {
    return await db.weather.toCollection().first()
  })
  if (typeof weather === 'undefined') {
    return <></>
  } else {
    return (
      <div className="w-full p-12 bg-solingen-yellow text-solingen-blue h-full overflow-hidden">
        <div className="text-left text-6xl font-bold tracking-wide">
          Aktuelles
          <br />
          Wetter.
        </div>
        <div
          className="transition-opacity duration-solingen-speed"
          style={props.isOpen ? { opacity: 0 } : { opacity: 1 }}
        >
          <div className="text-left text-xl font-extralight text-black">{weather.shortName}</div>

          <div
            style={{ backgroundImage: 'url("/images/svg/weather.svg")', backgroundSize: '80%' }}
            className="mx-auto mt-9 w-56 h-56 rounded-full bg-white bg-center bg-no-repeat"
          ></div>

          <div className="text-9xl mt-10 font-bold">
            <span>{weather.values?.lufttemperatur?.value}</span>
            <span className="font-thin text-6xl align-top">
              {weather.values?.lufttemperatur?.unit}
            </span>
          </div>

          <div className="text-black font-thin text-lg mt-2">
            aktualisiert am {new Intl.DateTimeFormat('de-DE').format(weather.dateObserved)}
          </div>

          <button
            id="btnInWeatherTile"
            className="w-60 h-14 rounded-lg text-2xl mt-10 bg-solingen-blue text-white"
            onClick={() => props.setCenter(<WeatherPanel weather={weather}></WeatherPanel>)}
          >
            weitere Daten
          </button>
        </div>
      </div>
    )
  }
}
