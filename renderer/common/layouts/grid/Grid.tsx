import React, { useEffect, useState } from 'react'
import BaseTile from './tiles/BaseTile'
import BasePanel from './panels/BasePanel'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../utils/dexie'
import ArrowUp from '../../icons/ArrowUp'
import ArrowDown from '../../icons/ArrowDown'
import Rotate from '../../icons/Rotate'
import KeyboardReact from 'react-simple-keyboard'

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function Grid() {
  const tiles = useLiveQuery(async () => {
    return db.tiles.limit(4).toArray()
  })

  const layoutConfig = useLiveQuery(async () => {
    return db.layoutConfig.toCollection().first()
  })

  const [centerPanel, setCenterPanel] = useState(<></>)
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false)
  const [keyboardChange, setKeyboardChange] = useState<string>('')

  const boxOrder = [
    [1, 2, 3, 4],
    [2, 4, 1, 3],
    [4, 3, 2, 1],
    [3, 1, 4, 2]
  ]

  const [isOpen, setIsOpen] = useState<boolean>(false)
  //accessabilityCode: 0-> middle, 1-> top, 2-> bottom
  const [accessabilityCode, setAccessabilityCode] = useState<number>(0)
  const [orderStatus, setOrderStatus] = useState<number>(0)
  const [shift, setShift] = useState<boolean>(false)

  function closePanel() {
    setIsOpen(false)
    setKeyboardChange('')
    setShowKeyboard(false)
    setAccessabilityCode(0)
  }

  function inactivityTime() {
    let time
    window.onload = resetTimer
    // DOM Events
    document.onmousemove = resetTimer
    document.onkeydown = resetTimer

    function resetTimer() {
      clearTimeout(time)
      time = setTimeout(() => {
        closePanel()
      }, 300000)
    }
  }

  useEffect(() => {
    inactivityTime()
  }, [])

  function setCenter(panel: React.JSX.Element): void {
    if (!isOpen) {
      setIsOpen(true)
      setCenterPanel(panel)
    }
  }

  function handleOutsideClick(): void {
    if (isOpen) {
      closePanel()
    }
  }

  function handleRotationButtonClick(event: React.FormEvent): void {
    event.stopPropagation()
    if (orderStatus === 3) setOrderStatus(0)
    else setOrderStatus(orderStatus + 1)
  }

  function handleToUpButtonClick(event: React.FormEvent): void {
    event.stopPropagation()
    setAccessabilityCode(1)
  }
  function handleToDownButtonClick(event: React.FormEvent): void {
    event.stopPropagation()
    setAccessabilityCode(2)
  }

  let baseTileContainerCss: React.CSSProperties = {}
  const baseTileContainerCss_tmp: React.CSSProperties = {
    rowGap: '47%',
    height: '138vh',
    maxHeight: '138vh'
  }
  if (isOpen) {
    switch (accessabilityCode) {
      case 0:
        baseTileContainerCss = { rowGap: '65%' }
        break
      case 1:
        if (layoutConfig.showHeader) {
          if (layoutConfig.showFooter) {
            baseTileContainerCss = { ...baseTileContainerCss_tmp, marginTop: '-35vh' }
          } else {
            baseTileContainerCss = {
              ...baseTileContainerCss_tmp,
              marginTop: '-36vh'
            }
          }
        } else {
          baseTileContainerCss = {
            ...baseTileContainerCss_tmp,
            marginTop: '-30vh'
          }
        }
        break
      case 2:
        if (layoutConfig.showHeader) {
          if (layoutConfig.showFooter) {
            baseTileContainerCss = {
              ...baseTileContainerCss_tmp,
              marginTop: '-17vh'
            }
          } else {
            baseTileContainerCss = {
              ...baseTileContainerCss_tmp,
              marginTop: '-15vh'
            }
          }
        } else {
          baseTileContainerCss = {
            ...baseTileContainerCss_tmp,
            marginTop: '-9vh'
          }
        }
        break
    }
  } else {
    baseTileContainerCss = { rowGap: '0' }
  }

  if (typeof tiles !== 'undefined' && tiles.length) {
    return (
      <div
        className="grid grid-cols-2 grid-rows-2 z-10 max-h-full min-h-full h-full w-full transition-all duration-app-speed bg-background-color"
        style={baseTileContainerCss}
        onMouseDown={handleOutsideClick}
      >
        {tiles
          .sort((a, b) => {
            return a.position - b.position
          })
          .map((tile, index) => (
            <BaseTile
              key={index}
              tile={tile}
              isOpen={isOpen}
              position={boxOrder[orderStatus][index]}
              setCenter={setCenter}
              accessabilityCode={accessabilityCode}
            ></BaseTile>
          ))}
        <BasePanel
          isOpen={isOpen}
          accessabilityCode={accessabilityCode}
          setAccessabilityCode={setAccessabilityCode}
          setShowKeyboard={setShowKeyboard}
          keyboardChange={keyboardChange}
        >
          {centerPanel}
        </BasePanel>
        {isOpen ? (
          <>
            {accessabilityCode !== 1 && (
              <div className="absolute w-screen flex justify-center top-[8rem]">
                <button
                  onMouseDown={handleToUpButtonClick}
                  className="z-10 flex justify-center items-center w-[7rem] h-[7rem] rounded-xl bg-background-color-dark opacity-80 border-gray-600 border shadow-md shadow-gray-600"
                >
                  <ArrowUp height="70%" width="70%"></ArrowUp>
                </button>
              </div>
            )}

            {accessabilityCode !== 2 && (
              <div className="absolute w-screen flex justify-center bottom-[8rem]">
                <button
                  onMouseDown={handleToDownButtonClick}
                  className="z-10 flex justify-center items-center w-[7rem] h-[7rem] rounded-xl bg-background-color-dark opacity-80 border-gray-600 border shadow-md shadow-gray-600"
                >
                  <ArrowDown height="70%" width="70%"></ArrowDown>
                </button>
              </div>
            )}
          </>
        ) : (
          <button
            onMouseDown={handleRotationButtonClick}
            className="z-10 flex justify-center items-center absolute right-[3rem] bottom-[3rem] w-[6rem] h-[6rem] rounded-3xl bg-background-color-dark opacity-86"
          >
            <Rotate height="70%" width="70%"></Rotate>
          </button>
        )}
        {showKeyboard && (
          <div
            className="absolute w-screen h-30 bottom-20 z-20 asd"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
            onMouseDown={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
          >
            <KeyboardReact
              layout={{
                default: [
                  '` 1 2 3 4 5 6 7 8 9 0 ß ´ {bksp}',
                  '{tab} q w e r t z u i o p ü +',
                  '{lock} a s d f g h j k l ö ä {enter}',
                  '{shift} y x c v b n m , . - {shift}',
                  '.com @ {space}'
                ],
                shift: [
                  '~ ! " § $ % & / ( ) = ? ` {bksp}',
                  '{tab} Q W E R T Z U I O P Ü *',
                  '{lock} A S D F G H J K L Ö Ä {enter}',
                  '{shift} Y X C V B N M ; : _ {shift}',
                  '.com @ {space}'
                ]
              }}
              layoutName={shift ? 'shift' : 'default'}
              onChange={(c) => {
                setKeyboardChange(c)
              }}
              onKeyPress={(c) => {
                if (c === '{lock}') {
                  setShift(!shift)
                }
                if (c === '{shift}') {
                  setShift(true)
                }
              }}
              onKeyReleased={(c) => {
                if (c === '{shift}') {
                  setShift(false)
                }
              }}
              disableButtonHold={true}
              stopMouseDownPropagation={true}
              stopMouseUpPropagation={true}
            ></KeyboardReact>
          </div>
        )}
      </div>
    )
  }
}
