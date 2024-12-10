import React from 'react'
import MapPanel from '../panels/MapPanel/MapPanel'
import { environment } from '../../../../environment'
import Wifi from '../../../icons/Wifi'
import Bed from '../../../icons/Bed'
import Amusement from '../../../icons/Amusement'

type setCenter = (panel: React.JSX.Element) => void

interface Props {
  isOpen: boolean
  tilePos: number
  setCenter: setCenter
  accessabilityCode: number
  config: any
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
      <div className="bg-background-color-dark p-6 rounded-lg text-primary-color w-full h-full flex flex-col overflow-hidden">
        <div className="ml-4 text-left tracking-wide text-6xl font-bold mb-11" style={cssForTitle}>
          Häufig
          <br />
          gesucht.
        </div>
        <div
          className="w-full flex flex-col justify-between h-3/4 text-on-primary-color font-medium transition-opacity duration-app-speed"
          style={props.isOpen ? { opacity: 0 } : { opacity: 1 }}
        >
          <button
            className="text-3xl bg-primary-color rounded-xl h-[30%] p-5 flex justify-between"
            onMouseDown={() => props.setCenter(<MapPanel preSelected={'preSelect1'} />)}
          >
            <Wifi height="100%" width="300" />
            <div className="self-end w-full text-right">Freifunk WLAN</div>
          </button>
          <button
            className="text-3xl bg-primary-color rounded-xl h-[30%] p-5 flex justify-between"
            onMouseDown={() => props.setCenter(<MapPanel preSelected={'preSelect2'} />)}
          >
            <Bed height="100%" width="300" />
            <div className="self-end w-full text-right whitespace-nowrap">
              Schlafen in {environment.cityName || 'Solingen'}
            </div>
          </button>
          <button
            className="text-3xl bg-primary-color rounded-xl h-[30%] p-5 flex justify-between"
            onMouseDown={() => props.setCenter(<MapPanel preSelected={'preSelect3'} />)}
          >
            <Amusement height="100%" width="300" />
            <div className="self-end w-full text-right">Freizeitaktivitäten</div>
          </button>
        </div>
      </div>
    </div>
  )
}
