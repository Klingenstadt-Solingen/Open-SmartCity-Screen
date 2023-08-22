import React from 'react'
import MapPanel from '../panels/MapPanel'

type setCenter = (panel: React.JSX.Element) => void

interface Props {
  isOpen: boolean
  tilePos: number
  setCenter: setCenter
}

export default function MapTile(props: Props): React.JSX.Element {
  return (
    <div className="flex flex-col items-center text-6xl font-bold p-12 w-full h-full text-solingen-yellow bg-solingen-blue whitespace-nowrap overflow-hidden">
      <div className="text-left w-full mb-20 tracking-wide">
        Solingen <br /> à la Carte!
      </div>

      <div
        className={
          'flex flex-col justify-center items-center transition-opacity duration-solingen-speed'
        }
        style={props.isOpen ? { opacity: 0 } : { opacity: 1 }}
      >
        <div
          className="mx-auto mb-16 w-[12vh] h-[12vh] rounded-full bg-white bg-no-repeat bg-center"
          style={{ backgroundImage: 'url("/images/svg/map.svg")', backgroundSize: '55%' }}
        ></div>
        <div className="text-4xl text-white tracking-wide mb-6 font-light whitespace-nowrap">
          Interessante Orte
          <br />
          in Solingen
        </div>
        <button
          className="w-60 h-14 rounded-lg text-2xl bg-solingen-yellow text-solingen-blue"
          onClick={() => props.setCenter(<MapPanel></MapPanel>)}
        >
          Jetzt entdecken
        </button>
      </div>
    </div>
  )
}
