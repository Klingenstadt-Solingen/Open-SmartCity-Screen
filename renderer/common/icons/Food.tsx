import React from 'react'
import { environment } from '../../environment'

function Food({ fill = environment.secondaryColor || '#ffbf00' }: { fill?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="82" height="82" viewBox="0 0 82 82">
      <g
        id="Food-Drinks_Eating-Restaurant_restaurant-eating-set"
        data-name="Food-Drinks / Eating-Restaurant / restaurant-eating-set"
        transform="translate(-324.073 -76.891)"
      >
        <g id="Group_3" data-name="Group 3" transform="translate(325.073 77.891)">
          <g id="Light_3" data-name="Light 3">
            <path
              id="Shape_8"
              data-name="Shape 8"
              d="M345.073,130.065h8.7a1.74,1.74,0,0,0,1.739-1.739c-.233-27.13-5.729-50.435-10.435-50.435v80"
              transform="translate(-275.508 -77.891)"
              fill="none"
              stroke={fill}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              id="Shape_9"
              data-name="Shape 9"
              d="M325.073,77.891V95.282a10.435,10.435,0,0,0,20.87,0V77.891"
              transform="translate(-325.073 -77.891)"
              fill="none"
              stroke={fill}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              id="Shape_10"
              data-name="Shape 10"
              d="M328.074,77.891v80"
              transform="translate(-317.636 -77.891)"
              fill="none"
              stroke={fill}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              id="Oval_3"
              data-name="Oval 3"
              d="M352.683,132.108A22.609,22.609,0,1,0,330.074,109.5,22.608,22.608,0,0,0,352.683,132.108Z"
              transform="translate(-312.679 -55.587)"
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

export default Food
