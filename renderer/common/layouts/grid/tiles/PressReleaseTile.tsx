import React from 'react'
import PressReleasePanel from '../panels/PressreleasePanel'
import { db } from '../../../../utils/dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import { PressRelease } from '../../../../models/press-release'
import { environment } from '../../../../environment'

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
    return db.pressReleases.toArray()
  })

  if (typeof pressReleases !== 'undefined') {
    return (
      <div className="w-full h-full pt-12 overflow-hidden flex flex-col">
        <div
          className="px-12 text-6xl text-left font-bold mb-8 tracking-wide text-primary-color whitespace-nowrap"
          style={cssForTitle}
        >
          Neues aus
          <br />
          {environment.cityName || 'Solingen'}.
        </div>
        <div
          className="transition-opacity duration-app-speed flex flex-col flex-wrap overflow-hidden"
          style={props.isOpen ? { opacity: 0 } : { opacity: 1 }}
        >
          {pressReleases
            ?.sort((a, b) => new Date(b.date.iso).getTime() - new Date(a.date.iso).getTime())
            .map((pressRelease: PressRelease, index: number) => {
              return (
                <div
                  onMouseDown={() =>
                    props.setCenter(<PressReleasePanel pressRelease={pressRelease} />)
                  }
                  key={index}
                  className="text-left font-bold mb-4 w-full"
                >
                  <div className="text-2xl pl-[6px] ml-8 mr-12 font-thin border-l-2 border-secondary-color text-on-background-color">
                    {new Intl.DateTimeFormat('de-DE').format(new Date(pressRelease.date.iso))}
                  </div>
                  <div className="mx-12 text-2xl my-2 text-primary-color line-clamp-3">
                    {pressRelease.title}
                  </div>
                  <div className="mx-12 text-xl font-bold text-on-background-color">
                    <span className="text-secondary-color">&gt;&nbsp;&nbsp;</span>mehr lesen
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    )
  }
}
