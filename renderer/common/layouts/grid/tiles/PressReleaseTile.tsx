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
  accessabilityCode: number
}

export default function PressReleaseTile(props: Props): React.JSX.Element {
  let cssForTitle: React.CSSProperties = {}
  if (props.isOpen) {
    if (props.tilePos < 3) {
      switch (props.accessabilityCode) {
        case 0:
          cssForTitle = {}
          break
        case 1:
          cssForTitle = { opacity: 0 }
          break
        case 2:
          cssForTitle = { position: 'absolute', bottom: '4.4rem', marginBottom: '0' }
          break
      }
    } else {
      switch (props.accessabilityCode) {
        case 0:
          cssForTitle = {}
          break
        case 1:
          cssForTitle = {}
          break
        case 2:
          cssForTitle = { opacity: 0 }
          break
      }
    }
  }

  const pressReleases = useLiveQuery(async () => {
    return await db.pressReleases.limit(8).reverse().toArray()
  })

  if (typeof pressReleases !== 'undefined') {
    return (
      <div className="w-full h-full pt-12 overflow-hidden flex flex-col">
        <div
          className="px-12 text-6xl text-left font-bold mb-8 tracking-wide text-solingen-blue whitespace-nowrap"
          style={cssForTitle}
        >
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
                  {new Intl.DateTimeFormat('de-DE').format(new Date(pressRelease.date.iso))}
                </div>
                <div className="mx-12 sm:text-lg my-2 md:text-xl lg:text-2xl text-solingen-blue line-clamp-3">
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
}
