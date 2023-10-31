import React from 'react'
import { environment } from '../../environment'

function Weather({
  fill = environment.primaryColor || '#004373',
  height = '122',
  width = '164'
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
      viewBox="0 0 164.043 122.336"
    >
      <g
        id="Weather_Weather_weather-cloud-1"
        data-name="Weather / Weather / weather-cloud-1"
        transform="translate(2 2.042)"
      >
        <g id="Group_39" data-name="Group 39" transform="translate(0 0)">
          <g id="Light_39" data-name="Light 39">
            <path
              id="Shape_245"
              data-name="Shape 245"
              d="M296.234,439.71a24.332,24.332,0,0,0-25.368-32.16,41.713,41.713,0,0,0-81.04,13.8,38.341,38.341,0,0,0,0,76.682H280.2a31.4,31.4,0,0,0,16.031-58.321Z"
              transform="translate(-151.485 -379.737)"
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

export default Weather
