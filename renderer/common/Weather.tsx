import React from 'react'
// import { WeatherContext } from '../utils/Context'
// import { type PropsWithChildren } from 'react'

export default function Weather(): React.JSX.Element {
  // const content = useContext(WeatherContext) //get value from Panel

  return (
    <div id="weatherDetailsContainer">
      <div id="weatherBlock_1" className="weatherBlock ">
        <div id="weatherBlock_1_1"></div>
        <div id="weatherBlock_1_2">
          <div className="text-3xl pt-8 pb-6">Temperatur</div>
          <div className="text-7xl font-bold py-3">7.9°C</div>
          <div className="text-xs">aktualisiert 3.2.2023, 13:50:07</div>
        </div>
      </div>

      <div id="weatherBlock_2" className="weatherBlock text-white">
        <div id="weatherBlock_2_1" className="mt-6 ml-8"></div>
        <div className="weatherBlock_2_2 text-xl font-bold mt-3 ml-8">UV-Licht</div>
        <div className="weatherBlock_2_2 text-6xl font-bold ml-8">0</div>
      </div>

      <div id="weatherBlock_3" className="weatherBlock text-white">
        <div id="weatherBlock_3_1" className="mt-6 ml-8"></div>
        <div className="weatherBlock_2_2 text-xl font-bold mt-3 ml-8">Niederschlag</div>
        <div className="weatherBlock_2_2 text-3xl font-bold ml-8">0.01mm/h</div>
      </div>

      <div id="weatherBlock_4" className="weatherBlock">
        <div id="weatherBlock_4_1" className="mt-6 ml-8"></div>
        <div className="weatherBlock_2_2 text-xl font-bold mt-3 ml-8">Luftfeuchtigkeit</div>
        <div className="weatherBlock_2_2 text-3xl font-bold ml-8">92.6%</div>
      </div>

      <div id="weatherBlock_5" className="weatherBlock">
        <div id="weatherBlock_5_1" className="mt-6 ml-8"></div>
        <div className="weatherBlock_2_2 text-xl font-bold mt-3 ml-8">Luftdruck</div>
        <div className="weatherBlock_2_2 text-3xl font-bold ml-8">1025.9hpa</div>
      </div>
    </div>
  )
}
