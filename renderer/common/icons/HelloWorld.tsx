import React from 'react'
import { environment } from '../../environment'

function HelloWorld({ fill = environment.secondaryColor || '#ffbf00' }: { fill?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="82" height="82.742" viewBox="0 0 82 82.742">
      <g
        id="Maps-Navigation_Earth_earth-3"
        data-name="Maps-Navigation / Earth / earth-3"
        transform="translate(-272.499 -2746.425)"
      >
        <g id="Group_354" data-name="Group 354" transform="translate(273.5 2747.803)">
          <g id="earth-3">
            <path
              id="Shape_1758"
              data-name="Shape 1758"
              d="M353.5,2787.632a40.128,40.128,0,0,1-40.111,40.153,40.566,40.566,0,0,1-39.888-40.873,39.117,39.117,0,0,1,38.278-39.074c.577-.024,1.155-.035,1.739-.035a39.767,39.767,0,0,1,39.982,39.829Z"
              transform="translate(-273.5 -2747.802)"
              fill="none"
              stroke={fill}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              id="Shape_1759"
              data-name="Shape 1759"
              d="M295.657,2747.813c-20.869,22.608-20.869,52.1,0,79.929"
              transform="translate(-257.378 -2747.777)"
              fill="none"
              stroke={fill}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              id="Shape_1760"
              data-name="Shape 1760"
              d="M285.505,2747.813c20.869,22.608,20.869,52.094,0,79.919"
              transform="translate(-243.748 -2747.777)"
              fill="none"
              stroke={fill}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              id="Shape_1761"
              data-name="Shape 1761"
              d="M275.386,2752.793h66.552"
              transform="translate(-268.825 -2735.436)"
              fill="none"
              stroke={fill}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              id="Shape_1762"
              data-name="Shape 1762"
              d="M273.5,2758.793h79.988"
              transform="translate(-273.491 -2720.567)"
              fill="none"
              stroke={fill}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              id="Shape_1763"
              data-name="Shape 1763"
              d="M274.985,2764.793H344.9"
              transform="translate(-269.819 -2705.697)"
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

export default HelloWorld
