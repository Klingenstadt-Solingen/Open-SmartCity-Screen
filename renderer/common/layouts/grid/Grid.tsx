import React, { useState } from 'react'
import BaseTile from './tiles/BaseTile'
import BasePanel from './panels/BasePanel'
import { Tile } from '../../../models/tile'

const tiles: Tile[] = [
  {
    type: { name: 'MAP' }
  },
  {
    type: { name: 'PRESSRELEASES' }
  },
  {
    type: { name: 'POI' }
  },
  {
    type: { name: 'WEATHER' }
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
    <div
      className="grid grid-cols-2 grid-rows-2 z-10 max-h-full min-h-full h-full w-full transition-[row-gap] duration-solingen-speed"
      style={isOpen ? { rowGap: '65%' } : { rowGap: '0' }}
      onClick={handleOutsideClick}
    >
      {tiles.map((tile, index) => (
        <BaseTile
          key={index}
          type={tile.type}
          isOpen={isOpen}
          position={boxOrder[orderStatus][index]}
          setCenter={setCenter}
        ></BaseTile>
      ))}
      <BasePanel isOpen={isOpen}>{centerPanel}</BasePanel>
      {!isOpen && (
        <button
          onClick={handleRotationButtonClick}
          className="z-10 absolute right-[3rem] bottom-[3rem] w-[8rem] h-[8rem] rounded-3xl bg-no-repeat bg-center bg-solingen-grey opacity-80"
          style={{
            backgroundImage: 'url("/images/svg/rotate.svg")',
            backgroundSize: '60%'
          }}
        ></button>
      )}
    </div>
  )
}
