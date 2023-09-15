import React from 'react'
import ImageTile from './tiles/ImageTile'

export default function Diashow(): React.JSX.Element {
  return (
    <ImageTile
      dimensionForPdf={{
        docCptSize: 'w-[100vw]',
        pdfScale: 1.3
      }}
      setCenter={undefined}
      isOpen={undefined}
    ></ImageTile>
  )
}
