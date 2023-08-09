import React from 'react'
import PressReleasePanel from '../panels/PressreleasePanel'
import { db } from '../../../../utils/dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import { PressRelease } from '../../../../models/press-release'

type setCenter = (panel: React.JSX.Element) => void
interface Props {
  setCenter: setCenter
}

export default function PressReleaseTile(props: Props): React.JSX.Element {
  const pressReleases = useLiveQuery(async () => {
    return await db.pressReleases.orderBy('date').limit(4).reverse().toArray()
  })

  return (
    <div className="w-full p-12">
      <div className="text-6xl text-left font-bold mb-8 tracking-wide text-solingen-blue">
        Neues aus Solingen.
      </div>
      <div id="news_container">
        {pressReleases?.map((pressRelease: PressRelease, index: number) => {
          return (
            <div key={index} className="text-left font-bold mb-12">
              <div
                className="text-xl font-thin museo-sans border-l-2 border-solingen-yellow text-black"
                style={{ paddingLeft: '10px', marginLeft: '-5px' }}
              >
                {new Intl.DateTimeFormat('de-DE').format(pressRelease.date)}
              </div>
              <div className="mb-4 text-2xl text-solingen-blue">
                {pressRelease.title.length > 90
                  ? pressRelease.title.substring(0, 90) + ' ...'
                  : pressRelease.title.substring(0, 90)}
              </div>
              <button
                className="text-base w-32 h-10 rounded-lg bg-solingen-yellow text-solingen-blue"
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
