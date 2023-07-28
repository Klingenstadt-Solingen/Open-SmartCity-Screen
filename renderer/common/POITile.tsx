import React from 'react'

type showSomething = (msg: string) => void

interface Props {
  showSomething: showSomething
}

export default function POITile(props: Props): React.JSX.Element {
  return (
    <>
      <div id="poiTileContainer" className="p-8 m-5 rounded-lg">
        <div className="ml-4 text-left tracking-wide text-6xl font-bold">
          Häufig
          <br />
          gesucht.
        </div>
        <button className="btnInPoi text-3xl" onClick={() => props.showSomething('3')}>
          <div id="btnImgInPoi_1"></div>Freifunk WLAN
        </button>
        <button className="btnInPoi text-3xl" onClick={() => props.showSomething('3')}>
          <div id="btnImgInPoi_2"></div>Restaurants in Solingen
        </button>
        <button className="btnInPoi text-3xl" onClick={() => props.showSomething('3')}>
          <div id="btnImgInPoi_3"></div>Hallo Welt
        </button>
      </div>
    </>
  )
}
