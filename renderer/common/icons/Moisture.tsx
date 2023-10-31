import React from 'react'
import { environment } from '../../environment'

function Moisture({ fill = environment.primaryColor || '#004373' }: { fill?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="61.508"
      height="61.513"
      viewBox="0 0 61.508 61.513"
    >
      <g data-name="Weather / Humidity / humidity-high">
        <g data-name="Group 141">
          <g data-name="Light 141" fill="none" stroke={fill}>
            <path data-name="Shape 1149" d="M33.364 49.062a24.784 24.784 0 1 1 16.092-30.04" />
            <path
              data-name="Shape 1150"
              d="M39.887 50.329a10.436 10.436 0 0 0 20.871 0c0-7.827-5.218-18.263-10.436-23.48a35.748 35.748 0 0 0-10.436 23.48Z"
            />
            <path data-name="Shape 1151" d="M40.301 20.326a15.683 15.683 0 0 1-2.048 14.349" />
            <path data-name="Shape 1152" d="M12.813 34.67a15.653 15.653 0 0 1 23.793-20.188" />
            <path
              data-name="Oval 54"
              d="M25.537 29.457a3.913 3.913 0 1 0-3.913-3.913 3.913 3.913 0 0 0 3.913 3.913Z"
            />
            <path data-name="Shape 1153" d="m28.306 22.775 11.581-11.581" />
          </g>
        </g>
      </g>
    </svg>
  )
}

export default Moisture
