import React, { useState, useEffect } from 'react'

interface Props {
  openStatus: boolean
  isUp: boolean
}

let endCss = {}

export default function Darkness({ openStatus, isUp }: Props): React.JSX.Element {
  if (isUp) endCss = {}
  else endCss = { bottom: '0px' }

  const [state, setState] = useState(false)

  useEffect(() => {
    setTimeout(() => setState(true), 250)
    return () => {
      setState(false)
    }
  }, [openStatus])

  return <>{openStatus && state ? <div className="darkPanel" style={endCss}></div> : <></>}</>
}
