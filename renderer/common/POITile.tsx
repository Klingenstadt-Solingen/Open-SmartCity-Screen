import React from 'react'

type showSomething = (msg: string) => void

interface Props {
  showSomething: showSomething
}

export default function POITile(props: Props): React.JSX.Element {
  return (
    <>
<<<<<<< HEAD
      <div id="poiTileContainer" className="p-8 m-5 rounded-lg">
        <div className="ml-4 text-left tracking-wide text-6xl font-bold">
=======
      <div id="poiTileContainer" className="text-5xl font-bold p-4 rounded-lg">
        <div className="text-left">
>>>>>>> e1ca987 (fix(4x Tiles): CSS-Bugs)
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
