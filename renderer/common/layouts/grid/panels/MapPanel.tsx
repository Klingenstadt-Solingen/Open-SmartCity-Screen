import React, { useEffect, useState } from 'react'

import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../../utils/dexie'

import * as mpapi from '@masterportal/masterportalapi'
import mapsAPI from '@masterportal/masterportalapi/src/maps/api.js'

import portalConfig from './configs/portal.json'
import services from './configs/services.json'

import { Style, Icon } from 'ol/style.js'
import { PoiCategory } from '../../../../models/poi-category'
import { POI } from '../../../../models/poi'

import Overlay from 'ol/Overlay.js'
import BubbleInfo from './BubbleInfo'

import Parse from 'parse'

import * as olProj from 'ol/proj.js'
import * as olGeom from 'ol/geom'
import * as olSource from 'ol/source'
import * as olLayer from 'ol/layer'
import * as olStyle from 'ol/style.js'
import * as ol from 'ol'
import { environment } from '../../../../environment'
import Close from '../../../icons/Close'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mpapi: any
  }
}

function styleWfs(feature) {
  if (feature?.values_?.poi?.details?.find((el) => el.title === 'Onlinestatus')) {
    const icon = new Style({
      image: new Icon({
        src:
          feature.values_.poi?.details.find((el) => el.title === 'Onlinestatus').symbolPath +
          '/' +
          feature.values_.poi?.details.find((el) => el.title === 'Onlinestatus').symbolName +
          feature.values_.poi?.details.find((el) => el.title === 'Onlinestatus').symbolMimetype,

        scale: 1.1,
        opacity: 1
      })
    })

    return [icon]
  } else {
    const icon = new Style({
      image: new Icon({
        src:
          feature.values_.symbolPath +
          '/' +
          feature.values_.symbolName +
          feature.values_.symbolMimetype,

        scale: 1.3,
        opacity: 1
      })
    })

    return [icon]
  }
}

function mapToLayers(pois: POI[], categories: PoiCategory[]) {
  const res = []
  for (const category of categories) {
    if (category.showCategory === 'true') {
      res.push({
        id: category.name,
        typ: 'GeoJSON',
        features: {
          type: 'FeatureCollection',
          features: pois
            .filter((poi) => poi.poiCategory === category.sourceId)
            .map((poi) => {
              return {
                type: 'Feature',
                properties: {
                  symbolPath: category.symbolPath,
                  symbolName: category.symbolName,
                  symbolMimetype: category.symbolMimetype,
                  iconPath: category.iconPath,
                  iconName: category.iconName,
                  iconMimetype: category.iconMimetype,
                  coordinates: [poi.geopoint.longitude, poi.geopoint.latitude],
                  poi: poi
                },
                geometry: {
                  type: 'Point',
                  coordinates: [poi.geopoint.longitude, poi.geopoint.latitude]
                }
              }
            })
        },
        style: styleWfs
      })
    }
  }

  return res
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function drawLine(points: any[], color: string = environment.primaryColor || '#004373') {
  if (points?.length) {
    for (let i = 0; i < points.length; i++) {
      points[i] = olProj.transform([points[i][1], points[i][0]], 'EPSG:4326', 'EPSG:25832')
    }

    const featureLine = new ol.Feature(new olGeom.LineString(points))

    const vectorLine = new olSource.Vector({})
    vectorLine.addFeature(featureLine)

    const vectorLineLayer = new olLayer.Vector({
      source: vectorLine,
      style: new olStyle.Style({
        fill: new olStyle.Fill({ color: color }),
        stroke: new olStyle.Stroke({ color: color, width: 5 })
      })
    })

    vectorLineLayer.setProperties({ name: 'trip' })

    mpapi.map.getLayers().forEach((layer) => {
      if (layer.get('id') !== 'base') {
        layer.setZIndex(1000)
      }
    })

    mpapi.map.addLayer(vectorLineLayer)
  }
}

export default function MapPanel({
  preSelected
}: {
  preSelected?: 'Übernachtung' | 'Freifunk' | 'Freizeit'
}): React.JSX.Element {
  const [first, setFirst] = useState(true)
  const [information, setInformation] = useState(undefined)
  const [trip, setTrip] = useState(undefined)

  const categories = useLiveQuery(async () => {
    return db.poiCategories.toArray()
  })

  const pois = useLiveQuery(async () => {
    return db.pois.toArray()
  })

  const screen = useLiveQuery(async () => {
    return db.screen.toCollection().first()
  })

  const [activeLayers, setActiveLayers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')

  const handleInputChange = () => (e) => {
    setSearchTerm(e.target.value)
  }

  useEffect(() => {
    if (searchTerm) {
      console.log('hi')
    }
  }, [searchTerm])

  const switchLayer = (layerName: string) => {
    if (activeLayers.includes(layerName)) {
      mpapi.map.removeLayer(
        mpapi.map.getAllLayers().find((layer) => layer.values_.id === layerName)
      )
      setActiveLayers(activeLayers.filter((layer) => layer !== layerName))
    } else {
      mpapi.map.addLayer(layerName)
      setActiveLayers([...activeLayers, layerName])
    }
  }

  function getTrip(
    from: { latitude: number; longitude: number },
    to: { latitude: number; longitude: number }
  ): Promise<[{ trips: [{ coords: [number]; interchange: { coords: [number] } }] }]> {
    return new Promise((resolve) => {
      Promise.all([
        Parse.Cloud.run(
          'pt-stop-nearby',
          { lat: from.latitude, lon: from.longitude },
          { useMasterKey: true }
        ),
        Parse.Cloud.run(
          'pt-stop-nearby',
          { lat: to.latitude, lon: to.longitude },
          { useMasterKey: true }
        )
      ]).then((a) => {
        Parse.Cloud.run(
          'pt-trip',
          {
            from: {
              geoPoint: '[' + from.latitude + ', ' + from.longitude + ']',
              stop: a[0].stops[0].properties.stopId
            },
            to: {
              geoPoint: '[' + to.latitude + ', ' + to.longitude + ']',
              stop: a[1].stops[0].properties.stopId
            }
          },
          { useMasterKey: true }
        ).then((a) => {
          resolve(a)
        })
      })
    })
  }

  useEffect(() => {
    if (screen) {
      const center = olProj.transform(
        [screen.location.longitude, screen.location.latitude],
        'EPSG:4326',
        'EPSG:25832'
      )

      mpapi.map.getView().setCenter(center)

      const featureLine = new ol.Feature(new olGeom.Point(center))
      featureLine.setProperties({ poi: { details: [{ title: 'Sie Sind Hier' }] } })

      const vectorLine = new olSource.Vector({})
      vectorLine.addFeature(featureLine)

      const vectorLineLayer = new olLayer.Vector({
        properties: { name: 'trip' },
        source: vectorLine,
        style: new olStyle.Style({
          image: new olStyle.Icon({
            src: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
            scale: 0.09
          })
        })
      })
      mpapi.map.addLayer(vectorLineLayer)
    }
  }, [screen])

  useEffect(() => {
    document.getElementById(portalConfig.target).innerHTML = ''

    if (categories && pois) {
      mpapi.map = mapsAPI.map.createMap(
        {
          ...portalConfig,
          layerConf: [...services, ...mapToLayers(pois, categories)]
        },
        '2D'
      )
      mpapi.map.addLayer('base')
      if (first && preSelected) {
        switchLayer(preSelected)
        setFirst(false)
      }
    } else {
      mpapi.map = mapsAPI.map.createMap(
        {
          ...portalConfig,
          layerConf: [...services],
          layers: null
        },
        '2D'
      )
      mpapi.map.addLayer('base')
    }

    const overlay = new Overlay({})

    mpapi.map.on('click', function (evt) {
      const coordinate = evt.coordinate
      const tmpContainer = document.getElementById('popupDiv')
      overlay.setElement(tmpContainer)
      overlay.setPositioning('center-center')
      overlay.setPosition(coordinate)
      mpapi.map.addOverlay(overlay)

      const feature = mpapi.map.forEachFeatureAtPixel(evt.pixel, (feature) => {
        return feature
      })

      if (feature?.values_?.poi) {
        setInformation(feature.values_)
        mpapi.map.getView().animate({
          center: coordinate,
          duration: 800
        })
      } else {
        setInformation(undefined)
      }
    })
  }, [categories, pois])

  function tripTo(longitude: number, latitude: number) {
    getTrip(
      { longitude: screen.location.longitude, latitude: screen.location.latitude },
      {
        longitude: longitude,
        latitude: latitude
      }
    ).then((a) => {
      for (let i = 0; i <= a[0]?.trips.length; i++) {
        setTrip(a[0])
        drawLine(a[0]?.trips[i]?.interchange?.coords, 'red')
        drawLine(
          a[0]?.trips[i]?.coords,
          i % 2 === 0
            ? environment.primaryColor || '#004373'
            : environment.secondaryColor || '#0a7ac9'
        )
      }
    })
  }

  return (
    <>
      <div
        id="popupDiv"
        className="w-fit min-w-[18rem] max-w-[36rem] grid"
        style={{ gridTemplateColumns: 'minmax(0, 4fr) minmax(0, 1fr)' }}
      >
        {information && <BubbleInfo tripTo={tripTo.bind(this)} information={information} />}
      </div>

      <div
        className="w-screen h-full grid"
        style={{ gridTemplateRows: 'auto minmax(0, min-content) minmax(0, min-content)' }}
      >
        <div
          className="h-full w-full grid grid-flow-col"
          style={{ gridTemplateColumns: '10fr auto' }}
        >
          <div className="h-full" id="map-div-id"></div>
          {trip && (
            <div className="flex flex-col p-10 bg-primary-color text-on-primary-color h-full w-[25rem] text-2xl">
              <div className="w-full h-min flex justify-between">
                <span className="text-4xl text-secondary-color font-bold">Reiseinfos:</span>
                <button
                  onMouseDown={() => {
                    mpapi.map
                      .getLayers()
                      .getArray()
                      .filter((el) => el.get('name') === 'trip')
                      .forEach((layer) => {
                        mpapi.map.removeLayer(layer)
                      })
                    setTrip(undefined)
                    setInformation(undefined)
                  }}
                  className="bg-gray-500 text-on-secondary-color bg-opacity-50 aspect-square h-full rounded-md"
                >
                  <Close
                    width="100%"
                    height="2rem"
                    fill={environment.onPrimaryColor || '#FFFFFF'}
                  ></Close>
                </button>
              </div>
              <div className="h-full grid grid-flow-row">
                {trip.trips.map((t, index) => {
                  return (
                    <>
                      <div className="w-full flex flex-row justify-between items-center">
                        <img
                          width="12%"
                          src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png"
                        ></img>
                        {t.origin.name}
                      </div>
                      <div className="py-10 px-5 h-full border-l-4 w-full ml-[1.2rem] flex flex-col items-start justify-around">
                        {t.duration && (
                          <span className="text-lg">Dauer: {Math.round(t.duration / 60)} Min.</span>
                        )}

                        {t.transportation && (
                          <span className="text-lg">{t.transportation.name}</span>
                        )}
                      </div>

                      {trip.trips.length === index + 1 ? (
                        <div className="w-full flex flex-row justify-between items-center">
                          <img
                            width="12%"
                            src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png"
                          ></img>
                          {t.destination?.name}
                        </div>
                      ) : (
                        <></>
                      )}
                    </>
                  )
                })}
              </div>
            </div>
          )}
        </div>
        <div className="bg-secondary-color text-3xl text-primary-color font-bold py-3 flex flex-row justify-center gap-14 items-center">
          <span>Was suchen Sie?</span>
          <div>
            <input
              onChange={handleInputChange()}
              className="w-[50vw] rounded-xl p-2"
              placeholder="Suchbegriff eingeben"
            ></input>
          </div>
        </div>
        {categories && (
          <div className="w-full h-full bg-primary-color flex overflow-x-scroll scrollbar-hide justify-around text-on-primary-color">
            <div className="h-full grid grid-flow-col items-around w-full py-4 overflow-normal">
              {categories.map((category, index) => {
                if (category.showCategory === 'true') {
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-center text-center w-40"
                      onMouseDown={() => {
                        switchLayer(category.name), setInformation(undefined)
                      }}
                    >
                      <img
                        draggable="false"
                        className={
                          activeLayers.includes(category.name)
                            ? 'rounded-full bg-secondary-color transition-all duration-300 aspect-square mb-4 h-24'
                            : 'rounded-full bg-background-color transition-all duration-300 aspect-square mb-4 opacity-70 h-24'
                        }
                        src={category.iconPath + '/' + category.iconName + category.iconMimetype}
                      ></img>
                      <div>
                        <div className="text-xl inline-block whitespace-nowrap w-full">
                          {category.mapTitle}&nbsp;
                          <span className="text-secondary-color">{'>'}</span>
                        </div>
                      </div>
                    </div>
                  )
                }
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
