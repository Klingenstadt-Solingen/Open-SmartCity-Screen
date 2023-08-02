import React from 'react'
import WeatherPanel from '../panels/WeatherPanel'

type setCenter = (panel: React.JSX.Element) => void

interface Props {
  setCenter: setCenter
}

export default function MapTile(props: Props): React.JSX.Element {
  return (
    <div className="w-full p-12 bg-solingen-yellow text-solingen-blue h-full">
      <div className="text-left text-6xl font-bold tracking-wide">
        Aktuelles
        <br />
        Wetter.
      </div>
      <div className="text-left text-xl museo-sans font-extralight text-black">
        Merianstr. (Rathaus)
      </div>
      <div id="weatherIcon" className="mx-auto mt-11"></div>
      <div id="textInWeatherTile_1" className="text-9xl mt-16 font-bold">
        <span className="museo-sans">23.9</span>
        <span className="font-thin text-6xl align-top">°C</span>
      </div>
      <div className="text-black museo-sans font-thin text-lg mt-2">aktualisiert am 26.07.2023</div>
      <button
        id="btnInWeatherTile"
        className="w-60 h-14 rounded-lg text-2xl mt-12 bg-solingen-blue text-white"
        onClick={() => props.setCenter(<WeatherPanel></WeatherPanel>)}
      >
        weitere Daten
      </button>
    </div>
  )
}
