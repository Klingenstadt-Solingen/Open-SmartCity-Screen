import React from 'react'

type showSomething = (msg: string) => void

interface Props {
  showSomething: showSomething
}

export default function MapTile(props: Props): React.JSX.Element {
  return (
    <>
      <div id="mapTileContainer" className="text-6xl font-bold p-12">
        <div className="text-left mb-20 tracking-wide">Solingen à la Carte!</div>
        <div id="mapIcon" className="mx-auto mb-24"></div>
        <div id="textInMapTile_1" className="text-4xl text-white tracking-wide mb-16 museo-sans font-light">
          Interessante Orte
          <br />
          in Solingen
        </div>
        <button id="btnInMapTile" className="w-60 h-14 rounded-lg text-2xl" onClick={() => props.showSomething('1')}>
          Jetzt entdecken
        </button>
      </div>
    </>
  )
}
