import React from 'react'

interface Props {
  openStatus: boolean
  contentInCenter: string
}

export default function ContentCenter(props: Props): React.JSX.Element {
  function handleClick(e: React.FormEvent): void {
    e.stopPropagation()
  }

  return (
    <div onClick={(e) => handleClick(e)} id="content_center_area">
      {props.openStatus && <h1>{props.contentInCenter}</h1>}
    </div>
  )
}
