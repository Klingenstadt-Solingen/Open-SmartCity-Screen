import React from 'react'
import { environment } from '../../environment'

function PeopleIcon({
  fill = environment.secondaryColor || '#ffbf00',
  width = '155.7',
  height = '155.683'
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
      viewBox="-2.85 -2.85 155.7 155.683"
      fill={fill}
    >
      <g data-name="Light 241">
        <path
          d="M107.609 125.218c25.095 2.12 42.39 6.587 42.39 11.739C150 144.13 116.427 150 75 150 33.575 150.001 0 144.131 0 136.957c0-5.152 17.185-9.606 42.117-11.74"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="4"
          stroke="#004373"
          fill="transparent"
          data-name="Shape 971"
        />
        <path
          d="M130.435 42.391c8.106 0 14.674-6.568 14.674-14.674 0-8.1-6.568-14.674-14.674-14.674-8.107 0-14.674 6.575-14.674 14.674 0 8.106 6.567 14.674 14.674 14.674Z"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="4"
          stroke="#004373"
          fill="transparent"
          data-name="Oval 346"
        />
        <path
          d="M130.435 48.913c-10.807 0-19.565 8.759-19.565 19.566v16.303h9.782l3.261 29.348h13.043l3.261-29.348H150V68.48c0-10.807-8.759-19.566-19.565-19.566Z"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="4"
          stroke="#004373"
          fill="transparent"
          data-name="Shape 972"
        />
        <path
          d="M19.565 42.391c8.107 0 14.674-6.568 14.674-14.674 0-8.1-6.567-14.674-14.674-14.674-8.106 0-14.674 6.575-14.674 14.674 0 8.106 6.568 14.674 14.674 14.674Z"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="4"
          stroke="#004373"
          fill="transparent"
          data-name="Oval 347"
        />
        <path
          d="M19.565 48.913C8.758 48.913 0 57.672 0 68.479v16.303h9.782l3.262 29.348h13.043l3.26-29.348h9.783V68.48c0-10.807-8.758-19.566-19.565-19.566Z"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="4"
          stroke="#004373"
          fill="transparent"
          data-name="Shape 973"
        />
        <g data-name="Group 11">
          <path
            d="M75 35.87c9.906 0 17.935-8.03 17.935-17.936C92.935 8.034 84.906 0 75 0c-9.906 0-17.935 8.035-17.935 17.934 0 9.906 8.029 17.935 17.935 17.935Z"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="4"
            stroke="#004373"
            fill="transparent"
            data-name="Oval 348"
          />
          <path
            d="M97.826 65.217c0-12.607-10.22-22.826-22.826-22.826-12.607 0-22.826 10.22-22.826 22.826v19.565h10.324l2.72 32.61h19.565l2.719-32.61h10.324V65.217Z"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="4"
            stroke="#004373"
            fill="transparent"
            data-name="Shape 974"
          />
        </g>
      </g>
    </svg>
  )
}

export default PeopleIcon
