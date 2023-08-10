import React from 'react'
import WeatherPanel from '../panels/WeatherPanel'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../../utils/dexie'

type setCenter = (panel: React.JSX.Element) => void

interface Props {
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
      <div className="w-full p-12 bg-solingen-yellow text-solingen-blue h-full">
        <div className="text-left text-6xl font-bold tracking-wide">
          Aktuelles
          <br />
          Wetter.
        </div>
        <div className="text-left text-xl museo-sans font-extralight text-black">
          {weather.shortName}
        </div>
        <div
          style={{ backgroundImage: 'url("/images/svg/weather.svg")', backgroundSize: '80%' }}
          className="mx-auto mt-11 w-[12vh] h-[12vh] rounded-full bg-white bg-center bg-no-repeat"
        ></div>
        <div className="text-9xl mt-16 font-bold">
          <span className="museo-sans">{weather.values?.lufttemperatur?.value}</span>
          <span className="font-thin text-6xl align-top">
            {weather.values?.lufttemperatur?.unit}
          </span>
        </div>
        <div className="text-black museo-sans font-thin text-lg mt-2">
          aktualisiert am {new Intl.DateTimeFormat('de-DE').format(weather.dateObserved)}
        </div>
        <button
          id="btnInWeatherTile"
          className="w-60 h-14 rounded-lg text-2xl mt-12 bg-solingen-blue text-white"
          onClick={() => props.setCenter(<WeatherPanel weather={weather}></WeatherPanel>)}
        >
          weitere Daten
        </button>
      </div>
    )
  }
}
