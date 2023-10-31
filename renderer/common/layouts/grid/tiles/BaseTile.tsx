import React from 'react'
import PressReleaseTile from './PressReleaseTile'
import MapTile from './MapTile'
import POITile from './POITile'
import WeatherTile from './WeatherTile'
import { Tile } from '../../../../models/tile'
import ImageTile from '../../diashow/tiles/ImageTile'
import BusTileDeparture from './BusTileDeparture'
import BusTileSchedule from './BusTileSchedule'
import BobTile from './BobTile'

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
    case 'MAP':
      tile = (
        <MapTile
          setCenter={props.setCenter}
          isOpen={props.isOpen}
          tilePos={props.position}
          accessabilityCode={props.accessabilityCode}
        />
      )
      break
    case 'PRESSRELEASES':
      tile = (
        <PressReleaseTile
          setCenter={props.setCenter}
          isOpen={props.isOpen}
          tilePos={props.position}
          accessabilityCode={props.accessabilityCode}
        />
      )
      break
    case 'POI':
      tile = (
        <POITile
          setCenter={props.setCenter}
          isOpen={props.isOpen}
          tilePos={props.position}
          accessabilityCode={props.accessabilityCode}
        />
      )
      break
    case 'WEATHER':
      tile = (
        <WeatherTile
          setCenter={props.setCenter}
          isOpen={props.isOpen}
          tilePos={props.position}
          accessabilityCode={props.accessabilityCode}
        />
      )
      break
    case 'BUSDEPARTURE':
      tile = <BusTileDeparture isOpen={props.isOpen} />
      break
    case 'BUSSCHEDULE':
      tile = <BusTileSchedule setCenter={props.setCenter} isOpen={props.isOpen} />
      break
    case 'DIASHOW':
      tile = <ImageTile layoutDiashow={false} setCenter={props.setCenter} isOpen={props.isOpen} />
      break
    case 'BOB':
      tile = <BobTile />
      break
  }

  return (
    <div
      id={props.position.toString()}
      className="z-10 text-center w-full h-full flex bg-white transition-[filter] duration-app-speed"
      style={
        props.isOpen
          ? { order: props.position, filter: 'blur(1px) grayscale(25%) brightness(0.65)' }
          : { order: props.position, filter: 'blur(0px) grayscale(0%) brightness(1)' }
      }
    >
      {tile}
    </div>
  )
}
