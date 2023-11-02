import React from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../../utils/dexie'
import ImagePanel from '../panels/ImagePanel'

type setCenter = (panel: React.JSX.Element) => void

interface Props {
  setCenter: setCenter
  isOpen: boolean
}

export default function BusTileDeparture(props: Props): React.JSX.Element {
  const departures = useLiveQuery(async () => {
    return await db.departures.toArray()
  })

  if (typeof departures !== 'undefined') {
    return (
      <div className="w-full h-full p-6">
        <div className="bg-background-color-dark rounded-xl p-8 text-left h-full flex flex-col">
          <div className="text-primary-color text-5xl mb-5 tracking-wide font-bold">
            Aushangsfahrplan
          </div>
          <div className="w-full h-full flex flex-wrap gap-10 overflow-y-scroll">
            {departures.map((item, index) => {
              return (
                <>
                  <button
                    key={index}
                    className="bg-primary-color text-on-primary-color font-bold text-3xl rounded-xl align-middle text-center flex justify-center items-center w-1/5 h-24"
                    onClick={() => {
                      props.setCenter(
                        <ImagePanel
                          pdfCanvasWidth={window.innerWidth * 0.1}
                          imgSrc={'data:application/pdf;base64,' + item.sttPdf}
                          fileType="pdf"
                        ></ImagePanel>
                      )
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
