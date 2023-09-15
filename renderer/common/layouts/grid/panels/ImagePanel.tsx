import React, { useState, useEffect } from 'react'
import { Document, Page } from 'react-pdf'

interface Props {
  imgSrc: string
  imgAlt: string
  fileType: string
}
export default function WeatherPanel({ imgSrc, imgAlt, fileType }: Props): React.JSX.Element {
  const [pdfIsReady, setPdfIsready] = useState<boolean>(false)
  const [panelIsLoading, setPanelIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const timer = setTimeout(() => setPanelIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [panelIsLoading])

  function onPageRenderSuccess(): void {
    setPdfIsready(!pdfIsReady)
  }

  return (
    <>
      {!panelIsLoading && (
        <div className="tracking-wide w-full h-[59vh] bg-white flex flex-wrap flex-row box-border overflow-hidden">
          {fileType.toLowerCase() !== 'pdf' ? (
            <img className="w-full h-full" src={imgSrc} alt={imgAlt}></img>
          ) : (
            <center>
              <div
                style={{ backgroundImage: 'url("/images/loading.gif")' }}
                className={
                  !pdfIsReady
                    ? 'absolute z-20 w-full h-[56vh] bg-no-repeat bg-center bg-contain'
                    : 'hidden'
                }
              ></div>

              <Document loading={''} className="w-[100vw]" file={imgSrc}>
                <Page
                  loading={''}
                  renderTextLayer={false}
                  scale={1}
                  onRenderSuccess={onPageRenderSuccess}
                  pageNumber={1}
                />
              </Document>
            </center>
          )}
        </div>
      )}
    </>
  )
}
