import React, { useState, useEffect } from 'react'
import { useSwiper } from 'swiper/react'
import ImagePanel from '../../grid/panels/ImagePanel'
import { Document, Page, pdfjs } from 'react-pdf'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'
import 'react-pdf/dist/Page/AnnotationLayer.css'

interface Props {
  srcInfo: string
  altInfo: string
  setCenter: (panel: React.JSX.Element) => void | undefined
  isOpen: boolean | undefined
  dimensionForPdf: { docCptSize: string; pdfScale: number }
}

export default function Image(props: Props): React.JSX.Element {
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(true)
  useEffect(() => {
    const timer = setTimeout(() => setIsPdfLoading(false), 600)
    return () => clearTimeout(timer)
  }, [isPdfLoading])

  pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker
  const swiper = useSwiper()

  swiper.on('autoplayPause', () => {
    swiper.autoplay.timeLeft = 5000
  })

  swiper.on('autoplayResume', () => {
    swiper.autoplay.timeLeft = 5000
  })

  if (props.isOpen) {
    swiper.autoplay.pause()
  } else {
    swiper.autoplay.resume()
  }

  if (props.srcInfo.slice(-4) !== '.pdf')
    return (
      <>
        <img
          className="w-full h-full"
          src={props.srcInfo}
          alt={props.altInfo}
          onClick={(e) => {
            if (swiper.animating) e.stopPropagation()
            else {
              if (props.setCenter !== undefined)
                props.setCenter(
                  <ImagePanel imgSrc={props.srcInfo} imgAlt={props.altInfo}></ImagePanel>
                )
            }
          }}
        ></img>
      </>
    )
  else
    return (
      <center>
        {isPdfLoading ? (
          <img src={'/images/loading.gif'} />
        ) : (
          <Document
            loading={''}
            className={props.dimensionForPdf.docCptSize}
            file={props.srcInfo}
            onClick={(e) => {
              if (swiper.animating) e.stopPropagation()
              else {
                if (props.setCenter !== undefined)
                  props.setCenter(
                    <ImagePanel imgSrc={props.srcInfo} imgAlt={props.altInfo}></ImagePanel>
                  )
              }
            }}
          >
            <Page
              loading={''}
              renderTextLayer={false}
              scale={props.dimensionForPdf.pdfScale}
              pageNumber={1}
            />
          </Document>
        )}
      </center>
    )
}
