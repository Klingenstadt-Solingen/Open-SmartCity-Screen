import { useLiveQuery } from 'dexie-react-hooks'
import React from 'react'
import { db } from '../../../../utils/dexie'
import RoomBookingPanel from '../panels/RoomBookingPanel'

type setCenter = (panel: React.JSX.Element) => void
interface Props {
  isOpen: boolean
  tilePos: number
  setCenter: setCenter
  accessabilityCode: number
}

export default function RoomBookingTile(props: Props): React.JSX.Element {
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

  const roomBooking = useLiveQuery(async () => {
    return db.tiles.toArray()
  })

  if (typeof roomBooking !== 'undefined') {
    return (
      <div className="w-full h-full pt-12 overflow-hidden flex flex-col pb-16">
        <div
          className="px-12 text-6xl text-left font-bold mb-8 tracking-wide text-primary-color whitespace-nowrap"
          style={cssForTitle}
        >
          Wo soll es
          <br />
          hingehen?
        </div>
        <div
          className="transition-opacity duration-app-speed flex flex-col flex-wrap overflow-hidden"
          style={props.isOpen ? { opacity: 0 } : { opacity: 1 }}
        >
          {roomBooking?.slice(0, 3).map((booking, index) => {
            return (
              <div
                onMouseDown={() => props.setCenter(<RoomBookingPanel />)}
                key={index}
                className="text-left font-bold mb-4 w-full"
              >
                <div className="text-2xl pl-[6px] ml-8 mr-12 font-thin border-l-2 border-secondary-color text-on-background-color">
                  R101
                </div>
                <span className="text-left font-bold mb-4"></span>
                <div className="mx-12 text-2xl my-2 text-primary-color line-clamp-3">
                  Hier steht was im Raum stattfindet?
                  <div>Lorem ipsum dolor sit amet</div>
                </div>
                <div className="mx-12 text-xl font-bold text-secondary-color">
                  Hier steht eine weitere Info
                </div>
                <span className="ml-12 text-secondary-color">&gt;&nbsp;&nbsp;</span>mehr erfahren
              </div>
            )
          })}
        </div>
        <button
          style={props.isOpen ? { opacity: 0 } : { opacity: 1 }}
          className="w-64 h-20 rounded-lg text-2xl bg-secondary-color text-primary-color self-center font-semibold p-2"
          onMouseDown={() => props.setCenter(<RoomBookingPanel></RoomBookingPanel>)}
        >
          Alle Raumbelegungen <span className="text-on-primary-color ml-2">&gt;&nbsp;&nbsp;</span>
        </button>
      </div>
    )
  }
}
