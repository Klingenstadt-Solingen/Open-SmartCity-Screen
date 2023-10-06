import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Mousewheel, Autoplay } from 'swiper/modules'
import { db } from '../../../../utils/dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import { DiashowObject } from '../../../../models/diashowObject'
import MediaContainer from './MediaContainer'

import fs from 'fs'
import https from 'https'
import { downloadPath, downloadDir } from '../../../../utils/constants'

function downloadDiashowObjects(diashowObjects: DiashowObject[]): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(downloadPath + downloadDir)) {
      fs.mkdirSync(downloadPath + downloadDir)
    }
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

interface Props {
  setCenter?: (panel: React.JSX.Element) => void | undefined
  isOpen?: boolean | undefined
  layoutDiashow?: boolean
}

export default function ImageTile(props: Props): React.JSX.Element {
  const diashowObjects = useLiveQuery(async () => {
    return await db.diashowObjects.toArray()
  })

  const [isLoading, setIsLoading] = useState(true)

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
        className="w-full h-full bg-solingen-blue"
        watchSlidesProgress={true}
        direction={'vertical'}
        loop={true}
        speed={2000}
        mousewheel={true}
        modules={[Mousewheel, Autoplay]}
        autoplay={{
          disableOnInteraction: false
        }}
      >
        {diashowObjects.map((diashowObject, index) => {
          return (
            <SwiperSlide
              key={index}
              data-swiper-autoplay={
                diashowObject.file.name.toLocaleLowerCase().endsWith('.mp4')
                  ? 10
                  : diashowObject.duration * 1000
              }
            >
              <MediaContainer
                srcInfo={downloadDir + diashowObject.file.name}
                setCenter={props.setCenter}
                isOpen={props.isOpen}
                layoutDiashow={props.layoutDiashow}
              ></MediaContainer>
            </SwiperSlide>
          )
        })}
      </Swiper>
    )
  } else return <div></div>
}
