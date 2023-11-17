import React from 'react'
import { environment } from '../../environment'

function Wifi({
  fill = environment.secondaryColor || '#ffbf00',
  width = '100',
  height = '100'
}: {
  fill?: string
  width?: string
  height?: string
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 100 100">
      <g
        id="Internet-Networks-Servers_Wifi_wifi"
        data-name="Internet-Networks-Servers / Wifi / wifi"
        transform="translate(-375.786 -404.499)"
      >
        <g id="Group_55" data-name="Group 55" transform="translate(377.2 405.499)">
          <g id="wifi">
            <path
              id="Shape_405"
              data-name="Shape 405"
              d="M380.03,422.335a40.405,40.405,0,0,1,57.14,0"
              transform="translate(-368.596 -390.29)"
              fill="none"
              stroke={fill}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              id="Shape_406"
              data-name="Shape 406"
              d="M457.2,422.069a56.566,56.566,0,0,0-80,0"
              transform="translate(-377.2 -405.499)"
              fill="none"
              stroke={fill}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              id="Shape_407"
              data-name="Shape 407"
              d="M382.857,422.6a24.24,24.24,0,0,1,34.287,0"
              transform="translate(-360.001 -375.095)"
              fill="none"
              stroke={fill}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              id="Shape_408"
              data-name="Shape 408"
              d="M437.17,422.335a40.405,40.405,0,0,0-57.14,0"
              transform="translate(-368.596 -390.29)"
              fill="none"
              stroke={fill}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              id="Shape_409"
              data-name="Shape 409"
              d="M417.145,422.6a24.24,24.24,0,0,0-34.287,0"
              transform="translate(-359.997 -375.095)"
              fill="none"
              stroke={fill}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              id="Oval_44"
              data-name="Oval 44"
              d="M393.181,436.662a8.081,8.081,0,1,0-8.081-8.081A8.079,8.079,0,0,0,393.181,436.662Z"
              transform="translate(-353.181 -359.89)"
              fill="none"
              stroke={fill}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </g>
        </g>
      </g>
    </svg>
  )
}

export default Wifi
