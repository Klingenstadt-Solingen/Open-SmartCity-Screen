import React from 'react'

type showSomething = (msg: string) => void

interface Props {
  showSomething: showSomething
}

export default function MapTile(props: Props): React.JSX.Element {
  return (
    <>
      <div id="weatherTileContainer" className="text-5xl font-bold p-8">
        <div className="text-left">
          Aktuelles
          <br />
          Wetter.
        </div>
        <div className="text-sm text-left pt-2 pl-2">XXXX Straße 1</div>
        <div id="weatherIcon"></div>
        <div id="textInWeatherTile_1" className="text-7xl mt-4">
          11.9
        </div>
        <div className="text-sm pt-2 pl-2">Aktualisiert am xxxxx</div>
        <button
          id="btnInWeatherTile"
          className="text-base w-40 h-10 rounded-lg mt-8"
          onClick={() => props.showSomething('4')}
        >
          weitere Daten
        </button>
      </div>
    </>
  )
}
