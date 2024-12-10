import React from 'react'
import PlanetIcon from '../../../icons/PlanetIcon'
import SearchPanel from '../panels/SearchPanel'

type setCenter = (panel: React.JSX.Element) => void

interface Props {
  isOpen: boolean
  tilePos: number
  setCenter: setCenter
  accessabilityCode: number
  config?: any
}

export default function ServiceTile(props: Props): React.JSX.Element {
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
          Dienste im
          <br />
          Rathaus.
        </div>
        <div
          className="w-full flex flex-col justify-between h-3/4 text-on-primary-color font-medium transition-opacity duration-app-speed"
          style={props.isOpen ? { opacity: 0 } : { opacity: 1 }}
        >
          <button
            className="text-4xl bg-primary-color rounded-xl h-[30%] p-5 flex justify-between"
            onMouseDown={() =>
              props.setCenter(<SearchPanel preSelectedIndex="Dienstleistung"></SearchPanel>)
            }
          >
            <div className="flex align-top">
              <PlanetIcon height="80" width="80"></PlanetIcon>
            </div>
            <div className="self-end w-full text-right text-md">
              Hier steht eine <span className="mr-14"></span>
              <br />
              Dienstleistung <span className="text-secondary-color">&gt;&nbsp;&nbsp;</span>
            </div>
          </button>
          <button
            className="text-4xl bg-primary-color rounded-xl h-[30%] p-5 flex justify-between"
            onMouseDown={() =>
              props.setCenter(<SearchPanel preSelectedIndex="Dienstleistung"></SearchPanel>)
            }
          >
            <div className="flex align-top">
              <PlanetIcon height="80" width="80"></PlanetIcon>
            </div>
            <div className="self-end w-full text-right text-md">
              Hier steht eine <span className="mr-14"></span>
              <br />
              Dienstleistung <span className="text-secondary-color">&gt;&nbsp;&nbsp;</span>
            </div>
          </button>
          <button
            className="text-4xl bg-primary-color rounded-xl h-[30%] p-5 flex justify-between"
            onMouseDown={() =>
              props.setCenter(<SearchPanel preSelectedIndex="Dienstleistung"></SearchPanel>)
            }
          >
            <div className="flex align-top">
              <PlanetIcon height="80" width="80"></PlanetIcon>
            </div>
            <div className="self-end w-full text-right text-md">
              Hier steht eine <span className="mr-14"></span>
              <br />
              Dienstleistung <span className="text-secondary-color">&gt;&nbsp;&nbsp;</span>
            </div>
          </button>
        </div>
        <button
          className="w-72 h-16 rounded-lg text-2xl bg-secondary-color text-primary-color mt-6 self-end"
          onMouseDown={() =>
            props.setCenter(<SearchPanel preSelectedIndex="Dienstleistung"></SearchPanel>)
          }
        >
          Alle Dienstleistungen <span className="text-on-primary-color">&gt;&nbsp;&nbsp;</span>
        </button>
      </div>
    </div>
  )
}
