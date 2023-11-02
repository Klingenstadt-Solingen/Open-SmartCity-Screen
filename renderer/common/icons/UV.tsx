import React from 'react'
import { environment } from '../../environment'

function UV({
  fill = environment.backgroundColor || '#ffffff',
  height = '100'
}: {
  fill?: string
  height?: string
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 0 61.5 61.5">
      <g data-name="Weather / UV / uv-low-1">
        <g data-name="Group 124">
          <g data-name="Light 124" fill="none" stroke={fill} strokeWidth="4">
            <path
              data-name="Shape 1029"
              d="M25.567 1.121A2.6 2.6 0 0 0 24.229.75H3.359A2.61 2.61 0 0 0 .75 3.359v54.783a2.608 2.608 0 0 0 2.609 2.609h20.87a2.608 2.608 0 0 0 2.609-2.609v-20.87"
            />
            <path
              data-name="Oval 42"
              d="M42.489 37.272a18.261 18.261 0 1 0-18.261-18.259 18.261 18.261 0 0 0 18.261 18.259Z"
            />
            <path data-name="Shape 1030" d="M39.88 12.489v11.74a3.913 3.913 0 0 1-7.826 0v-11.74" />
            <path
              data-name="Shape 1031"
              d="M52.924 12.489v3.913a19.557 19.557 0 0 1-3.913 11.739 19.558 19.558 0 0 1-3.913-11.739v-3.913"
            />
            <path data-name="Shape 1032" d="M5.967 52.924h15.652" />
          </g>
        </g>
      </g>
    </svg>
  )
}

export default UV
