import React from 'react'
import { Weather } from '../../../../models/weather'
import Temperature from '../../../icons/Temperature'
import UV from '../../../icons/UV'
import { environment } from '../../../../environment'
import Rain from '../../../icons/Rain'
import Moisture from '../../../icons/Moisture'
import AirPressure from '../../../icons/AirPressure'

export default function WeatherPanel(props: { weather: Weather }): React.JSX.Element {
  return (
    <>
      <div className="break-words text-left h-full flex flex-col p-12">
        <div className="break-words  text-center text-primary-color text-7xl font-bold">
          Wetter {props.weather?.shortName}
        </div>
        <div className="break-words h-full overflow-hidden flex justify-center items-center">
          <div className="break-words gap-8 container grid grid-cols-3 grid-rows-2 w-full">
            <div
              className="break-words p-6 box-border grid justify-center items-center w-full rounded-3xl bg-secondary-color col-span-2 gap-5"
              style={{ gridTemplateColumns: '1fr 2fr' }}
            >
              <div className="break-words flex items-center justify-center ">
                <Temperature height="20rem"></Temperature>
              </div>
              <div className="break-words text-3xl flex flex-col items-start gap-5 text-primary-color">
                <span className="break-words border-primary-color border-l-[10px] pl-4 font-bold">
                  Temperatur
                </span>
                <div>
                  <span className="break-words text-5xl font-bold ">
                    {props.weather.values?.lufttemperatur?.value.toFixed(1)}
                  </span>
                  <wbr />
                  <span className="break-words font-thin text-5xl align-top">
                    {props.weather.values?.lufttemperatur?.unit}
                  </span>
                </div>
                <span>
                  zuletzt aktualisiert am{' '}
                  {new Intl.DateTimeFormat('de-DE').format(
                    new Date(props.weather.dateObserved?.iso)
                  )}
                </span>
              </div>
            </div>

            <div className="break-words p-5 text-left h-full flex flex-wrap overflow-hidden justify-center items-center w-full rounded-3xl bg-background-color-dark gap-5">
              <div className="break-words flex items-center justify-center">
                <UV height="auto" width="40%" fill={environment.primaryColor || '#004373'}></UV>
              </div>
              <div className="break-words text-2xl flex flex-col items-start gap-5 text-primary-color">
                <span className="break-words border-primary-color font-bold">UV-Licht</span>
                <div>
                  <span className="break-words text-4xl font-bold">
                    {props.weather.values?.globalstrahlung?.value}
                  </span>
                  <wbr />
                  <span className="break-words font-thin text-4xl align-top">
                    {props.weather.values?.globalstrahlung?.unit}
                  </span>
                </div>
              </div>
            </div>
            <div className="break-words p-5 text-left h-full flex flex-wrap overflow-hidden justify-center items-center w-full rounded-3xl gap-5 bg-primary-color bg-opacity-70">
              <div className="break-words flex items-center justify-center">
                <Rain
                  height="auto"
                  width="40%"
                  fill={environment.onPrimaryColor || '#FFFFFF'}
                ></Rain>
              </div>
              <div className="break-words text-2xl flex flex-col items-start gap-5 text-on-primary-color">
                <span className="break-words border-on-primary-color font-bold">Niederschlag</span>
                <div>
                  <span className="break-words text-4xl font-bold">
                    {props.weather.values?.niederschlagsintensitaet?.value}
                  </span>
                  <wbr />
                  <span className="break-words font-thin text-4xl align-top">
                    {props.weather.values?.niederschlagsintensitaet?.unit}
                  </span>
                </div>
              </div>
            </div>
            <div className="break-words p-5 text-left h-full flex flex-wrap overflow-hidden justify-center items-center w-full rounded-3xl gap-5 bg-background-color-dark">
              <div className="break-words flex items-center justify-center">
                <Moisture
                  height="auto"
                  width="40%"
                  fill={environment.primaryColor || '#004373'}
                ></Moisture>
              </div>
              <div className="break-words text-2xl flex flex-col items-start gap-5 text-primary-color">
                <span className="break-words border-primary-color font-bold">Luftfeuchtigkeit</span>
                <div>
                  <span className="break-words text-4xl font-bold">
                    {props.weather.values?.relative_luftfeuchte?.value}
                  </span>
                  <wbr />
                  <span className="break-words font-thin text-4xl align-top">
                    {props.weather.values?.relative_luftfeuchte?.unit}
                  </span>
                </div>
              </div>
            </div>
            <div className="break-words p-5 text-left h-full flex flex-wrap overflow-hidden justify-center items-center w-full rounded-3xl gap-5 bg-background-color-dark">
              <div className="break-words flex items-center justify-center">
                <AirPressure
                  height="auto"
                  width="40%"
                  fill={environment.primaryColor || '#004373'}
                ></AirPressure>
              </div>
              <div className="break-words text-2xl flex flex-col items-start gap-5 text-primary-color">
                <span className="break-words border-primary-color font-bold">Luftdruck</span>
                <div>
                  <span className="break-words text-4xl font-bold">
                    {props.weather.values?.realtiver_luftdruck?.value}
                  </span>
                  <wbr />
                  <span className="break-words font-thin text-4xl align-top">
                    {props.weather.values?.realtiver_luftdruck?.unit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
