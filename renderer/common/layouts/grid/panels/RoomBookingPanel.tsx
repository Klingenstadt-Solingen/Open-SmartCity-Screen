import React from 'react'
import { RoomBooking } from '../../../../models/roombooking'
interface Props {
  roombooking?: RoomBooking
}

export default function RoomBookingPanel(props: Props): React.JSX.Element {
  return (
    <div className="p-12 flex flex-col justify-between gap-y-12">
      <div className="text-primary-color text-5xl font-bold text-left flex w-full justify-between items-center">
        <span className="line-clamp-3">{props.roombooking.description}</span>
        <div className="flex justify-self-end">
          <div className="flex flex-col justify-center">
            <span className="text-3xl font-black"></span>
            <span className="text-3xl font-black">{props.roombooking.room}</span>
          </div>
        </div>
      </div>
      <div className="w-full overflow-y-scroll overflow-x-wrap h-full scrollbar-hide">
        <div className="text-2xl text-left scrollbar-hide h-[55rem] [&>p]:mb-5">
          {props.roombooking.details}
          <br />
          <br />
          <div className="font-thin">Speaker: {props.roombooking.info}</div>
        </div>
      </div>
    </div>
  )
}
