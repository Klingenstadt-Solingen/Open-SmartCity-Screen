import React, { useMemo } from 'react'
import 'leaflet/dist/leaflet.css'
import dynamic from 'next/dynamic'

interface Props {
  openStatus: boolean
  contentInCenter: string
}

export default function ContentCenter(props: Props): React.JSX.Element {
  function handleClick(e: React.FormEvent): void {
    e.stopPropagation()
  }

  //useMemo bc the react-leaflet component is not compatible with nextJS otherwise
  const Map = useMemo(
    () =>
      dynamic(() => import('./Map'), {
        ssr: false
      }),
    []
  )

  return (
    <div onClick={(e) => handleClick(e)} id="content_center_area" style={props.openStatus ? { zIndex: '0' } : {}}>
      {props.openStatus && <h1>{props.contentInCenter}</h1>}
      {props.contentInCenter === '1' && <Map />}
    </div>
  )
}
