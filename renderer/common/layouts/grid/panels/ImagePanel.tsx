import React, { useState, useEffect, useRef } from 'react'
import { Document, Page } from 'react-pdf'

interface Props {
  imgSrc: string
  fileType: string
  pdfCanvasWidth: number | undefined
  pdfCanvasHeight: number | undefined
}
export default function ImagePanel(props: Props): React.JSX.Element {
  const [mediaContainerW, setMediaContainerW] = useState<number>(0)
  const [mediaContainerH, setMediaContainerH] = useState<number>(0)

  const mediaContainerRef = useRef(null)

  useEffect(() => {
    if (
      (props.fileType.toLowerCase() === 'pdf' && mediaContainerRef.current?.offsetWidth > 0) ||
      mediaContainerRef.current?.offsetHeight > 0
    ) {
      setMediaContainerW(mediaContainerRef.current?.offsetWidth)
      setMediaContainerH(mediaContainerRef.current?.offsetHeight)
    }
  }, [])

  return (
    <>
      <div
        ref={mediaContainerRef}
        className="w-full h-full flex items-center justify-center overflow-hidden bg-solingen-blue"
      >
        {props.fileType.toLowerCase() !== 'pdf' ? (
          <img className="w-full h-full object-contain" src={props.imgSrc}></img>
        ) : (
          <Document loading={''} file={props.imgSrc}>
            <Page
              renderTextLayer={false}
              pageNumber={1}
              width={
                props.pdfCanvasWidth < props.pdfCanvasHeight
                  ? (props.pdfCanvasWidth * mediaContainerH) / props.pdfCanvasHeight
                  : 0
              }
              height={
                props.pdfCanvasWidth > props.pdfCanvasHeight
                  ? (mediaContainerW * props.pdfCanvasHeight) / props.pdfCanvasWidth
                  : 0
              }
            />
          </Document>
        )}
      </div>
    </>
  )
}
