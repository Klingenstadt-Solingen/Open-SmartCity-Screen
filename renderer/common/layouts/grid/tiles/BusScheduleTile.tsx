import React from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../../utils/dexie'
import ImagePanel from '../panels/ImagePanel'

type setCenter = (panel: React.JSX.Element) => void

interface Props {
  setCenter: setCenter
  isOpen: boolean
}

export default function BusScheduleTile(props: Props): React.JSX.Element {
  const departures = useLiveQuery(async () => {
    return db.departures.toArray()
  })

  const layoutConfig = useLiveQuery(async () => {
    return db.layoutConfig.toCollection().first()
  })

  if (typeof departures !== 'undefined' && typeof layoutConfig !== 'undefined') {
    return (
      <div className="w-full h-full p-6">
        <div className="bg-background-color-dark rounded-xl p-8 text-left h-full flex flex-col">
          <div className="text-primary-color text-5xl mb-5 tracking-wide font-bold">
            Aushangsfahrplan
          </div>
          <div className="w-full h-full flex flex-wrap gap-10 overflow-y-scroll scrollbar-hide">
            {departures.map((item, index) => {
              return (
                <>
                  <button
                    key={index}
                    className="bg-primary-color text-on-primary-color font-bold text-3xl rounded-xl align-middle text-center flex justify-center items-center w-1/5 h-24"
                    onMouseDown={() => {
                      let height
                      if (typeof layoutConfig !== 'undefined') {
                        switch (true) {
                          case layoutConfig.showHeader && layoutConfig.showFooter:
                            height = window.innerHeight * 0.59
                            break
                          case layoutConfig.showHeader && !layoutConfig.showFooter:
                            height = window.innerHeight * 0.61
                            break
                          case !layoutConfig.showHeader && layoutConfig.showFooter:
                            height = window.innerHeight * 0.63
                            break
                          case !layoutConfig.showHeader && !layoutConfig.showFooter:
                            height = window.innerHeight * 0.65
                            break
                        }
                        props.setCenter(
                          <ImagePanel
                            pdfCanvasHeight={height}
                            imgSrc={'data:application/pdf;base64,' + item.sttPdf}
                            fileType="pdf"
                          />
                        )
                      }
                    }}
                  >
                    {item.disassembledName}
                  </button>
                </>
              )
            })}
          </div>
          <button className="mt-10 bg-secondary-color text-primary-color text-4xl py-4 px-6 rounded-xl flex justify-center w-fit">
            Tarifübersicht
          </button>
        </div>
      </div>
    )
  }
}
