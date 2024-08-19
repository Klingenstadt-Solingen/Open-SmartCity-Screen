import React, { useCallback, useMemo, useState } from 'react'
import { environment } from '../../../../../environment'
import { EnvironmentCategory } from '../../../../../models/environmentCategory'
import { db } from '../../../../../utils/dexie'

import 'ol/ol.css'
import * as olProj from 'ol/proj.js'
import { EnvironmentStation } from '../../../../../models/environmentStation'
import { EnvironmentSensor } from '../../../../../models/environmentSensor'
import { EnvironmentSensorType } from '../../../../../models/environmentSensorType'
import { EnvironmentIcon } from '../../../../../models/environmentIcon'
import { EnvironmentSubCategory } from '../../../../../models/environmentSubCategory'
import { Screen } from '../../../../../models/screen'
import { EnvironmentLocale } from '../../../../../models/environmentLocale'
import BaseMap from '../MapPanel/BaseMap'
import SensorDetailDialog from './SensorDetailDialog'
import { useLiveQuery } from 'dexie-react-hooks'
import { POI } from '../../../../../models/poi'

export default function EnvironmentPanel(props: {
  category: EnvironmentCategory
}): React.JSX.Element {
  const [selectedCategory, selectCategory] = React.useState<EnvironmentCategory | null>(
    props.category
  )
  const [selectedStation, selectStation] = React.useState<EnvironmentStation | null>(null)
  const [sensorDetails, setSensorDetails] = useState(undefined)

  const categories: EnvironmentCategory[] = useLiveQuery(() => db.environmentCategories.toArray())
  const locales: EnvironmentLocale[] = useLiveQuery(() => db.environmentLocales.toArray())
  const screen: Screen = useLiveQuery(() => db.screen.toCollection().first())
  const subCategories: EnvironmentSubCategory[] = useLiveQuery(
    () => db.environmentSubCategories.where('category').equals(selectedCategory?.id).toArray(),
    [selectedCategory]
  )
  const sensorTypes: EnvironmentSensorType[] = useLiveQuery(
    () =>
      subCategories &&
      db.environmentSensorTypes
        .where('subCategory')
        .anyOfIgnoreCase(subCategories.map((a) => a.id))
        .sortBy('order'),
    [subCategories]
  )
  const sensors: EnvironmentSensor[] = useLiveQuery(
    () =>
      sensorTypes &&
      db.environmentSensors
        .where('sensorType')
        .anyOf(sensorTypes.map((a) => a.id))
        .toArray(),
    [sensorTypes]
  )

  const stations: EnvironmentStation[] = useLiveQuery(
    () =>
      sensors &&
      db.environmentStations
        .where('objectId')
        .anyOfIgnoreCase(sensors.map((a) => a.station as string))
        .toArray(),
    [sensors]
  )

  const icons: EnvironmentIcon[] = useLiveQuery(() => db.environmentIcons.toArray())

  const currentSensors = useMemo(() => {
    const filteredSensors = sensors?.filter(
      (sensor) => (sensor.station as string) === selectedStation?.objectId
    )
    if (selectedStation && filteredSensors.length) {
      return filteredSensors
    } else if (stations?.length) selectStation(stations[0])
  }, [selectedStation, sensors, selectedCategory, stations])

  const onPoiSelected = useCallback(
    (poi: POI) => {
      selectStation(stations.find((station) => station.poi.objectId === poi.objectId) || null)
    },
    [stations]
  )

  const pois = useMemo(() => {
    if (stations) {
      return stations.map((station) => {
        return station.poi
      })
    }
  }, [stations])

  if (
    typeof screen !== 'undefined' &&
    typeof categories !== 'undefined' &&
    typeof stations !== 'undefined' &&
    typeof pois !== 'undefined'
  ) {
    return (
      <>
        <SensorDetailDialog
          sensor={sensorDetails}
          sensorType={sensorTypes.find((type) => type.id === sensorDetails?.sensorType)}
          closeDialog={() => setSensorDetails(undefined)}
        ></SensorDetailDialog>
        <div className="break-words text-left h-full flex flex-col pb-8 pt-4 px-16 gap-y-4 bg-white">
          <div className="break-words text-center text-primary-color text-5xl font-bold">
            <span className="flex w-full justify-center items-center gap-x-4">
              <div
                className="grid grid-flow-row"
                style={{ gridTemplateRows: 'minmax(0, 1fr) auto minmax(0, 1fr' }}
              >
                <button
                  onClick={() => {
                    const i = categories.findIndex((c) => c.id === selectedCategory.id)
                    const a = i === 0 ? categories.length - 1 : i - 1
                    selectCategory(categories[a])
                  }}
                  className="flex items-center w-full justify-center"
                >
                  <img src="/images/svg/arrow_up.svg" />
                </button>
                <div className="w-full font-extrabold">
                  {locales.find((l) => l.key === selectedCategory.name)?.value ||
                    selectedCategory.name}
                </div>
                <button
                  onClick={() => {
                    const i = categories.findIndex((c) => c.id === selectedCategory.id)
                    const a = i === categories.length - 1 ? 0 : i + 1
                    selectCategory(categories[a])
                  }}
                  className="flex items-center w-full justify-center"
                >
                  <img src="/images/svg/arrow_down.svg" />
                </button>
              </div>
              <div> in {environment.cityName || 'Solingen'}</div>
            </span>
          </div>
          <div className="w-full min-h-[35%] grid z-20 rounded-xl overflow-hidden border-gray-300 border-4">
            <BaseMap
              center={olProj.fromLonLat([screen.location.longitude, screen.location.latitude])}
              zoom={16}
              pois={pois}
              onPoiSelected={onPoiSelected}
              showInfo={false}
            />
          </div>
          {selectedStation && <p className="text-4xl font-bold">{selectedStation.name}</p>}
          {currentSensors?.length && (
            <div className="grid md:grid-cols-4 sm:grid-cols-3 lg:grid-cols-5 gap-4 overflow-y-scroll p-1">
              {currentSensors.map((sensor, index) => {
                return (
                  <button
                    onClick={() => {
                      setSensorDetails(sensor)
                    }}
                    key={index}
                    className="bg-background-color-dark shadow-md shadow-gray-500 aspect-square text-black rounded-lg p-4 flex flex-col justify-between text-left overflow-clip max-h-40 mx-auto"
                  >
                    <div className="flex justify-between text-primary-color font-bold text-2xl w-full">
                      <img
                        src={
                          icons.find(
                            (icon) =>
                              icon.objectId ===
                              sensorTypes.find((type) => type.id === sensor.sensorType)?.icon.id
                          )?.icon.url
                        }
                        alt="icon"
                        className="h-8 w-8"
                      />
                      <span>{sensorTypes.find((type) => type.id === sensor.sensorType)?.unit}</span>
                    </div>
                    <div className="text-primary-color">
                      <div className="text-2xl font-extrabold">{sensor.value}</div>
                      <div className="font-bold text-md break-all whitespace-pre-line line-clamp-1">
                        {locales.find(
                          (l) =>
                            l.key ===
                            sensorTypes.find((type) => type.id === sensor.sensorType)?.name
                        )?.value || sensorTypes.find((type) => type.id === sensor.sensorType)?.type}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </>
    )
  } else {
    return (
      <div>
        <p>Lade...</p>
      </div>
    )
  }
}
