import React from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../../utils/dexie'

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src
})

export default function MapPanel(): React.JSX.Element {
  const location = useLiveQuery(async () => {
    return (await db.screen.toCollection().first()).location
  })

  return (
    <>
      {location && (
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={16}
          scrollWheelZoom={true}
          className="w-full h-full"
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[location.latitude, location.longitude]}>
            <Popup>Solingen Zentrum</Popup>
          </Marker>
        </MapContainer>
      )}
    </>
  )
}
