import React from 'react'
import MapPanel from '../panels/MapPanel'

type setCenter = (panel: React.JSX.Element) => void

interface Props {
  isOpen: boolean
  tilePos: number
  setCenter: setCenter
  accessabilityCode: number
}

export default function POITile(props: Props): React.JSX.Element {
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

  return (
    <div className="h-full w-full p-6 overflow-hidden">
      <div className="bg-solingen-grey p-6 rounded-lg text-solingen-blue w-full h-full flex flex-col overflow-hidden">
        <div className="ml-4 text-left tracking-wide text-6xl font-bold mb-11" style={cssForTitle}>
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
            onClick={() => props.setCenter(<MapPanel preSelected={'Freifunk'}></MapPanel>)}
          >
            <div
              className="w-full h-full max-w-[60%] max-h-[60%] bg-contain bg-no-repeat"
              style={{ backgroundImage: 'url("/images/svg/wifi.svg")' }}
            ></div>
            <div className="w-full text-right">Freifunk WLAN</div>
          </button>
          <button
            className="text-3xl bg-solingen-blue rounded-xl h-[30%] p-5 flex flex-col justify-between"
            onClick={() => props.setCenter(<MapPanel preSelected={'Übernachtung'}></MapPanel>)}
          >
            <div
              className="w-full h-full max-w-[60%] max-h-[60%] bg-contain bg-no-repeat"
              style={{ backgroundImage: 'url("/images/svg/bed.svg")' }}
            ></div>
            <div className="w-full text-right">Schlafen in Solingen</div>
          </button>
          <button
            className="text-3xl bg-solingen-blue rounded-xl h-[30%] p-5 flex flex-col justify-between"
            onClick={() => props.setCenter(<MapPanel preSelected={'Freizeit'}></MapPanel>)}
          >
            <div
              className="w-full h-full max-w-[70%] max-h-[70%] bg-contain bg-no-repeat "
              style={{ backgroundImage: 'url("/images/svg/amusement.svg")' }}
            ></div>
            <div className="w-full text-right">Freizeitaktivitäten</div>
          </button>
        </div>
      </div>
    </div>
  )
}
