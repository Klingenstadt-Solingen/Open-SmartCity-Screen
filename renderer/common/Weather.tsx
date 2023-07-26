import React from 'react'
// import { WeatherContext } from '../utils/Context'
// import { type PropsWithChildren } from 'react'

export default function Weather(): React.JSX.Element {
  // const content = useContext(WeatherContext) //get value from Panel

  return (
    <div id="weatherDetailsContainer">
      <div id="weatherBlock_1" className="weatherBlock "></div>
      <div id="weatherBlock_2" className="weatherBlock"></div>
      <div id="weatherBlock_3" className="weatherBlock"></div>
      <div id="weatherBlock_4" className="weatherBlock"></div>
      <div id="weatherBlock_5" className="weatherBlock"></div>
    </div>
  )
}
