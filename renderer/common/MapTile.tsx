import React from 'react'

type showSomething = (msg: string) => void

interface Props {
  showSomething: showSomething
}

export default function MapTile(props: Props): React.JSX.Element {
  return (
    <>
      <div id="mapTileContainer" className="text-5xl font-bold p-4">
        <div className="text-left">
          Solingen
          <br />à la Carte!
        </div>
        <div id="mapIcon"></div>
        <div id="textInMapTile_1" className="text-3xl text-white mt-5">
          Interessante Orte in Solingen
        </div>
        <button
          id="btnInMapTile"
          className="text-base w-40 h-10 rounded-lg mt-8"
          onClick={() => props.showSomething('1')}
        >
          Jetzt entdecken
        </button>
      </div>
    </>
  )
}
