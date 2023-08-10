import React, { useState, useEffect } from 'react'
import { Document, Page } from 'react-pdf'

interface Props {
  imgSrc: string
  imgAlt: string
}
export default function WeatherPanel({ imgSrc, imgAlt }: Props): React.JSX.Element {
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(true)
  useEffect(() => {
    const timer = setTimeout(() => setIsPdfLoading(false), 600)
    return () => clearTimeout(timer)
  }, [isPdfLoading])

  return (
    <div className="tracking-wide w-full h-[56vh] bg-white flex flex-wrap flex-row box-border">
      {imgSrc.slice(-4) !== '.pdf' ? (
        <img className="w-full h-full" src={imgSrc} alt={imgAlt}></img>
      ) : (
        <center>
          {isPdfLoading ? (
            <div
              style={{ backgroundImage: 'url("/images/loading.gif")' }}
              className="absolute w-full h-[56vh] bg-no-repeat bg-center bg-contain"
            ></div>
          ) : (
            <Document loading={''} className="w-[100vw]" file={imgSrc}>
              <Page loading={''} renderTextLayer={false} scale={1} pageNumber={1} />
            </Document>
          )}
        </center>
      )}
    </div>
  )
}
