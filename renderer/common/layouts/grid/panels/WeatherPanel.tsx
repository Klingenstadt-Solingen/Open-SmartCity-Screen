import React from 'react'
import { Weather } from '../../../../models/weather'

const weatherInfo = [
  {
    num: 1,
    text_1: 'UV-Licht',
    text_2: '0',
    bgColor: '#9aca78',
    fontColor: 'white',
    borderColor: 'white',
    bgImage: '/images/svg/UV.svg'
  },
  {
    num: 2,
    text_1: 'Niederschlag',
    text_2: '0.01mm/h',
    bgColor: '#5ea4ee',
    fontColor: 'white',
    borderColor: 'white',
    bgImage: '/images/svg/rain.svg'
  },
  {
    num: 3,
    text_1: 'Luftfeuchtigkeit',
    text_2: '92.6%',
    bgColor: '#f2f2f2',
    fontColor: '#004373',
    borderColor: '#FFBF00',
    bgImage: '/images/svg/moisture.svg'
  },
  {
    num: 4,
    text_1: 'Luftdruck',
    text_2: '1025.9hpa',
    bgColor: '#f2f2f2',
    fontColor: '#004373',
    borderColor: '#FFBF00',
    bgImage: '/images/svg/airPressure.svg'
  }
]

export default function WeatherPanel(props: { weather: Weather }): React.JSX.Element {
  return (
    <div id="weatherDetailsContainer" className="tracking-wide">
      <div className="w-full text-6xl text-solingen-blue font-bold mb-6">
        Wetter <span>{props.weather?.shortName}</span>
      </div>
      <div id="weatherBlock_big" className="bg-solingen-yellow mb-5">
        <div id="weatherBlock_big_1"></div>
        <div id="weatherBlock_big_2">
          <div
            className="text-5xl font-bold pl-3 border-l-8 border-solingen-blue"
            style={{ marginLeft: '-20px' }}
          >
            Temperatur
          </div>
          <div className="text-9xl font-bold my-9" style={{ marginLeft: '-20px' }}>
            {props.weather?.values?.lufttemperatur?.value}
            {props.weather?.values?.lufttemperatur?.unit}
          </div>
          <div className="text-3xl" style={{ marginLeft: '-20px' }}>
            aktualisiert am {new Intl.DateTimeFormat('de-DE').format(props.weather?.dateObserved)}
          </div>
        </div>
      </div>
      {weatherInfo.map((weather) => (
        <div
          key={weather.num}
          style={{ color: weather.fontColor, backgroundColor: weather.bgColor }}
          className="weatherBlock_small"
        >
          <div
            className="weatherBlock_2_1 mt-20 ml-10"
            style={{ backgroundImage: `url(${weather.bgImage})` }}
          ></div>
          <div
            className="weatherBlock_2_2 text-3xl font-bold my-10 ml-10 pl-5"
            style={{ borderLeft: `8px solid ${weather.borderColor}` }}
          >
            {weather.text_1}
          </div>
          <div className="weatherBlock_2_2 text-4xl font-bold ml-10">{weather.text_2}</div>
        </div>
      ))}
    </div>
  )
}
