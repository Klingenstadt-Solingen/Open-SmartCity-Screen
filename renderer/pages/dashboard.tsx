import React from 'react'
import dynamic from 'next/dynamic'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../utils/dexie'
import Header from '../common/layouts/grid/Header'
import Footer from '../common/layouts/grid/Footer'

const Dashboard = () => {
  const screen = useLiveQuery(async () => {
    return await db.screen.toCollection().first()
  })

  //Prevent any Serverside Rendering
  const Grid = dynamic(() => import('../common/layouts/grid/Grid'), {
    ssr: false
  })

  const Diashow = dynamic(() => import('../common/layouts/diashow/Diashow'), {
    ssr: false
  })

  if (typeof screen === 'undefined') {
    return <div className="text-8xl">No Screen Defined</div>
  } else {
    if (screen.state?.name === 'INACTIVE') {
      return (
        <div className="text-8xl text-center flex h-[100vh] items-center justify-center">
          {screen.name}
        </div>
      )
    } else {
      if (screen.layoutType?.name === 'GRID') {
        if (screen.showHeaderAndFooter) {
          return (
            <div className="w-[100vw] h-[100vh] grid grid-rows-base">
              <Header />
              <div className="h-full">
                <Grid />
              </div>
              <Footer />
            </div>
          )
        } else {
          return <Grid />
        }
      } else if (screen.layoutType?.name === 'DIASHOW') {
        return (
          <div className="w-[100vw] h-[100vh]">
            <Diashow></Diashow>
          </div>
        )
      } else {
        return <div className="text-8xl text-center">{screen.name}</div>
      }
    }
  }
}

export default Dashboard
