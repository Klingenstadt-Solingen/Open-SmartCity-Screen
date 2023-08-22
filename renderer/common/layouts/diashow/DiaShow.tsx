import React from 'react'
import ImageTile from './tiles/ImageTile'

export const imagesInfo = [
  {
    id: 1,
    altInfo: 'MusterText_1',
    srcInfo: '/pdf/1.pdf',
    duration: 5000
  },
  {
    id: 2,
    altInfo: 'MusterText_2',
    srcInfo: '/images/diashow/3.jpg',
    duration: 2000
  },
  {
    id: 3,
    altInfo: 'MusterText_3',
    srcInfo: '/pdf/3.pdf',
    duration: 3000
  },
  {
    id: 4,
    altInfo: 'MusterText_4',
    srcInfo: '/pdf/2.pdf',
    duration: 15000
  },
  {
    id: 5,
    altInfo: 'MusterText_5',
    srcInfo: '/images/diashow/2.jpg',
    duration: 3000
  }
]

export default function Diashow(): React.JSX.Element {
  return (
    <ImageTile
      ImageGroup={imagesInfo}
      dimensionForPdf={{
        docCptSize: 'w-[100vw]',
        pdfScale: 1.3
      }}
      setCenter={undefined}
      isOpen={undefined}
    ></ImageTile>
  )
}
