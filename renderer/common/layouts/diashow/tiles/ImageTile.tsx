import React from 'react'
import Image from './Image'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'
import { Mousewheel, Autoplay } from 'swiper/modules'

interface Image {
  id: number
  altInfo: string
  srcInfo: string
  duration: number
}

interface Props {
  ImageGroup: Image[]
  dimensionImageTile: string
  setCenter: (panel: React.JSX.Element) => void | undefined
  isOpen: boolean | undefined
  dimensionForPdf: { docCptSize: string; pdfScale: number }
}

export default function ImageTile(props: Props): React.JSX.Element {
  return (
    <Swiper
      direction={'vertical'}
      loop={true}
      speed={5000}
      mousewheel={true}
      modules={[Mousewheel, Autoplay]}
      autoplay={{
        disableOnInteraction: false
      }}
      className={`"${props.dimensionImageTile} bg-solingen-blue"`}
    >
      {props.ImageGroup.map((image) => (
        <SwiperSlide key={image.id} data-swiper-autoplay={image.duration}>
          <Image
            dimensionForPdf={props.dimensionForPdf}
            srcInfo={image.srcInfo}
            altInfo={image.altInfo}
            setCenter={props.setCenter}
            isOpen={props.isOpen}
          ></Image>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
