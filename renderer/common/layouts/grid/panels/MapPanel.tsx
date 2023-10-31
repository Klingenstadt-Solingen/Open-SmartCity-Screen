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

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mpapi: any
  }
}

function styleWfs(feature) {
  const icon = new Style({
    image: new Icon({
      src:
        feature.values_.symbolPath +
        '/' +
        feature.values_.symbolName +
        feature.values_.symbolMimetype,

      scale: 0.85,
      opacity: 1
    })
  })

  return [icon]
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
                  symbolMimetype: category.symbolMimetype
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

export default function MapPanel({
  preSelected
}: {
  preSelected?: 'Übernachtung' | 'Freifunk' | 'Freizeit'
}): React.JSX.Element {
  const [first, setFirst] = useState(true)

  const categories = useLiveQuery(async () => {
    return await db.poiCategories.toArray()
  })

  const pois = useLiveQuery(async () => {
    return await db.pois.toArray()
  })

  const [activeLayers, setActiveLayers] = useState<string[]>([])

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

  useEffect(() => {
    // eslint-disable-next-line
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
  }, [categories, pois])

  return (
    <>
      <div className="h-full" id="map-div-id"></div>
      {categories && (
        <div className="absolute bg-primary-color bg-opacity-90 bottom-0 w-full text-on-primary-color py-[1%] h-40 flex">
          {categories.map((category, index) => {
            if (category.showCategory === 'true') {
              return (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center text-center w-full"
                  onClick={() => {
                    switchLayer(category.name)
                  }}
                >
                  <img
                    draggable="false"
                    className={
                      activeLayers.includes(category.name)
                        ? 'rounded-full bg-secondary-color transition-all duration-300 aspect-square mb-4 h-24'
                        : 'rounded-full bg-white transition-all duration-300 aspect-square mb-4 opacity-70 h-24'
                    }
                    src={category.iconPath + '/' + category.iconName + category.iconMimetype}
                  ></img>
                  <div>
                    <div className="text-xl inline-block whitespace-nowrap">
                      {category.mapTitle}&nbsp;
                      <span className="text-secondary-color">{'>'}</span>
                    </div>
                  </div>
                </div>
              )
            }
          })}
        </div>
      )}
    </>
  )
}
