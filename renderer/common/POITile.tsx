import React from 'react'

type showSomething = (msg: string) => void

interface Props {
  showSomething: showSomething
}

export default function POITile(props: Props): React.JSX.Element {
  return (
    <>
      <div id="poiTileContainer" className="text-5xl font-bold p-4 m-4 rounded-lg">
        <div className="text-left">
          Häufig
          <br />
          gesucht.
        </div>
        <div className="btnInPoi" onClick={() => props.showSomething('3')}>
          <div id="btnImgInPoi_1"></div>Freifunk WLAN
        </div>
        <div className="btnInPoi" onClick={() => props.showSomething('3')}>
          <div id="btnImgInPoi_2"></div>Restaurants in Solingen
        </div>
        <div className="btnInPoi" onClick={() => props.showSomething('3')}>
          <div id="btnImgInPoi_3"></div>Hallo Welt
        </div>
      </div>
    </>
  )
}
