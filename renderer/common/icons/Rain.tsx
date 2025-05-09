import React from 'react'
import { environment } from '../../environment'

function Rain({
  fill = environment.backgroundColor || '#FFFFFF',
  height = '45',
  width = '61'
}: {
  fill?: string
  height?: string
  width?: string
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 61.516 45.876"
    >
      <g data-name="Weather / Weather / weather-cloud-1">
        <g data-name="Group 39">
          <g data-name="Light 39">
            <path
              data-name="Shape 245"
              d="M55.031 23.256a9.124 9.124 0 0 0-9.513-12.06 15.642 15.642 0 0 0-30.39 5.175 14.378 14.378 0 0 0 0 28.756h33.891a11.773 11.773 0 0 0 6.012-21.87Z"
              fill="none"
              stroke={fill}
            />
          </g>
        </g>
      </g>
    </svg>
  )
}

export default Rain
