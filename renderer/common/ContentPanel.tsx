import React, { useState } from 'react'
import ContentBox from './ContentBox'
import ContentCenter from './ContentCenter'
import Weather from './Weather'
import { WeatherContext } from '../utils/Context'

const contentInWeather = 'Bitte Hier Klicken für Wetter in Aachen' // in Context Provider Value to WeatherComponent
let contentPassToCenter = ''

export default function ContentPanel() {
  const contents = [
    {
      num: 1,
      text: 'TEXT_1.'
    },
    {
      num: 2,
      text: 'TEXT_2.'
    },
    {
      num: 3,
      text: 'TEXT_3.'
    },
    {
      num: 4,
      text: 'TEXT_4.'
    }
  ]

  const isOpenState = [
    { animation: 'openTopAnimation 0.5s 1 forwards' },
    { animation: 'openBottomAnimation 0.5s 1 forwards' }
  ]

  const boxOrder = [
    [{ order: '1' }, { order: '2' }, { order: '3' }, { order: '4' }],
    [{ order: '2' }, { order: '4' }, { order: '1' }, { order: '3' }],
    [{ order: '4' }, { order: '3' }, { order: '2' }, { order: '1' }],
    [{ order: '3' }, { order: '1' }, { order: '4' }, { order: '2' }]
  ]

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [orderStatus, setOrderStatus] = useState<number>(0)
  // const [isShowInCenter, setIsShowInCenter] = useState<boolean>(false)

  function showMessage(msg: string): void {
    // setIsShowInCenter((isShownInCenter) => !isShownInCenter)
    contentPassToCenter = msg
  }

  function handleClick(): void {
    setIsOpen((prevState) => !prevState)
  }

  function handleButtonClick(event: React.FormEvent): void {
    event.stopPropagation()
    if (orderStatus === 3) setOrderStatus(0)
    else setOrderStatus(orderStatus + 1)
  }

  return (
    <WeatherContext.Provider value={contentInWeather}>
      <div id="content_panel" onClick={handleClick}>
        {contents.map((content, index) => (
          <ContentBox
            key={content.num}
            openStatus={isOpen}
            orderCss={boxOrder[orderStatus][index]}
            openCss={Number(boxOrder[orderStatus][index].order) < 3 ? isOpenState[0] : isOpenState[1]}
            {...content}
            showSomething={showMessage}
          >
            <Weather showSomething={showMessage} />
          </ContentBox>
        ))}
        <ContentCenter openStatus={isOpen} contentInCenter={contentPassToCenter}></ContentCenter>
        <button id="rotation_btn" onClick={handleButtonClick} style={isOpen ? { display: 'none' } : {}}>
          rotationBtn
        </button>
      </div>
    </WeatherContext.Provider>
  )
}
