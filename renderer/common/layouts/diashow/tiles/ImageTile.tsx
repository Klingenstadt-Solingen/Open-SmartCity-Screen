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
import { downloadDir } from '../../../../utils/constants'

function downloadDiashowObjects(diashowObjects: DiashowObject[]): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(localStorage.getItem('path') + downloadDir)) {
      fs.mkdirSync(localStorage.getItem('path') + downloadDir)
    }
    Promise.all(
      diashowObjects.map((diashowObject) => {
        return new Promise<void>((resolveOne, rejectOne) => {
          if (fs.existsSync(localStorage.getItem('path') + downloadDir + diashowObject.file.name)) {
            resolveOne()
          } else {
            const fileUrl = 'https://' + diashowObject.file.url.split('://')[1]
            const targetFile = fs.createWriteStream(
              localStorage.getItem('path') + downloadDir + diashowObject.file.name
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
        className="w-full h-full bg-primary-color"
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
          if (
            new Date((diashowObject.startDate as { iso: string }).iso).getTime() <
              new Date().getTime() &&
            new Date((diashowObject.endDate as { iso: string }).iso).getTime() >
              new Date().getTime()
          ) {
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
                  srcInfo={
                    localStorage.getItem('mode') === 'dev'
                      ? downloadDir + diashowObject.file.name
                      : localStorage.getItem('path') + downloadDir + diashowObject.file.name
                  }
                  setCenter={props.setCenter}
                  isOpen={props.isOpen}
                  layoutDiashow={props.layoutDiashow}
                ></MediaContainer>
              </SwiperSlide>
            )
          }
        })}
      </Swiper>
    )
  } else return <div></div>
}
