import React from 'react'
import PressReleaseTile from './PressReleaseTile'
import MapTile from './MapTile'
import POITile from './POITile'
import WeatherTile from './WeatherTile'
import { TileType } from '../../../../models/tile'
import ImageTile from '../../diashow/tiles/ImageTile'
import { imagesInfo } from '../../../../models/imagesInfo'
interface Props {
  isOpen: boolean
  position: number
  setCenter: (panel: React.JSX.Element) => void
  type: TileType
}

export default function BaseTile(props: Props): React.JSX.Element {
  let cssAnimation: React.CSSProperties
  let tile: React.JSX.Element
  const closeTopAnimation = { animation: 'closeAnimation 0.5s ease 0s 1 forwards' }
  const closeBottomAnimation = { animation: 'closeAnimation 0.5s ease 0s 1 forwards' }
  const openTopAnimation = { animation: 'openTopAnimation 0.5s ease 0s 1 forwards' }
  const openBottomAnimation = { animation: 'openBottomAnimation 0.5s ease 0s 1 forwards' }

  if (props.isOpen) {
    if (props.position < 3) {
      cssAnimation = { ...openTopAnimation }
    } else {
      cssAnimation = { ...openBottomAnimation }
    }
  } else {
    if (props.position < 3) {
      cssAnimation = { ...{ marginTop: '-28vh' }, ...closeTopAnimation }
    } else {
      cssAnimation = { ...{ marginTop: '56vh' }, ...closeBottomAnimation }
    }
  }

  switch (props.type.name) {
    case 'MAP':
      tile = <MapTile setCenter={props.setCenter} />
      break
    case 'PRESSRELEASES':
      tile = <PressReleaseTile setCenter={props.setCenter} />
      break
    case 'POI':
      tile = <POITile setCenter={props.setCenter} />
      break
    case 'WEATHER':
      tile = <WeatherTile setCenter={props.setCenter} />
      break
    case 'DIASHOW':
      tile = (
        <ImageTile
          ImageGroup={imagesInfo}
          dimensionImageTile={'w-[50vw] h-[50vh]'}
          setCenter={props.setCenter}
          isOpen={props.isOpen}
          dimensionForPdf={{
            docCptSize: 'w-[50vw]',
            pdfScale: 0.6
          }}
        />
      )
      break
  }

  return (
    <div
      id={props.type.name}
      className="z-10 text-center w-[50vw] h-[50vh] flex bg-white"
      style={{ order: props.position, ...cssAnimation }}
    >
      {tile}
    </div>
  )
}
