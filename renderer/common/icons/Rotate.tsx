import React from 'react'
import { environment } from '../../environment'

function Rotate({
  fill = environment.secondaryColor || '#ffbf00',
  width = '28.774',
  height = '21.218'
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
      viewBox="0 0 28.774 21.218"
    >
      <g
        id="Interface-Essential_Synchronize_synchronize-arrows-square-1"
        data-name="Interface-Essential / Synchronize / synchronize-arrows-square-1"
        transform="translate(-565.113 -6212.5)"
      >
        <g id="Group_644" data-name="Group 644" transform="translate(566.5 6213.5)">
          <g id="synchronize-arrows-square-1">
            <path
              id="Shape_3009"
              data-name="Shape 3009"
              d="M583.065,6231.935H572.891a3.391,3.391,0,0,1-3.391-3.392V6219.5"
              transform="translate(-566.109 -6212.717)"
              fill="none"
              stroke={fill}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              id="Shape_3010"
              data-name="Shape 3010"
              d="M574.5,6213.5h10.174a3.391,3.391,0,0,1,3.391,3.392v9.044"
              transform="translate(-565.457 -6213.5)"
              fill="none"
              stroke={fill}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              id="Shape_3011"
              data-name="Shape 3011"
              d="M566.5,6221.762l3.391-2.262,3.391,2.262"
              transform="translate(-566.5 -6212.717)"
              fill="none"
              stroke={fill}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              id="Shape_3012"
              data-name="Shape 3012"
              d="M583.5,6222.5l3.391,2.261,3.391-2.261"
              transform="translate(-564.283 -6212.325)"
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

export default Rotate
