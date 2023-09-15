import React from 'react'
import PressReleaseTile from './PressReleaseTile'
import MapTile from './MapTile'
import POITile from './POITile'
import WeatherTile from './WeatherTile'
import { Tile } from '../../../../models/tile'
import ImageTile from '../../diashow/tiles/ImageTile'

interface Props {
  isOpen: boolean
  position: number
  setCenter: (panel: React.JSX.Element) => void
  tile: Tile
}

export default function BaseTile(props: Props): React.JSX.Element {
  let tile: React.JSX.Element

  switch (props.tile.tileType.name) {
    case 'MAP':
      tile = <MapTile setCenter={props.setCenter} isOpen={props.isOpen} tilePos={props.position} />
      break
    case 'PRESSRELEASES':
      tile = (
        <PressReleaseTile
          setCenter={props.setCenter}
          isOpen={props.isOpen}
          tilePos={props.position}
        />
      )
      break
    case 'POI':
      tile = <POITile setCenter={props.setCenter} isOpen={props.isOpen} tilePos={props.position} />
      break
    case 'WEATHER':
      tile = (
        <WeatherTile setCenter={props.setCenter} isOpen={props.isOpen} tilePos={props.position} />
      )
      break
    case 'DIASHOW':
      tile = <ImageTile />
      break
  }

  return (
    <div
      id={props.position.toString()}
      className="z-10 text-center w-full h-full flex bg-white transition-[filter] duration-solingen-speed"
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
