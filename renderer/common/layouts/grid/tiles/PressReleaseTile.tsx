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
    return await db.pressReleases.orderBy('date').limit(8).reverse().toArray()
  })

  return (
    <div className="w-full h-full pt-12 overflow-hidden flex flex-col">
      <div className="px-12 text-6xl text-left font-bold mb-8 tracking-wide text-solingen-blue whitespace-nowrap">
        Neues aus
        <br />
        Solingen.
      </div>
      <div
        className="transition-opacity duration-solingen-speed flex flex-col flex-wrap overflow-hidden"
        style={props.isOpen ? { opacity: 0 } : { opacity: 1 }}
      >
        {pressReleases?.map((pressRelease: PressRelease, index: number) => {
          return (
            <div key={index} className="text-left font-bold mb-4 w-full">
              <div className="text-lg pl-[6px] ml-8 mr-12 font-thin border-l-2 border-solingen-yellow text-black">
                {new Intl.DateTimeFormat('de-DE').format(pressRelease.date)}
              </div>
              <div className="mx-12 sm:text-lg my-2 md:text-xl lg:text-2xl text-solingen-blue line-clamp">
                {pressRelease.title}
              </div>
              <div
                className="mx-12 sm:text-base md:text-lg font-bold text-black"
                onClick={() =>
                  props.setCenter(
                    <PressReleasePanel pressRelease={pressRelease}></PressReleasePanel>
                  )
                }
              >
                <span className="text-solingen-yellow">&gt;&nbsp;&nbsp;</span>mehr lesen
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
