import React from 'react'
import PressReleasePanel from '../panels/PressreleasePanel'
import { db } from '../../../../utils/dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import { PressRelease } from '../../../../models/press-release'

type setCenter = (panel: React.JSX.Element) => void
interface Props {
  isOpen: boolean
  tilePos: number
  setCenter: setCenter
}

export default function PressReleaseTile(props: Props): React.JSX.Element {
  const pressReleases = useLiveQuery(async () => {
    return await db.pressReleases.orderBy('date').limit(5).reverse().toArray()
  })

  return (
    <div className="w-full h-full p-12 overflow-hidden">
      <div className="text-6xl text-left font-bold mb-8 tracking-wide text-solingen-blue whitespace-nowrap">
        Neues aus
        <br />
        Solingen.
      </div>
      <div
        className="transition-opacity duration-solingen-speed"
        style={props.isOpen ? { opacity: 0 } : { opacity: 1 }}
      >
        {pressReleases?.map((pressRelease: PressRelease, index: number) => {
          return (
            <div key={index} className="text-left font-bold mb-4">
              <div className="pl-[10px] ml-[-5px] text-xl font-thin border-l-2 border-solingen-yellow text-black">
                {new Intl.DateTimeFormat('de-DE').format(pressRelease.date)}
              </div>
              <div className="mb-4 text-2xl text-solingen-blue">
                {pressRelease.title.length > 90
                  ? pressRelease.title.substring(0, 90) + ' ...'
                  : pressRelease.title.substring(0, 90)}
              </div>
              <button
                className="text-sm w-24 h-6 rounded-md bg-solingen-yellow text-solingen-blue"
                onClick={() =>
                  props.setCenter(
                    <PressReleasePanel pressRelease={pressRelease}></PressReleasePanel>
                  )
                }
              >
                mehr lesen
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
