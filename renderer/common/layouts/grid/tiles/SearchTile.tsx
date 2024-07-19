import React from 'react'
type setCenter = (panel: React.JSX.Element) => void

interface Props {
  isOpen: boolean
  setCenter: setCenter
}

export default function SearchTile(props: Props): React.JSX.Element {
  return <div className="h-full w-full overflow-hidden">Todo</div>
}
