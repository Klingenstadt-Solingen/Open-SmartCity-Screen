import React from 'react'
import { environment } from '../../environment'

function AirPressure({
  fill = environment.secondaryColor || '#ffbf00',
  width = '61.5',
  height = '61.5'
}: {
  fill?: string
  width?: string
  height?: string
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 61.5 61.5">
      <g id="Gruppe_449" data-name="Gruppe 449" transform="translate(-1075.5 -710.747)">
        <circle
          id="Ellipse_1"
          data-name="Ellipse 1"
          cx="30"
          cy="30"
          r="30"
          transform="translate(1076.25 711.497)"
          fill="none"
          stroke={fill}
          strokeWidth="1.5"
        />
        <path
          id="Shape_1151"
          data-name="Shape 1151"
          d="M168.353,1324.237a18.981,18.981,0,0,1-2.479,17.367"
          transform="translate(955.756 -589.055)"
          fill="none"
          stroke={fill}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          id="Shape_1152"
          data-name="Shape 1152"
          d="M158.551,1350.226a18.945,18.945,0,0,1,28.8-24.433"
          transform="translate(932.29 -597.684)"
          fill="none"
          stroke={fill}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          id="Oval_54"
          data-name="Oval 54"
          d="M164.236,1334.21a4.736,4.736,0,1,0-4.736-4.736A4.736,4.736,0,0,0,164.236,1334.21Z"
          transform="translate(942.004 -587.976)"
          fill="none"
          stroke={fill}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          id="Shape_1153"
          data-name="Shape 1153"
          d="M162.061,1334.753l14.016-14.016"
          transform="translate(947.53 -596.606)"
          fill="none"
          stroke={fill}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  )
}

export default AirPressure
