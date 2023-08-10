import React, { PropsWithChildren, useEffect, useState } from 'react'

interface Props {
  openStatus: boolean
}

export default function BasePanel(props: PropsWithChildren<Props>): React.JSX.Element {
  const [showContent, setShowContent] = useState(props.openStatus)

  useEffect(() => {
    if (props.openStatus) {
      setShowContent(true)
    } else {
      const timer = setTimeout(() => setShowContent(false), 600)
      return () => clearTimeout(timer)
    }
  }, [props.openStatus])

  return (
    <div
      className=" absolute text-center w-full h-[56vh] mt-[22vh]"
      onClick={(e) => e.stopPropagation()}
      style={props.openStatus ? { zIndex: 0 } : { zIndex: -1 }}
    >
      {showContent && props.children}
    </div>
  )
}
