import React, { useState, useEffect, useRef } from 'react'
import { useSwiper, useSwiperSlide } from 'swiper/react'
import ImagePanel from '../../grid/panels/ImagePanel'
import { Document, Page, pdfjs } from 'react-pdf'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import ReactPlayer from 'react-player'

interface Props {
  srcInfo: string
  setCenter: (panel: React.JSX.Element) => void | undefined
  isOpen: boolean | undefined
  layoutDiashow: boolean
}

export default function MediaContainer(props: Props): React.JSX.Element {
  const videoRef = useRef(null)
  const mediaContainerRef = useRef(null)
  const pdfCanvasRef = useRef(null)

  const [mediaContainerW, setMediaContainerW] = useState<number>(0)
  const [mediaContainerH, setMediaContainerH] = useState<number>(0)
  const [pdfCanvasW, setPdfCanvasW] = useState<number>(0)
  const [pdfCanvasH, setPdfCanvasH] = useState<number>(0)

  pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker
  const swiper = useSwiper()
  const swiperSlide = useSwiperSlide()

  if (props.isOpen) {
    swiper.autoplay.stop()
  } else {
    swiper.autoplay.start()
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        (props.srcInfo.toLocaleLowerCase().endsWith('.pdf') &&
          mediaContainerRef.current?.offsetWidth > 0) ||
        mediaContainerRef.current?.offsetHeight > 0 ||
        pdfCanvasRef.current?.offsetWidth > 0 ||
        pdfCanvasRef.current?.offsetHeight > 0
      ) {
        setMediaContainerW(mediaContainerRef.current?.offsetWidth)
        setMediaContainerH(mediaContainerRef.current?.offsetHeight)
        setPdfCanvasW(pdfCanvasRef.current?.offsetWidth)
        setPdfCanvasH(pdfCanvasRef.current?.offsetHeight)
        clearTimeout(timer)
      }
    }, 50)
  }, [swiper.isBeginning])

  return (
    <div
      className="w-full h-full flex flex-col flex-wrap overflow-hidden items-center justify-center"
      ref={mediaContainerRef}
    >
      {props.srcInfo.toLocaleLowerCase().endsWith('.pdf') && (
        <Document
          loading={''}
          file={props.srcInfo}
          onMouseDown={(e) => {
            if (swiper.animating) e.stopPropagation()
            else {
              if (props.setCenter !== undefined)
                props.setCenter(
                  <ImagePanel
                    imgSrc={props.srcInfo}
                    fileType={props.srcInfo.slice(-3).toLocaleLowerCase()}
                    pdfCanvasWidth={pdfCanvasW}
                    pdfCanvasHeight={pdfCanvasH}
                  ></ImagePanel>
                )
            }
          }}
        >
          <center>
            <Page
              canvasRef={pdfCanvasRef}
              loading={''}
              renderTextLayer={false}
              pageNumber={1}
              width={pdfCanvasW < pdfCanvasH ? (pdfCanvasW * mediaContainerH) / pdfCanvasH : 0}
              height={pdfCanvasW > pdfCanvasH ? (mediaContainerW * pdfCanvasH) / pdfCanvasW : 0}
            />
          </center>
        </Document>
      )}
      {props.srcInfo.toLocaleLowerCase().endsWith('.mp4') && (
        <div className="w-full h-full flex items-center justify-center">
          <ReactPlayer
            ref={videoRef}
            url={props.srcInfo}
            playing={swiperSlide.isVisible ? true : false}
            loop={true}
            controls={false}
            muted={true}
            width="100%"
            height="100%"
            onPlay={() => {
              swiper.autoplay.stop()
            }}
            onEnded={() => {
              swiper.autoplay.start()
            }}
          />
        </div>
      )}
      {!props.srcInfo.toLocaleLowerCase().endsWith('.pdf') &&
        !props.srcInfo.toLocaleLowerCase().endsWith('.mp4') && (
          <img
            className="w-full h-full object-contain"
            src={props.srcInfo}
            onMouseDown={(e) => {
              if (swiper.animating) e.stopPropagation()
              else {
                if (props.setCenter)
                  props.setCenter(
                    <ImagePanel
                      imgSrc={props.srcInfo}
                      fileType={props.srcInfo.slice(-3).toLocaleLowerCase()}
                      pdfCanvasWidth={undefined}
                      pdfCanvasHeight={undefined}
                    ></ImagePanel>
                  )
              }
            }}
          ></img>
        )}
    </div>
  )
}
