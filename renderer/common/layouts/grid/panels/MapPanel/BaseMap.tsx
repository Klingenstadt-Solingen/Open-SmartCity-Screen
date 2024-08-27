import React, { useEffect, useMemo, useRef, useState } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import TileWMS from 'ol/source/TileWMS.js'
import TileLayer from 'ol/layer/Tile'
import 'ol/ol.css'
import { Coordinate } from 'ol/coordinate'
import { POI } from '../../../../../models/poi'
import * as olProj from 'ol/proj.js'
import * as olGeom from 'ol/geom'
import * as olSource from 'ol/source'
import * as olLayer from 'ol/layer'
import * as olStyle from 'ol/style.js'
import * as ol from 'ol'
import Overlay from 'ol/Overlay'
import BubbleInfo from './BubbleInfo'
import { environment } from '../../../../../environment'

export default function BaseMap(
  props: {
    pois?: POI[]
    center?: Coordinate
    zoom?: number
    trip?: any
    tripTo?: any
    onPoiSelected?: (poi: any) => void
    showRoute?: boolean
    showInfo?: boolean
  },
  { children }
): React.JSX.Element {
  const { center, zoom } = props
  const mapElement = useRef()
  const [map, setMap] = useState<Map>()
  const [information, setInformation] = useState<any>()

  useEffect(() => {
    if (typeof map !== 'undefined') {
      if (typeof props.trip === 'undefined') {
        map
          .getLayers()
          .getArray()
          .filter((el) => el.get('name') === 'trip')
          .forEach((layer) => {
            map.removeLayer(layer)
          })
      } else {
        for (let i = 0; i < props.trip?.trips.length; i++) {
          const inter = props.trip?.trips[i]?.interchange?.coords?.map((c) => {
            return olProj.fromLonLat([c[1], c[0]])
          })
          const way = props.trip?.trips[i]?.coords?.map((c) => {
            return olProj.fromLonLat([c[1], c[0]])
          })

          drawLine(inter, 'red')
          drawLine(
            way,
            i % 2 === 0
              ? environment.primaryColor || '#004373'
              : environment.secondaryColor || '#0a7ac9'
          )
        }
      }
    }
  }, [props.trip])

  useEffect(() => {
    if (props.center && map) {
      const featureLine = new ol.Feature(new olGeom.Point(center))
      featureLine.setProperties({ poi: { details: [{ title: 'Sie Sind Hier' }] } })

      const youAreHereVector = new olSource.Vector({})
      youAreHereVector.addFeature(featureLine)

      const youAreHereLayer = new olLayer.Vector({
        zIndex: 20,
        properties: { name: 'youAreHere' },
        source: youAreHereVector,
        style: new olStyle.Style({
          image: new olStyle.Icon({
            src: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
            scale: 0.15
          })
        })
      })
      map.addLayer(youAreHereLayer)
    }
  }, [props.center, map])

  function drawLine(points: Coordinate[], color: string = environment.primaryColor || '#004373') {
    if (points?.length) {
      const featureLine = new ol.Feature(new olGeom.LineString(points))

      const vectorLine = new olSource.Vector({})
      vectorLine.addFeature(featureLine)

      const vectorLineLayer = new olLayer.Vector({
        zIndex: 10,
        source: vectorLine,
        properties: { name: 'trip' },
        style: new olStyle.Style({
          fill: new olStyle.Fill({ color: color }),
          stroke: new olStyle.Stroke({ color: color, width: 8 })
        })
      })

      map.addLayer(vectorLineLayer)
    }
  }

  useEffect(() => {
    setMap(
      new Map({
        target: mapElement.current,
        layers: [
          new TileLayer({
            properties: { name: 'base' },
            source: new TileWMS({
              serverType: 'geoserver',
              url: 'https://geodaten.metropoleruhr.de/spw2',
              params: {
                LAYERS: 'spw2_extralight'
              }
            })
          })
        ],
        view: new View({
          enableRotation: false,
          center: center,
          zoom: zoom ?? 14
        })
      })
    )
  }, [mapElement])

  useEffect(() => {
    if (typeof map !== 'undefined') {
      const overlay = new Overlay({})
      map.on('click', function (evt) {
        const coordinate = evt.coordinate
        const tmpContainer = document.getElementById('popupDiv')
        overlay.setElement(tmpContainer)
        overlay.setPositioning('center-center')
        overlay.setPosition(coordinate)
        map.addOverlay(overlay)

        const feature = map.forEachFeatureAtPixel(evt.pixel, (feature) => {
          return feature
        })
        const properties = feature?.getProperties()
        if (properties?.city) {
          setInformation(properties)
          map.getView().animate({
            center: coordinate,
            duration: 600
          })
          props.onPoiSelected?.(properties)
        } else {
          setInformation(undefined)
        }
      })
    }
  }, [map, props.onPoiSelected])

  const poiLayer = useMemo(() => {
    if (typeof props.pois !== 'undefined' && typeof map !== 'undefined') {
      const features = props.pois.map((poi) => {
        const { address, city, geopoint, details, objectId } = poi
        // poi-all gives stringified json in different form
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const latitude = geopoint._latitude || geopoint.latitude
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const longitude = geopoint._longitude || geopoint.longitude
        const point = new olGeom.Point(olProj.fromLonLat([longitude, latitude]))
        const feature = new ol.Feature({
          geometry: point,
          address: address,
          city: city,
          details: details,
          objectId: objectId
        })
        const definingDetail = details.find((detail) => detail.symbolName !== undefined)
        const symbolUrl =
          definingDetail?.symbolPath +
          '/' +
          definingDetail?.symbolName +
          definingDetail?.symbolMimetype
        if (symbolUrl) {
          feature.setStyle(
            new olStyle.Style({
              image: new olStyle.Icon({
                src: symbolUrl,
                scale: 1.5
              })
            })
          )
        }
        return feature
      })
      const vectorSource = new olSource.Vector({
        features: features
      })

      return new olLayer.Vector({
        zIndex: 20,
        source: vectorSource
      })
    }
  }, [props.pois, map])

  useEffect(() => {
    if (map && poiLayer) {
      setInformation(undefined)
      map?.addLayer(poiLayer)
      return () => {
        if (poiLayer) {
          map?.removeLayer(poiLayer)
        }
      }
    }
  }, [poiLayer])

  return (
    <div>
      <div id="popupDiv" className="w-fit min-w-[18rem] max-w-[36rem] grid">
        {information && props.showInfo && (
          <BubbleInfo tripTo={props.tripTo} information={information} showRoute={props.showRoute} />
        )}
      </div>
      <div className="w-full h-full" id="map" ref={mapElement}>
        {children}
      </div>
    </div>
  )
}
