import React from 'react'
import RoomBookingPanel from '../panels/RoomBookingPanel'
import { RoomBooking } from '../../../../models/roombooking'

type setCenter = (panel: React.JSX.Element) => void
interface Props {
  isOpen: boolean
  tilePos: number
  setCenter: setCenter
  accessabilityCode: number
  config?: any
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

  const title = 'Open Smart City App HowTo'
  const speaker = 'Alexander Balsam'
  const desc =
    'Die Open Smart City App bietet für Kommunen einen schnellen und einfachen Einstieg in das Thema Smart City App. Wir erläutern wie Sie mit Hilfe der Open Source Lösung der Stadt Solingen, auch für Ihre Kommune eine Smart City App realisieren können. Vom zentralen Server über die Anbindung an Wettersensoren, Mobilitätsangeboten und Ratsinformationssystemen bis zur eigenen App, im Look and Feel ihrer Kommune im App Store beleuchten wir alle Aspekte.'

  const today = new Date()
  const formattedDate = today.toISOString().split('T')[0].split('-').reverse().join('.')

  const roomBooking = [
    {
      room: `${formattedDate} 11:00 Uhr`,
      description: title,
      details: desc,
      info: speaker
    },
    {
      room: `${formattedDate} 15:00 Uhr`,
      description: title,
      details: desc,
      info: speaker
    }
  ] as RoomBooking[]

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
        {roomBooking.map((booking, index) => (
          <div
            onMouseDown={() => props.setCenter(<RoomBookingPanel roombooking={booking} />)}
            key={index}
            className="text-left mb-4 w-full"
          >
            <div className="text-2xl pl-[30px] ml-8 mr-12 font-thin border-l-2 border-secondary-color text-on-background-color">
              {booking.room}
            </div>
            <div className="mx-12 text-2xl font-bold my-2 text-primary-color line-clamp-3">
              {booking.description}
              <div>{booking.details}</div>
            </div>
            <div className="mx-12 text-lg text-secondary-color">{booking.info}</div>
            <span className="ml-12 text-xl text-secondary-color">&gt;&nbsp;&nbsp;</span>
            <span className="text-xl ">mehr erfahren</span>
          </div>
        ))}
      </div>
      <button
        style={props.isOpen ? { opacity: 0 } : { opacity: 1 }}
        className="w-64 h-20 rounded-lg text-2xl bg-secondary-color text-primary-color self-center font-semibold p-2"
      >
        Alle Raumbelegungen <span className="text-on-primary-color ml-2">&gt;&nbsp;&nbsp;</span>
      </button>
    </div>
  )
}
