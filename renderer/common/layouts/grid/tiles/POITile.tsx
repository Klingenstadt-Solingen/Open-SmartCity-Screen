import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'

type setCenter = (panel: React.JSX.Element) => void

interface Props {
  setCenter: setCenter
}

export default function POITile(props: Props): React.JSX.Element {
  const Map = useMemo(
    () =>
      dynamic(() => import('../panels/MapPanel'), {
        ssr: false
      }),
    []
  )
  return (
    <div className="h-full w-full p-6">
      <div className="bg-[#f2f2f2] p-6 rounded-lg text-solingen-blue w-full h-full flex flex-col">
        <div className="ml-4 text-left tracking-wide text-6xl font-bold mb-11 h-1/4">
          Häufig
          <br />
          gesucht.
        </div>
        <div className="w-full flex flex-col justify-between h-full text-white font-medium">
          <button
            className="text-3xl bg-solingen-blue rounded-xl h-[30%] p-5 flex flex-col justify-between"
            onClick={() => props.setCenter(<Map></Map>)}
          >
            <div id="btnImgInPoi_1" className="w-full h-full max-w-[55%] max-h-[55%]"></div>
            <div className="w-full text-right">Freifunk WLAN</div>
          </button>
          <button
            className="text-3xl bg-solingen-blue rounded-xl h-[30%] p-5 flex flex-col justify-between"
            onClick={() => props.setCenter(<Map></Map>)}
          >
            <div id="btnImgInPoi_2" className="w-full h-full max-w-[55%] max-h-[55%]"></div>
            <div className="w-full text-right">Restaurants in Solingen</div>
          </button>
          <button
            className="text-3xl bg-solingen-blue rounded-xl h-[30%] p-5 flex flex-col justify-between"
            onClick={() => props.setCenter(<Map></Map>)}
          >
            <div id="btnImgInPoi_3" className="w-full h-full max-w-[55%] max-h-[55%]"></div>
            <div className="w-full text-right">Hallo Welt</div>
          </button>
        </div>
      </div>
    </div>
  )
}
