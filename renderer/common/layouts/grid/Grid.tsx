import React, { useState } from 'react'
import BaseTile from './tiles/BaseTile'
import BasePanel from './panels/BasePanel'
import { Tile, TileType } from '../../../models/tile'

const tiles: Tile[] = [
  {
    type: TileType.MAP
  },
  {
    type: TileType.NEWS
  },
  {
    type: TileType.POI
  },
  {
    type: TileType.WEATHER
  }
]

export default function Grid() {
  const [centerPanel, setCenterPanel] = useState(<></>)

  const boxOrder = [
    [1, 2, 3, 4],
    [2, 4, 1, 3],
    [4, 3, 2, 1],
    [3, 1, 4, 2]
  ]

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [orderStatus, setOrderStatus] = useState<number>(0)

  function setCenter(panel: React.JSX.Element): void {
    if (!isOpen) {
      setIsOpen(true)
      setCenterPanel(panel)
    }
  }

  function handleOutsideClick(): void {
    if (isOpen) setIsOpen(false)
  }

  function handleRotationButtonClick(event: React.FormEvent): void {
    event.stopPropagation()
    if (orderStatus === 3) setOrderStatus(0)
    else setOrderStatus(orderStatus + 1)
  }

  return (
    <div className="grid grid-cols-50/50 z-10" onClick={handleOutsideClick}>
      {tiles.map((tile, index) => (
        <BaseTile
          key={index}
          type={tile.type}
          isOpen={isOpen}
          position={boxOrder[orderStatus][index]}
          setCenter={setCenter}
        ></BaseTile>
      ))}
      <BasePanel openStatus={isOpen}>{centerPanel}</BasePanel>
      {!isOpen && (
        <button id="rotation_btn" onClick={handleRotationButtonClick} className="z-10"></button>
      )}
    </div>
  )
}
