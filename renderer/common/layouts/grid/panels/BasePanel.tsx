import { useLiveQuery } from 'dexie-react-hooks'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import { db } from '../../../../utils/dexie'

interface Props {
  isOpen: boolean
}

export default function BasePanel(props: PropsWithChildren<Props>): React.JSX.Element {
  const screen = useLiveQuery(async () => {
    return await db.screen.toCollection().first()
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

  if (typeof screen !== 'undefined') {
    if (screen.showHeaderAndFooter) {
      return (
        <>
          {showContent && (
            <div
              className="absolute text-center w-full h-[59vh] top-[22%]"
              onClick={(e) => e.stopPropagation()}
              style={props.isOpen ? { zIndex: 0 } : { zIndex: -1 }}
            >
              {props.children}
            </div>
          )}
        </>
      )
    } else {
      return (
        <>
          {showContent && (
            <div
              className="absolute text-center w-full h-[65vh] top-[17.5%]"
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
}
