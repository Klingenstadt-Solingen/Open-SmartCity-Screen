import React from 'react'
import { environment } from '../../environment'

function LoupeICon({
  fill = environment.secondaryColor || '#ffbf00',
  width = '155.683',
  height = '155.733'
}: {
  fill?: string
  width?: string
  height?: string
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="190.667 333.617 155.683 155.733"
      fill={fill}
    >
      <g data-name="Gruppe 743">
        <path
          d="M193.5 396.4a60 60 0 1 1 0 .1z"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="4"
          stroke="#ffbf00"
          fill="transparent"
          data-name="Ellipse 113"
        />
        <path
          d="m343.5 486.496-47-46.996"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="4"
          stroke="#ffbf00"
          fill="transparent"
          data-name="Linie 8"
        />
      </g>
    </svg>
  )
}

export default LoupeICon
