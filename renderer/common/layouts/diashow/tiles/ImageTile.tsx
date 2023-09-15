import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Mousewheel, Autoplay } from 'swiper/modules'
import { db } from '../../../../utils/dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import { DiashowObject } from '../../../../models/diashowObject'
import { Document, Page, pdfjs } from 'react-pdf'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'
import 'react-pdf/dist/Page/AnnotationLayer.css'

import fs from 'fs'
import https from 'https'

const downloadDir = '/downloads/'
const downloadPath = './renderer/public'

function downloadDiashowObjects(diashowObjects: DiashowObject[]): Promise<void> {
  return new Promise((resolve, reject) => {
    Promise.all(
      diashowObjects.map((diashowObject) => {
        return new Promise<void>((resolveOne, rejectOne) => {
          if (fs.existsSync(downloadPath + downloadDir + diashowObject.file.name)) {
            resolveOne()
          } else {
            const fileUrl = 'https://' + diashowObject.file.url.split('://')[1]
            const targetFile = fs.createWriteStream(
              downloadPath + downloadDir + diashowObject.file.name
            )
            https.get(fileUrl, function (response) {
              response.pipe(targetFile)

              targetFile.on('error', function () {
                targetFile.end()
                rejectOne()
              })
              targetFile.on('finish', () => {
                targetFile.close()
                //dk why
                setTimeout(() => resolveOne(), 1)
              })
            })
          }
        })
      })
    )
      .then(() => resolve())
      .catch(() => reject())
  })
}

export default function ImageTile(): React.JSX.Element {
  const diashowObjects = useLiveQuery(async () => {
    return await db.diashowObjects.toArray()
  })

  const [isLoading, setIsLoading] = useState(true)

  pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

  useEffect(() => {
    setIsLoading(true)
    if (typeof diashowObjects !== 'undefined' && diashowObjects.length) {
      downloadDiashowObjects(diashowObjects).then(() => {
        setIsLoading(false)
      })
    }
  }, [diashowObjects])

  if (!isLoading && typeof diashowObjects !== 'undefined' && diashowObjects.length) {
    return (
      <Swiper
        direction={'vertical'}
        loop={true}
        speed={2000}
        mousewheel={true}
        modules={[Mousewheel, Autoplay]}
        autoplay={{
          disableOnInteraction: false
        }}
        className="w-full h-full"
      >
        {diashowObjects.map((diashowObject, index) => {
          return (
            <SwiperSlide key={index} data-swiper-autoplay={diashowObject.duration * 1000 || 2000}>
              {diashowObject.file.name.endsWith('.pdf') && (
                <Document file={downloadDir + diashowObject.file.name}>
                  <Page
                    height={600}
                    width={350}
                    className="w-20"
                    renderTextLayer={false}
                    pageNumber={1}
                  />
                </Document>
              )}
              {!diashowObject.file.name.endsWith('.pdf') && (
                <img src={downloadDir + diashowObject.file.name}></img>
              )}
            </SwiperSlide>
          )
        })}
      </Swiper>
    )
  } else return <div></div>
}
