import React from 'react'
import { environment } from '../../../../environment'
import MapIcon from '../../../icons/MapIcon'
import MapPanel from '../panels/MapPanel/MapPanel'

type setCenter = (panel: React.JSX.Element) => void

interface Props {
  isOpen: boolean
  tilePos: number
  setCenter: setCenter
  accessabilityCode: number
}

export default function MapTile(props: Props): React.JSX.Element {
  let cssForTitle: React.CSSProperties = {}
  if (props.isOpen) {
    if (props.tilePos < 3) {
      switch (props.accessabilityCode) {
        case 0:
          cssForTitle = { marginBottom: '5rem' }
          break
        case 1:
          cssForTitle = { opacity: 0, marginBottom: '5rem' }
          break
        case 2:
          cssForTitle = {
            position: 'absolute',
            bottom: '4.4rem',
            marginBottom: '0',
            marginLeft: '3rem'
          }
          break
      }
    } else {
      switch (props.accessabilityCode) {
        case 0:
          cssForTitle = { marginBottom: '5rem' }
          break
        case 1:
          cssForTitle = { marginBottom: '5rem' }
          break
        case 2:
          cssForTitle = { opacity: 0, marginBottom: '5rem' }
          break
      }
    }
  }

  return (
    <div className="flex flex-col items-center text-6xl font-bold p-12 w-full h-full text-secondary-color bg-primary-color whitespace-nowrap overflow-hidden">
      <div className="text-left mb-20 w-full tracking-wide" style={cssForTitle}>
        {environment.cityName || 'Solingen'} <br /> à la Carte!
      </div>

      <div
        className={
          'flex flex-col justify-center items-center transition-opacity duration-app-speed'
        }
        style={props.isOpen ? { opacity: 0 } : { opacity: 1 }}
      >
        <div className="flex justify-center items-center mb-16 w-[12vh] h-[12vh] rounded-full bg-white">
          <MapIcon width="100%" height="60%" />
        </div>
        <div className="text-4xl text-on-primary-color tracking-wide mb-6 font-light whitespace-nowrap">
          Interessante Orte
          <br />
          in {environment.cityName || 'Solingen'}
        </div>
        <button
          className="w-60 h-14 rounded-lg text-2xl bg-secondary-color text-primary-color"
          onMouseDown={() => props.setCenter(<MapPanel />)}
        >
          Jetzt entdecken
        </button>
      </div>
    </div>
  )
}
