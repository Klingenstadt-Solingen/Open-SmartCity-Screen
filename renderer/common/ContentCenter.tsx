import React, { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Weather from './Weather'

interface Props {
  openStatus: boolean
  contentInCenter: string
}

export default function ContentCenter(props: Props): React.JSX.Element {
  function handleClick(e: React.FormEvent): void {
    e.stopPropagation()
  }

  const [showContent, setShowContent] = useState(props.openStatus)

  useEffect(() => {
    if (props.openStatus) {
      setShowContent(true)
    } else {
      const timer = setTimeout(() => setShowContent(false), 400)
      return () => clearTimeout(timer)
    }
  }, [props.openStatus])

  const Map = useMemo(
    () =>
      dynamic(() => import('./Map'), {
        ssr: false
      }),
    []
  )

  let endText: React.JSX.Element = null
  let tmp = ''

  switch (props.contentInCenter) {
    case '1':
      endText = <Map />
      break
    case '3':
      endText = <Map />
      break
    case '4':
      endText = <Weather />
      break
    default: {
      const newsArr = props.contentInCenter.split('&&&&&$$$$$')
      if (newsArr[1] !== undefined) {
        if (newsArr[1].length > 100) tmp = newsArr[1].substring(0, 100) + ' ...'
        else tmp = newsArr[1].substring(0, 100)
      }
      endText = (
        <>
          <div id="newsTimeInCenter" className="text-yellow-400 text-md font-bold text-left py-4 px-10">
            {newsArr[0]}
          </div>
          <div id="newsTitleInCenter" className="text-white text-2xl font-bold text-left py-4 px-10">
            {tmp}
          </div>
          <div
            id="newsTextInCenter"
            className="bg-white text-base text-left py-4 px-10"
            dangerouslySetInnerHTML={{ __html: newsArr[2] }}
          ></div>
        </>
      )
    }
  }

  return (
    <div onClick={(e) => handleClick(e)} id="content_center_area" style={props.openStatus ? { zIndex: '0' } : {}}>
      {showContent && endText}
    </div>
  )
}
