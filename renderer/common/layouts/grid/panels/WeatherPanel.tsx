import React from 'react'
import { Weather } from '../../../../models/weather'
import Temperature from '../../../icons/Temperature'
import UV from '../../../icons/UV'
import { environment } from '../../../../environment'
import Rain from '../../../icons/Rain'
import Moisture from '../../../icons/Moisture'
import AirPressure from '../../../icons/AirPressure'

export default function WeatherPanel(props: { weather: Weather }): React.JSX.Element {
  console.log(props.weather)
  return (
    <div className="text-left w-full bg-background-color h-full grow flex flex-col p-16">
      <div className="text-center w-full mb-36 text-6xl text-primary-color font-bold">
        Wetter <span>{props.weather?.shortName}</span>
      </div>
      <div className="h-full flex justify-center">
        <div className="h-2/3 gap-8 w-4/5 grid grid-cols-3 grid-rows-2">
          <div className="pl-[10%] rounded-3xl bg-secondary-color w-full h-full col-span-2 flex items-center">
            <Temperature height="80%"></Temperature>
            <div className="ml-[10%] text-4xl flex flex-col items-start gap-4 text-primary-color">
              <span className="border-primary-color border-l-[10px] pl-4 font-bold">
                Temperatur
              </span>
              <div>
                <span className="text-6xl font-bold ">
                  {props.weather.values?.lufttemperatur?.value}
                </span>
                <span className="font-thin text-6xl align-top">
                  {props.weather.values?.lufttemperatur?.unit}
                </span>
              </div>
              <span>
                zuletzt aktualisiert am{' '}
                {new Intl.DateTimeFormat('de-DE').format(new Date(props.weather.dateObserved?.iso))}
              </span>
            </div>
          </div>
          <div className="pl-[10%] w-full flex items-center rounded-3xl h-full bg-background-color-dark">
            <UV height="50%" fill={environment.primaryColor || '#004373'}></UV>
            <div className="ml-[10%] text-4xl flex flex-col items-start gap-4 text-primary-color">
              <span className="border-primary-color border-l-[10px] pl-4 font-bold">UV-Licht</span>
              <div>
                <span className="text-5xl font-bold ">
                  {props.weather.values?.globalstrahlung?.value}
                </span>
                <span className="font-thin text-5xl align-top">
                  {props.weather.values?.globalstrahlung?.unit}
                </span>
              </div>
            </div>
          </div>
          <div className="pl-[10%] w-full flex items-center rounded-3xl h-full bg-primary-color bg-opacity-70">
            <Rain fill={environment.onPrimaryColor || '#FFFFFF'}></Rain>
            <div className="ml-[10%] text-4xl flex flex-col items-start gap-4 text-on-primary-color">
              <span className="border-on-primary-color border-l-[10px] pl-4 font-bold">
                Niederschlag
              </span>
              <div>
                <span className="text-5xl font-bold ">
                  {props.weather.values?.niederschlagsintensitaet?.value}
                </span>
                <span className="font-thin text-5xl align-top">
                  {props.weather.values?.niederschlagsintensitaet?.unit}
                </span>
              </div>
            </div>
          </div>
          <div className="pl-[10%] w-full flex items-center rounded-3xl h-full bg-background-color-dark">
            <Moisture fill={environment.primaryColor || '#004373'}></Moisture>
            <div className="ml-[10%] text-4xl flex flex-col items-start gap-4 text-primary-color">
              <span className="border-primary-color border-l-[10px] pl-4 font-bold">
                Luftfeuchtigkeit
              </span>
              <div>
                <span className="text-5xl font-bold ">
                  {props.weather.values?.relative_luftfeuchte?.value}
                </span>
                <span className="font-thin text-5xl align-top">
                  {props.weather.values?.relative_luftfeuchte?.unit}
                </span>
              </div>
            </div>
          </div>
          <div className="pl-[10%] w-full flex items-center rounded-3xl h-full bg-background-color-dark">
            <AirPressure fill={environment.primaryColor || '#004373'}></AirPressure>
            <div className="ml-[10%] text-4xl flex flex-col items-start gap-4 text-primary-color">
              <span className="border-primary-color border-l-[10px] pl-4 font-bold">Luftdruck</span>
              <div>
                <span className="text-5xl font-bold ">
                  {props.weather.values?.realtiver_luftdruck?.value}
                </span>
                <span className="font-thin text-5xl align-top">
                  {props.weather.values?.realtiver_luftdruck?.unit}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
