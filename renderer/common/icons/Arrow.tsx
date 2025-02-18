import React from 'react'
import { environment } from '../../environment'

interface ArrowProps {
  fill?: string
  orientation?: 'up' | 'down' | 'left' | 'right'
  className?: string
}

export function Arrow({
  fill = environment.secondaryColor || '#ffbf00',
  orientation = 'up',
  className = ''
}: ArrowProps) {
  let rotationClass = null

  switch (orientation) {
    case 'down':
      rotationClass = 'rotate-180'
      break
    case 'right':
      rotationClass = 'rotate-90'
      break
    case 'left':
      rotationClass = 'rotate-[270deg]'
      break
    default:
      rotationClass = 'rotate-0'
      break
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 16 16"
      className={`${rotationClass} ${className}`}
    >
      <path
        fillRule="evenodd"
        d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
        stroke={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}
