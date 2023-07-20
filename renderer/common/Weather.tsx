import React, { useContext } from 'react'
import { WeatherContext } from '../utils/Context'
import { type PropsWithChildren } from 'react'

type showSomething = (msg: string) => void

interface Props {
  showSomething: showSomething
}

const weatherDetails = 'https://react-redux.js.org/'

//const err = new Error ('einen Systemfehler hier')

export default function Weather(props: PropsWithChildren<Props>): React.JSX.Element {
  const content = useContext(WeatherContext) //get value from Panel

  return (
    <div
      id="weather"
      onClick={() => {
        //e.stopPropagation()
        props.showSomething(weatherDetails)
      }}
    >
      {content}
    </div>
  )
}
