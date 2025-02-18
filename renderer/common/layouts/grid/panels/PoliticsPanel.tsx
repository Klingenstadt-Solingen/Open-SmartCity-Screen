import React, { useEffect, useRef, useState } from 'react'
import { environment } from '../../../../environment'
import { Meeting } from '../../../../models/meeting'
import dayjs from 'dayjs'
import Clock from '../../../icons/Clock'
import QRCode from 'react-qr-code'
import { Document, Page } from 'react-pdf'
import { Arrow } from '../../../icons/Arrow'

interface Props {
  preSelectedIndex?: string
  objectId?: string
  title?: string
  role?: string
}
PoliticsPanel.displayName = 'PoliticsPanel'
export default function PoliticsPanel(props: Props): React.JSX.Element {
  const [results, setResults] = useState<Array<any>>([])
  const [meeting, setMeeting] = useState<Meeting | null>(null)

  const fetchData = async () => {
    const agendaItemsUrl = environment.politicsServiceUrl + '/api/v1/agenda-items?meetingId='
    const meetingUrl = environment.politicsServiceUrl + '/api/v1/meetings/'

    const memberUrl = environment.politicsServiceUrl + '/api/v1/memberships?personId='

    const settings = { method: 'Get' }

    let url = ''

    if (props.preSelectedIndex == 'meeting') {
      url = agendaItemsUrl + props.objectId
      fetch(meetingUrl + props.objectId, settings)
        .then((res) => res.json())
        .then((json) => {
          setMeeting(json)
        })
    } else if (props.preSelectedIndex == 'member') url = memberUrl + props.objectId
    try {
      fetch(url, settings)
        .then((res) => res.json())
        .then((json) => {
          setResults(json)
        })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  return (
    <div className="h-full">
      <div className="w-full flex flex-col space-y-2 justify-start text-left p-10 pb-14 overflow-y-scroll scrollbar-hide h-full">
        <div className="text-3xl pb-4 text-secondary-color font-bold">{props.role}</div>
        {props.preSelectedIndex == 'meeting' && meeting && (
          <div className="pl-4 border-spacing-0 text-2xl mr-12 font-thin border-l-2 border-secondary-color text-on-background-color">
            {dayjs(new Date(meeting?.startDateTime)).format('DD.MMM YYYY')}
          </div>
        )}
        <div className="text-4xl text-primary-color font-bold mb-5">{props.title}</div>

        {props.preSelectedIndex == 'member' && results && !pdfUrl && (
          <div className="text-left font-bold mb-4 w-full">
            {results[0]?.person.email.length != 0 && (
              <>
                <div className="pl-4 border-spacing-0 text-2xl mr-12 font-thin border-l-2 border-secondary-color text-on-background-color">
                  E-Mail
                </div>
                <div className="mx-5 text-2xl my-2 text-primary-color font-bold line-clamp-3">
                  {results[0]?.person.email.join(', ')}
                </div>
              </>
            )}
            <div className="text-4xl mt-10 text-secondary-color font-bold line-clamp-3">
              Mitgliedschaften
            </div>
          </div>
        )}
        {props.preSelectedIndex == 'meeting' && meeting && !pdfUrl && (
          <>
            <span className="flex gap-2 items-center mt-3 ">
              <Clock className="w-6 h-6" fill="#999"></Clock>
              <p className="text-2xl font-light text-on-background-color">
                {dayjs(new Date(meeting?.startDateTime)).format('HH:mm')} -{' '}
                {dayjs(new Date(meeting?.endDateTime)).format('HH:mm')}
              </p>
            </span>
            {[meeting?.invitationFile, meeting?.resultsProtocolFile, meeting?.verbatimProtocolFile]
              .filter(Boolean)
              .map((file) => (
                <div key={file.id} className="flex-col space-y-2 bg-white p-4 rounded-md shadow-md">
                  <FileLabel
                    onClick={() => {
                      if (file.mimeType == 'application/pdf') setPdfUrl(file.accessUrl)
                    }}
                    name={file.name}
                    mimeType={file.mimeType}
                    link={file.accessUrl}
                  ></FileLabel>
                </div>
              ))}
          </>
        )}

        {results && results?.length === 0 && (
          <div className="text-xl text-red-800">
            {props.preSelectedIndex == 'meeting' &&
              'Es wurden keine Ergebnisse gefunden. Evtl. haben Sie eine Sitzung aus der Zukunft aufgerufen.'}
            {props.preSelectedIndex == 'member' && 'Es wurden keine Ergebnisse gefunden.'}
          </div>
        )}

        {pdfUrl && (
          <div className="flex-col w-full h-full">
            <div className="text-xl pb-5 flex" onMouseDown={() => setPdfUrl(null)}>
              <span className="text-secondary-color">&lt;&nbsp;&nbsp;</span>zurück
            </div>
            <PdfViewer className="self-center h-[89%]" url={pdfUrl}></PdfViewer>
          </div>
        )}

        {results &&
          !pdfUrl &&
          results.map((item, index) => {
            if (props.preSelectedIndex == 'meeting' && !pdfUrl) {
              return (
                <AgendaItemAccordion
                  key={index}
                  index={index}
                  item={item}
                  changePdfUrl={setPdfUrl}
                />
              )
            } else if (props.preSelectedIndex == 'member') {
              return (
                <div key={index} className="text-left font-bold mb-4 w-full">
                  <div className="pl-4 border-spacing-0 text-2xl mr-12 font-thin border-l-2 border-secondary-color text-on-background-color">
                    {item?.role}
                  </div>
                  <div className="mx-5 text-2xl my-2 font-bold text-primary-color line-clamp-3">
                    {item?.organizationName}
                  </div>
                </div>
              )
            }
          })}
      </div>
    </div>
  )
}

interface AgendaItemAccordionProps {
  item: any
  index: number
  changePdfUrl: (pdfUrl: string) => void
}

export function AgendaItemAccordion({ item, index, changePdfUrl }: AgendaItemAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const indentSize = item?.number.endsWith('.') ? 0 : (item?.number.match(/\./g) || []).length * 1.2
  const bgColor = index % 2 === 0 ? 'bg-gray-100' : 'bg-transparent'
  const expandable = item?.consultationPaper?.mainFile || item?.resolutionFile

  return (
    <div className="w-full flex-col space-y-2" style={{ paddingLeft: `${indentSize}em` }}>
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => {
          if (expandable) {
            setIsOpen(!isOpen)
          }
        }}
      >
        <div className="flex flex-grow space-x-2 items-stretch justify-center">
          <div
            className={`flex items-center justify-center grow-0 w-14 p-4 ${bgColor} rounded-md text-primary-color font-bold text-xl`}
          >
            {item?.number}
          </div>
          <div className={`flex items-center grow p-4 ${bgColor} rounded-md text-xl`}>
            {item?.name}
          </div>
          {expandable && (
            <span
              className={`flex items-center justify-center min-w-14 w-14 grow-0 p-4 ${bgColor} rounded-md`}
            >
              {isOpen ? (
                <img className="h-4 w-4" src="/images/svg/arrow_down.svg" />
              ) : (
                <img className="h-4 w-4" src="/images/svg/arrow_up.svg" />
              )}
            </span>
          )}
        </div>
      </div>
      {isOpen && (
        <>
          {[item?.consultationPaper?.mainFile, item?.resolutionFile].filter(Boolean).map((file) => (
            <div
              key={file.id}
              className="w-full flex-col space-y-2 bg-white p-4 rounded-md shadow-md"
            >
              <FileLabel
                onClick={() => {
                  if (file.mimeType == 'application/pdf') changePdfUrl(file.accessUrl)
                }}
                name={file.name}
                mimeType={file.mimeType}
                link={file.accessUrl}
              ></FileLabel>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

interface FileLabelProps {
  name: string
  mimeType: string
  link: string
  withQrCode?: boolean
  onClick: () => void
}

export function FileLabel({ name, mimeType, link, withQrCode = true, onClick }: FileLabelProps) {
  return (
    <div className="flex w-full justify-between items-center gap-4">
      <button onClick={onClick} className="flex items-center gap-4">
        <div className="flex w-10 h-10 items-end justify-center border-[0.15rem] rounded-sm border-secondary-color">
          <span className="text-lg text-secondary-color uppercase">{mimeType.split('/')[1]}</span>
        </div>
        <span className="text-on-background-color text-xl">{name}</span>
      </button>
      {withQrCode && <QRLink link={link} />}
    </div>
  )
}

interface QRLinkProps {
  link: string
}

export function QRLink({ link }: QRLinkProps) {
  const sizeClassName = 'w-10'
  const [className, setClassName] = useState(sizeClassName)

  return (
    <div
      className={`${className} min-w-10 transition-all duration-app-speed flex`}
      onMouseDown={(event) => {
        if (event.currentTarget.classList.contains(sizeClassName)) {
          setClassName('w-40 min-w-40')
        } else {
          setClassName(sizeClassName)
        }
      }}
    >
      <QRCode className={`w-full h-min`} value={link}></QRCode>
    </div>
  )
}

interface PdfViewerProps {
  url: string
  className?: string
}

export function PdfViewer({ url, className = null }: PdfViewerProps) {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1)
  const containerRef = useRef(null)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages)
    setPageNumber(1)
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset)
  }

  function previousPage() {
    changePage(-1)
  }

  function nextPage() {
    changePage(1)
  }

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        const pdfWidth = 595 // Standard A4 width in points
        const pdfHeight = 842 // Standard A4 height in points

        // Calculate scale based on available width and height
        const scaleX = width / pdfWidth
        const scaleY = height / pdfHeight
        setScale(Math.min(scaleX, scaleY)) // Use the smaller scale to avoid distortion
      }
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  return (
    <div ref={containerRef} className={className}>
      <Document className="h-full" file={url} onLoadSuccess={onDocumentLoadSuccess}>
        <div className="flex justify-center items-center h-full">
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            scale={scale}
          />
        </div>
      </Document>
      <div className="flex gap-24 justify-center">
        <button
          className="flex items-center gap-2"
          type="button"
          disabled={pageNumber <= 1}
          onClick={previousPage}
        >
          <Arrow orientation="left" className="w-4" />
          Zurück
        </button>
        <p>
          Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
        </p>
        <button
          className="flex items-center gap-2"
          type="button"
          disabled={pageNumber >= numPages}
          onClick={nextPage}
        >
          Weiter
          <Arrow orientation="right" className="w-4" />
        </button>
      </div>
    </div>
  )
}
