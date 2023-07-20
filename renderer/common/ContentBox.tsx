import React from 'react'
import { type PropsWithChildren } from 'react'
import { useIsFirstRender } from 'usehooks-ts'

type showSomething = (msg: string) => void

interface orderCssProps {
  order: string
}

interface openCssProps {
  animation: string
}

interface Props {
  openStatus: boolean
  orderCss: orderCssProps
  openCss: openCssProps
  num: number
  text: string
  showSomething: showSomething
}

export default function ContentBox(props: PropsWithChildren<Props>): React.JSX.Element {
  let endCssData = {}
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

  return (
    <div
      id={props.num.toString()}
      className="content_boxes"
      style={endCssData}
      onClick={() => props.showSomething(props.num.toString())}
    >
      <br />
      <br />
      <h1>{props.num.toString()}</h1>
      <br />
      <br />
      <div className="description">{props.text}</div>
      <br />
      <br />
      {props.children}
    </div>
  )
}
