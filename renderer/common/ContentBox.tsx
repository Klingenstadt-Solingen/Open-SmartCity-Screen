import React, { type PropsWithChildren } from 'react'
import { useIsFirstRender } from 'usehooks-ts'
import NewsTile from './NewsTile'
import MapTile from './MapTile'
import POITile from './POITile'
import WeatherTile from './WeatherTile'

type showSomething = (msg: string) => void

interface orderCssProps {
  order: string
}

interface openCssProps {
  animation: string
}

interface news {
  id: number
  time: string
  title: string
  contentOfNews: string
}

interface Props {
  openStatus: boolean
  orderCss: orderCssProps
  openCss: openCssProps
  num: number
  text: string
  showSomething: showSomething
  test_news: news[]
}

export default function ContentBox(props: PropsWithChildren<Props>): React.JSX.Element {
  let endCssData = {}
  let endText: React.JSX.Element = null
  const resetBoxesToOriginalPos = { animation: 'closeAnimation 0.5s 1 forwards' }
  const isFirst = useIsFirstRender()

  if (props.openStatus) {
    if (props.orderCss.order === '1' || props.orderCss.order === '3') {
      endCssData = { ...props.openCss, marginLeft: '0', ...props.orderCss }
    } else {
      endCssData = { ...props.openCss, ...props.orderCss }
    }
  } else {
    let mTop = {}
    let mBottom = {}
    if (isFirst) {
      mTop = { marginTop: ' 0vh' }
      mBottom = { marginTop: ' 0vh' }
    } else {
      mTop = { marginTop: ' -25vh' }
      mBottom = { marginTop: ' 50vh' }
    }
    switch (props.orderCss.order) {
      case '1':
        endCssData = { ...mTop, marginLeft: '0', ...props.orderCss, ...resetBoxesToOriginalPos }
        break
      case '2':
        endCssData = { ...mTop, ...props.orderCss, ...resetBoxesToOriginalPos }
        break
      case '3':
        endCssData = { ...mBottom, marginLeft: '0', ...props.orderCss, ...resetBoxesToOriginalPos }
        break
      case '4':
        endCssData = { ...mBottom, ...props.orderCss, ...resetBoxesToOriginalPos }
        break
    }
  }

  switch (props.num.toString()) {
    case '1':
      endText = <MapTile showSomething={showMap} />
      break
    case '2':
      endText = <NewsTile details={props.test_news} showSomething={showNews} />
      break
    case '3':
      endText = <POITile showSomething={showPOI} />
      break
    case '4':
      endText = <WeatherTile showSomething={showWeather} />
      break
  }

  function showNews(msg: string) {
    props.showSomething(msg)
  }

  function showMap(msg: string) {
    props.showSomething(msg)
  }

  function showPOI(msg: string) {
    props.showSomething(msg)
  }

  function showWeather(msg: string) {
    props.showSomething(msg)
  }

  return (
    <div id={props.num.toString()} className="content_boxes" style={endCssData}>
      <div className="description">{endText}</div>
      <br />
      <br />
      {props.children}
    </div>
  )
}
