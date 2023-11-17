import { useLiveQuery } from 'dexie-react-hooks'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import { db } from '../../../../utils/dexie'

interface Props {
  isOpen: boolean
  accessabilityCode: number
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function BasePanel(props: PropsWithChildren<Props>): React.JSX.Element {
  const isShowHeader = useLiveQuery(async () => {
    return (await db.layoutConfig.toCollection().first()).showHeader
  })

  const isShowFooter = useLiveQuery(async () => {
    return (await db.layoutConfig.toCollection().first()).showFooter
  })

  const [showContent, setShowContent] = useState(props.isOpen)

  useEffect(() => {
    if (props.isOpen) {
      setShowContent(true)
    } else {
      const timer = setTimeout(() => setShowContent(false), 600)
      return () => clearTimeout(timer)
    }
  }, [props.isOpen])

  let centerPanelClassName: string = ''
  if (isShowHeader) {
    if (isShowFooter) {
      centerPanelClassName =
        'z-10 absolute text-center w-full h-[59vh] top-[22vh] transition-all duration-app-speed'
    } else {
      centerPanelClassName =
        'z-10 absolute text-center w-full h-[61vh] top-[22.8vh] transition-all duration-app-speed'
    }
  } else {
    if (isShowFooter) {
      centerPanelClassName =
        'z-10 absolute text-center w-full h-[63vh] top-[16.8vh] transition-all duration-app-speed'
    } else {
      centerPanelClassName =
        'z-10 absolute text-center w-full h-[65vh] top-[17.5vh] transition-all duration-app-speed'
    }
  }

  let centerPanelCss: React.CSSProperties = {}
  const centerPanelCss_tmp: React.CSSProperties = {
    height: '65vh'
  }

  if (props.isOpen) {
    switch (props.accessabilityCode) {
      case 0:
        centerPanelCss = { zIndex: 0 }
        break
      case 1:
        if (isShowHeader) {
          if (isShowFooter) {
            centerPanelCss = { ...centerPanelCss_tmp, top: '8vh' }
          } else {
            centerPanelCss = { ...centerPanelCss_tmp, top: '7vh' }
          }
        } else {
          centerPanelCss = { ...centerPanelCss_tmp, top: '6.5vh' }
        }
        break
      case 2:
        if (isShowHeader) {
          if (isShowFooter) {
            centerPanelCss = { ...centerPanelCss_tmp, top: '26vh' }
          } else {
            centerPanelCss = { ...centerPanelCss_tmp, top: '28vh' }
          }
        } else {
          centerPanelCss = { ...centerPanelCss_tmp, top: '27.5vh' }
        }
        break
    }
  } else {
    centerPanelCss = { zIndex: -1 }
  }

  if (typeof screen !== 'undefined') {
    return (
      <>
        {showContent && (
          <div
            className={centerPanelClassName}
            onMouseDown={(e) => e.stopPropagation()}
            style={centerPanelCss}
          >
            {props.children}
          </div>
        )}
      </>
    )
  }
}
