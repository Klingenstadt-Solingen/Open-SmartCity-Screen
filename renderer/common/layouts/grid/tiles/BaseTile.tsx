import React from 'react'
import PressReleaseTile from './PressReleaseTile'
import MapTile from './MapTile'
import POITile from './POITile'
import WeatherTile from './WeatherTile'
import { Tile } from '../../../../models/tile'
import ImageTile from '../../diashow/tiles/ImageTile'
import BusDepartureTile from './BusDepartureTile'
import BusScheduleTile from './BusScheduleTile'
import BobTile from './BobTile'
import EnvironmentTile from './EnvironmentTile'
import PersonTile from './PersonTile'
import ServiceTile from './ServiceTile'
import SearchTile from './SearchTile'
import RoomBookingTile from './RoomBookingTile'

interface Props {
  isOpen: boolean
  position: number
  setCenter: (panel: React.JSX.Element) => void
  tile: Tile
  accessabilityCode: number
}

export default function BaseTile(props: Props): React.JSX.Element {
  let tile: React.JSX.Element

  switch (props.tile.tile.tileType.name) {
    case 'Karte':
      tile = (
        <MapTile
          setCenter={props.setCenter}
          isOpen={props.isOpen}
          tilePos={props.position}
          accessabilityCode={props.accessabilityCode}
        />
      )
      break
    case 'Pressemitteilungen':
      tile = (
        <PressReleaseTile
          setCenter={props.setCenter}
          isOpen={props.isOpen}
          tilePos={props.position}
          accessabilityCode={props.accessabilityCode}
        />
      )
      break
    case 'POIs':
      tile = (
        <POITile
          setCenter={props.setCenter}
          isOpen={props.isOpen}
          tilePos={props.position}
          accessabilityCode={props.accessabilityCode}
        />
      )
      break
    case 'Wetter':
      tile = (
        <WeatherTile
          setCenter={props.setCenter}
          isOpen={props.isOpen}
          tilePos={props.position}
          accessabilityCode={props.accessabilityCode}
        />
      )
      break
    case 'Busabfahrten':
      tile = <BusDepartureTile isOpen={props.isOpen} />
      break
    case 'Aushangsfahrplan':
      tile = <BusScheduleTile setCenter={props.setCenter} isOpen={props.isOpen} />
      break
    case 'Diashow':
      tile = <ImageTile layoutDiashow={false} setCenter={props.setCenter} isOpen={props.isOpen} />
      break
    case 'Bob':
      tile = <BobTile />
      break
    case 'Umwelt':
      tile = (
        <EnvironmentTile
          setCenter={props.setCenter}
          isOpen={props.isOpen}
          tilePos={props.position}
          accessabilityCode={props.accessabilityCode}
        />
      )
      break
    case 'Personen':
      tile = (
        <PersonTile
          setCenter={props.setCenter}
          isOpen={props.isOpen}
          accessabilityCode={props.accessabilityCode}
          tilePos={props.position}
        />
      )
      break
    case 'Diensleistungen':
      tile = (
        <ServiceTile
          setCenter={props.setCenter}
          isOpen={props.isOpen}
          accessabilityCode={props.accessabilityCode}
          tilePos={props.position}
        />
      )
      break
    case 'HCMS-Suche':
      tile = (
        <SearchTile
          setCenter={props.setCenter}
          isOpen={props.isOpen}
          accessabilityCode={props.accessabilityCode}
          tilePos={props.position}
        />
      )
      break
    case 'Raumbuchung':
      tile = (
        <RoomBookingTile
          setCenter={props.setCenter}
          isOpen={props.isOpen}
          accessabilityCode={props.accessabilityCode}
          tilePos={props.position}
        />
      )
      break
  }

  return (
    <div
      id={props.position.toString()}
      className="z-10 text-center w-full h-full flex bg-background-color transition-[filter] duration-app-speed"
      style={
        props.isOpen
          ? { order: props.position, filter: 'grayscale(35%) brightness(0.45)' }
          : { order: props.position, filter: 'grayscale(0%) brightness(1)' }
      }
    >
      {tile}
    </div>
  )
}
