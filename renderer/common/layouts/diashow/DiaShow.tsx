import React from 'react'
import ImageTile from './tiles/ImageTile'
import { imagesInfo } from '../../../models/imagesInfo'

export default function Diashow(): React.JSX.Element {
  return (
    <>
      <ImageTile
        ImageGroup={imagesInfo}
        dimensionImageTile={'w-[100vw] h-[100vh]'}
        dimensionForPdf={{
          docCptSize: 'w-[100vw]',
          pdfScale: 1.3
        }}
        setCenter={undefined}
        isOpen={undefined}
      ></ImageTile>
    </>
  )
}
