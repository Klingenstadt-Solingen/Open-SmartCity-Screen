import { useLiveQuery } from 'dexie-react-hooks'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import { db } from '../../../../utils/dexie'

interface Props {
  isOpen: boolean
}

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

  let centerPanelClassName = ''
  if (isShowHeader) {
    if (isShowFooter) {
      centerPanelClassName = 'absolute text-center w-full h-[59vh] top-[22%]'
    } else {
      centerPanelClassName = 'absolute text-center w-full h-[61vh] top-[23%]'
    }
  } else {
    if (isShowFooter) {
      centerPanelClassName = 'absolute text-center w-full h-[63vh] top-[17%]'
    } else {
      centerPanelClassName = 'absolute text-center w-full h-[65vh] top-[17.5%]'
    }
  }

  if (typeof screen !== 'undefined') {
    return (
      <>
        {showContent && (
          <div
            className={centerPanelClassName}
            onClick={(e) => e.stopPropagation()}
            style={props.isOpen ? { zIndex: 0 } : { zIndex: -1 }}
          >
            {props.children}
          </div>
        )}
      </>
    )
  }
}
