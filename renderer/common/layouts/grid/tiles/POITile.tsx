import React from 'react'
import MapPanel from '../panels/MapPanel'

type setCenter = (panel: React.JSX.Element) => void

interface Props {
  isOpen: boolean
  tilePos: number
  setCenter: setCenter
}

export default function POITile(props: Props): React.JSX.Element {
  return (
    <div className="h-full w-full p-6 overflow-hidden">
      <div className="bg-solingen-grey p-6 rounded-lg text-solingen-blue w-full h-full flex flex-col overflow-hidden">
        <div className="ml-4 text-left tracking-wide text-6xl font-bold mb-11">
          Häufig
          <br />
          gesucht.
        </div>
        <div
          className="w-full flex flex-col justify-between h-full text-white font-medium transition-opacity duration-solingen-speed"
          style={props.isOpen ? { opacity: 0 } : { opacity: 1 }}
        >
          <button
            className="text-3xl bg-solingen-blue rounded-xl h-[30%] p-5 flex flex-col justify-between"
            onClick={() => props.setCenter(<MapPanel></MapPanel>)}
          >
            <div
              className="w-full h-full max-w-[55%] max-h-[55%] bg-contain bg-no-repeat"
              style={{ backgroundImage: 'url("/images/svg/wifi.svg")' }}
            ></div>
            <div className="w-full text-right">Freifunk WLAN</div>
          </button>
          <button
            className="text-3xl bg-solingen-blue rounded-xl h-[30%] p-5 flex flex-col justify-between"
            onClick={() => props.setCenter(<MapPanel></MapPanel>)}
          >
            <div
              className="w-full h-full max-w-[55%] max-h-[55%] bg-contain bg-no-repeat"
              style={{ backgroundImage: 'url("/images/svg/food.svg")' }}
            ></div>
            <div className="w-full text-right">Restaurants in Solingen</div>
          </button>
          <button
            className="text-3xl bg-solingen-blue rounded-xl h-[30%] p-5 flex flex-col justify-between"
            onClick={() => props.setCenter(<MapPanel></MapPanel>)}
          >
            <div
              className="w-full h-full max-w-[55%] max-h-[55%] bg-contain bg-no-repeat "
              style={{ backgroundImage: 'url("/images/svg/hello_world.svg")' }}
            ></div>
            <div className="w-full text-right">Hallo Welt</div>
          </button>
        </div>
      </div>
    </div>
  )
}
