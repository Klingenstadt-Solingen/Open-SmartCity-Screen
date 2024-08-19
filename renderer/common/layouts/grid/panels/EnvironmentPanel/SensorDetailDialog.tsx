import React, { CSSProperties, useCallback, useEffect, useState } from 'react'
import { EnvironmentSensor } from '../../../../../models/environmentSensor'
import Close from '../../../../icons/Close'
import { EnvironmentSensorType } from '../../../../../models/environmentSensorType'
import { useLiveQuery } from 'dexie-react-hooks'
import { EnvironmentLocale } from '../../../../../models/environmentLocale'
import { db } from '../../../../../utils/dexie'
import { Line } from 'react-chartjs-2'
import { EnvironmentSensorHistory } from '../../../../../models/environmentSensorHistory'
import dayjs from 'dayjs'
import 'chart.js/auto'
import { fetchSensorHistory } from '../../../../renderless/environment_sensor_history'
import { GridLoader } from 'react-spinners'

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto'
}

export default function SensorDetailDialog({
  sensor,
  sensorType,
  closeDialog
}: {
  sensor?: EnvironmentSensor
  sensorType?: EnvironmentSensorType
  closeDialog: () => void
}): React.JSX.Element {
  const locales: EnvironmentLocale[] = useLiveQuery(() => db.environmentLocales.toArray())
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState<boolean>(true)

  const getChartDataForSensor = useCallback(
    async (sensor) => {
      if (!sensor) return null
      setLoading(true)

      const historicalData: EnvironmentSensorHistory[] = await fetchSensorHistory(sensor.refId)

      if (!historicalData || !historicalData.length) {
        setLoading(false)

        return {
          labels: [],
          datasets: [
            {
              label: 'Keine Daten vorhanden',
              data: [],
              borderColor: 'rgba(0,67,115,1)',
              backgroundColor: 'rgba(0,67,115,0.6)',
              fill: true
            }
          ]
        }
      }

      const sortedData = historicalData.sort(
        (a, b) => new Date(a.observedAt.iso).getTime() - new Date(b.observedAt.iso).getTime()
      )

      const labels = sortedData.map((data) => dayjs(data.observedAt.iso).format('HH:mm'))
      const data = sortedData.map((data) => data.value)
      setLoading(false)

      return {
        labels: labels,
        datasets: [
          {
            data: data,
            borderColor: 'rgba(0,67,115,0.4)',
            backgroundColor: 'rgba(0,67,115,0.75)',
            fill: true,
            pointStyle: 'circle',
            pointRadius: 4,
            pointHoverRadius: 8,
            lineTension: 0.25
          }
        ]
      }
    },
    [locales]
  )

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        displayColors: false
      },
      title: {
        color: 'rgba(0,69,124,1)'
      }
    }
  }

  useEffect(() => {
    if (sensor) {
      getChartDataForSensor(sensor).then((data) => setChartData(data))
    }
  }, [sensor, getChartDataForSensor])

  return (
    <>
      {locales && (
        <dialog
          className="w-full h-full absolute top-0 left-0 flex justify-center items-center bg-black bg-opacity-20 backdrop-blur-sm p-20"
          style={{
            zIndex: `${sensor ? 50 : -1}`
          }}
          onClick={() => closeDialog()}
        >
          <div
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
            className="bg-background-color-dark rounded-3xl z-50 transition:all duration-300 ease-in-out py-7 px-14 drop-shadow-2xl flex flex-col gap-y-5 overflow-hidden container"
            style={{
              minWidth: `${sensor ? '50%' : '0px'}`,
              minHeight: `${sensor ? '50%' : '0px'}`,
              maxHeight: `${sensor ? '100%' : '0px'}`
            }}
          >
            <button
              className="fixed top-7 right-7 bg-background-color-dark"
              onClick={() => {
                closeDialog()
              }}
            >
              <Close width="2rem" height="2rem" />
            </button>
            <div id="title" className="w-full flex items-center justify-center">
              <div className="text-3xl font-bold">
                {locales.find((a) => a.key === sensorType?.name)?.value || sensorType?.name}
              </div>
            </div>
            <div className="text-left">
              {locales.find((a) => a.key === sensorType?.definition)?.value ||
                sensorType?.definition}
            </div>
            {loading ? (
              <GridLoader color="orange" cssOverride={override} />
            ) : (
              chartData && (
                <Line
                  data={chartData}
                  options={options}
                  aria-label={'Graph für ' + sensorType?.name}
                />
              )
            )}
          </div>
        </dialog>
      )}
    </>
  )
}
