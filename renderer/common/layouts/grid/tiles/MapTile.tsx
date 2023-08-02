import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'

type setCenter = (panel: React.JSX.Element) => void

interface Props {
  setCenter: setCenter
}

export default function MapTile(props: Props): React.JSX.Element {
  const Map = useMemo(
    () =>
      dynamic(() => import('../panels/MapPanel'), {
        ssr: false
      }),
    []
  )
  return (
    <div
      className="flex flex-col items-center text-6xl font-bold p-12 h-full
      w-full text-solingen-yellow bg-solingen-blue"
    >
      <div className="text-left w-full mb-20 tracking-wide">
        Solingen <br /> à la Carte!
      </div>
      <div id="mapIcon" className="mb-24"></div>
      <div
        id="textInMapTile_1"
        className="text-4xl text-white tracking-wide mb-20 museo-sans font-light"
      >
        Interessante Orte
        <br />
        in Solingen
      </div>
      <button
        className="w-60 h-14 rounded-lg text-2xl bg-solingen-yellow text-solingen-blue"
        onClick={() => props.setCenter(<Map></Map>)}
      >
        Jetzt entdecken
      </button>
    </div>
  )
}
