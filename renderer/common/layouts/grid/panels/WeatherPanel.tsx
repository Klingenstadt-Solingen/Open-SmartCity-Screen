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
    <div className="tracking-wide w-full h-[56vh] bg-white flex flex-wrap flex-row p-[4vh] box-border">
      <div className="w-full text-6xl text-solingen-blue font-bold mb-6">
        Wetter <span>{props.weather?.shortName}</span>
      </div>
      <div className="bg-solingen-yellow w-[65%] h-[22vh] ml-[1%] rounded-3xl flex flex-wrap flex-row">
        <div
          className="w-[45%] h-full bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/images/svg/temperature.svg")', backgroundSize: '60%' }}
        ></div>
        <div className="w-[55%] h-full text-left flex flex-wrap flex-col justify-center text-solingen-blue items-left">
          <div className="text-5xl font-bold pl-3 border-l-8 border-solingen-blue">Temperatur</div>
          <div className="text-9xl font-bold my-9">
            {props.weather?.values?.lufttemperatur?.value}
            {props.weather?.values?.lufttemperatur?.unit}
          </div>
          <div className="text-3xl">
            aktualisiert am {new Intl.DateTimeFormat('de-DE').format(props.weather?.dateObserved)}
          </div>
        </div>
      </div>
      {weatherInfo.map((weather) => (
        <div
          key={weather.num}
          style={{ color: weather.fontColor, backgroundColor: weather.bgColor }}
          className="w-[32%] h-[22vh] ml-[1%] rounded-3xl flex flex-wrap flex-col"
        >
          <div
            className="w-full h-[30%] bg-contain bg-left bg-no-repeat mt-20 ml-10"
            style={{ backgroundImage: `url(${weather.bgImage})` }}
          ></div>
          <div
            className="w-full text-left text-3xl font-bold my-10 ml-10 pl-5"
            style={{ borderLeft: `8px solid ${weather.borderColor}` }}
          >
            {weather.text_1}
          </div>
          <div className="w-full text-left text-4xl font-bold ml-10">{weather.text_2}</div>
        </div>
      ))}
    </div>
  )
}
