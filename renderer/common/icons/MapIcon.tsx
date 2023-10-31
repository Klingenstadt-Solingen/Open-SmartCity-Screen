import React from 'react'
import { environment } from '../../environment'

function MapIcon({
  fill = environment.secondaryColor || '#ffbf00',
  width = '139.8',
  height = '160'
}: {
  fill?: string
  width?: string
  height?: string
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 139.791 160">
      <g
        id="Maps-Navigation_Pins_pin-location-1"
        data-name="Maps-Navigation / Pins / pin-location-1"
        transform="translate(-379.605 -553.813)"
      >
        <g id="Group_32" data-name="Group 32" transform="translate(369.5 555.813)">
          <g id="pin-location-1">
            <path
              id="Oval_25"
              data-name="Oval 25"
              d="M401.848,607.508A24.348,24.348,0,1,0,377.5,583.161,24.348,24.348,0,0,0,401.848,607.508Z"
              transform="translate(-321.848 -537.943)"
              fill="none"
              stroke={fill}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
            />
            <path
              id="Shape_90"
              data-name="Shape 90"
              d="M421.832,555.813a47.7,47.7,0,0,1,47.687,47.694c0,22.365-34.379,77.809-44.758,94.031a3.48,3.48,0,0,1-5.857,0c-10.379-16.222-44.758-71.652-44.758-94.031a47.681,47.681,0,0,1,47.687-47.694Z"
              transform="translate(-341.832 -555.813)"
              fill="none"
              stroke={fill}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
            />
            <path
              id="Shape_91"
              data-name="Shape 91"
              d="M466.915,575.013c22.718,1.913,38.376,5.957,38.376,10.627,0,6.524-30.394,11.808-67.9,11.808s-67.9-5.284-67.9-11.808c0-4.664,15.557-8.7,38.128-10.627"
              transform="translate(-357.395 -441.447)"
              fill="none"
              stroke={fill}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
            />
          </g>
        </g>
      </g>
    </svg>
  )
}

export default MapIcon
