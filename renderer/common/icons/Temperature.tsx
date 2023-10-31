import React from 'react'
import { environment } from '../../environment'

function Temperature({ fill = environment.primaryColor || '#004373' }: { fill?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="180" height="280" viewBox="0 0 75.498 171">
      <g data-name="Gruppe 457" fill="none" stroke={fill} strokeWidth="4">
        <path
          data-name="Shape 965"
          d="M45.114 115.163V15.692a14.692 14.692 0 1 0-29.384 0v99.471a29.386 29.386 0 1 0 29.384 0Z"
        />
        <path
          data-name="Oval 32"
          d="M30.423 147.919a7.346 7.346 0 1 0-7.346-7.346 7.344 7.344 0 0 0 7.346 7.346Z"
        />
        <path data-name="Shape 966" d="M30.422 133.23V59.767" />
        <path data-name="Shape 967" d="M59.806 96.497h14.692" />
        <path data-name="Shape 968" d="M59.806 59.767h14.692" />
        <path data-name="Shape 969" d="M59.806 23.038h14.692" />
      </g>
    </svg>
  )
}

export default Temperature
