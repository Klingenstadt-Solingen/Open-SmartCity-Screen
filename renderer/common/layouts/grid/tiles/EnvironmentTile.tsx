import React from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../../utils/dexie'
import EnvironmentPanel from '../panels/EnvironmentPanel/EnvironmentPanel'

type setCenter = (panel: React.JSX.Element) => void

interface Props {
  isOpen: boolean
  tilePos: number
  setCenter: setCenter
  accessabilityCode: number
}

export default function EnvironmentTile(props: Props): React.JSX.Element {
  const environmentCategories = useLiveQuery(async () => {
    return db.environmentCategories.toArray()
  })

  const environmentLocales = useLiveQuery(async () => {
    return db.environmentLocales.toArray()
  })

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

  if (environmentCategories && environmentLocales) {
    return (
      <div className="h-full w-full p-6 overflow-hidden">
        <div className="bg-background-color-dark p-6 rounded-lg text-primary-color w-full h-full flex flex-col gap-y-6 overflow-hidden">
          <div className="ml-4 text-left tracking-wide text-6xl font-bold" style={cssForTitle}>
            Umwelt
            <br />
            Aktuell
          </div>
          <div
            className="w-full grid grid-cols-2 justify-center items-center text-on-primary-color font-medium transition-opacity duration-app-speed gap-3 overflow-y-scroll"
            style={props.isOpen ? { opacity: 0 } : { opacity: 1 }}
          >
            {environmentCategories.map((category, index) => {
              return (
                <button
                  key={index}
                  className={`text-3xl bg-primary-color rounded-2xl pb-3 pr-3 pt-4 pl-4 aspect-square flex flex-col justify-between max-h-60 mx-auto w-full`}
                  onMouseDown={() => props.setCenter(<EnvironmentPanel category={category} />)}
                >
                  <img src={category?.icon?._url} alt="icon" className="w-16" />
                  <div className="self-end w-full text-right">
                    {environmentLocales.find((l) => l.key === category.name)?.value ||
                      category.name}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}
