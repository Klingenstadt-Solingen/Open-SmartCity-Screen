import React from 'react'
import { Document, Page } from 'react-pdf'

interface Props {
  imgSrc: string
  fileType: string
  pdfCanvasWidth?: number | undefined
  pdfCanvasHeight?: number | undefined
}
ImagePanel.displayName = 'ImagePanel'
export default function ImagePanel(props: Props): React.JSX.Element {
  return (
    <>
      <div className="w-full h-full flex items-center justify-center overflow-hidden bg-primary-color">
        {props.fileType.toLowerCase() !== 'pdf' ? (
          <img className="w-full h-full object-contain" src={props.imgSrc}></img>
        ) : (
          <Document loading={''} file={props.imgSrc}>
            <Page renderTextLayer={false} pageNumber={1} height={props.pdfCanvasHeight} />
          </Document>
        )}
      </div>
    </>
  )
}
