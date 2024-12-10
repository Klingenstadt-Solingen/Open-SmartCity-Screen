import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Mousewheel, Autoplay } from 'swiper/modules'
import { db } from '../../../../utils/dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import MediaContainer from './MediaContainer'
import { environment } from '../../../../environment'

// function downloadDiashowObjects(diashowObjects: DiashowObject[]): Promise<void> {
//   return new Promise((resolve, reject) => {
//     if (!fs.existsSync(localStorage.getItem('path') + downloadDir)) {
//       fs.mkdirSync(localStorage.getItem('path') + downloadDir)
//     }
//     Promise.all(
//       diashowObjects.map((diashowObject) => {
//         return new Promise<void>((resolveOne) => {
//           const fileUrl = 'https://' + diashowObject.file.url.split('://')[1]
//           if (fs.existsSync(localStorage.getItem('path') + downloadDir + diashowObject.file.name)) {
//             resolveOne()
//           } else {
//             fetch(fileUrl).then((res) => {
//               res.arrayBuffer().then((b) => {
//                 writeFile(
//                   localStorage.getItem('path') + downloadDir + diashowObject.file.name,
//                   Buffer.from(b)
//                 ).then(() => resolveOne())
//               })
//             })
//           }
//         })
//       })
//     )
//       .then(() => resolve())
//       .catch(() => reject())
//   })
// }

interface Props {
  setCenter?: (panel: React.JSX.Element) => void | undefined
  isOpen?: boolean | undefined
  layoutDiashow?: boolean
  config?: any
}

export default function ImageTile(props: Props): React.JSX.Element {
  const diashowObjects = useLiveQuery(async () => {
    return db.diashowObjects.toArray()
  })

  // const [isLoading, setIsLoading] = useState(false)
  // const [isDownloading, setIsDownloading] = useState(false)

  // useEffect(() => {
  //   setIsLoading(true)
  //   if (typeof diashowObjects !== 'undefined' && diashowObjects.length && isDownloading === false) {
  //     setIsDownloading(true)
  //     downloadDiashowObjects(diashowObjects).then(() => {
  //       setIsDownloading(false)
  //       setIsLoading(false)
  //     })
  //   }
  // }, [diashowObjects])

  if (typeof diashowObjects !== 'undefined' && diashowObjects.length) {
    return (
      <Swiper
        className="w-full h-full background-image bg-primary-color"
        //no idea what this is, but without you cant close panel on swiper
        style={props.isOpen ? { pointerEvents: 'none' } : {}}
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
                    environment.parseUrl.split('://')[0] +
                    '://' +
                    diashowObject.file.url.split('://')[1]
                  }
                  setCenter={props.setCenter}
                  isOpen={props.isOpen}
                  layoutDiashow={props.layoutDiashow}
                />
              </SwiperSlide>
            )
          }
        })}
      </Swiper>
    )
  } else return <div></div>
}
