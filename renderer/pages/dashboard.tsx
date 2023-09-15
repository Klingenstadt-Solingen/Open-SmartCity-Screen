import React from 'react'
import dynamic from 'next/dynamic'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../utils/dexie'
import Header from '../common/layouts/grid/Header'
import Footer from '../common/layouts/grid/Footer'

// eslint-disable-next-line sonarjs/cognitive-complexity
const Dashboard = () => {
  const screen = useLiveQuery(async () => {
    return await db.screen.toCollection().first()
  })

  const layoutConfig = useLiveQuery(async () => {
    return await db.layoutConfig.toCollection().first()
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
    if (screen.state?.name === 'INACTIVE' || typeof layoutConfig === 'undefined') {
      return (
        <div className="text-8xl text-center flex h-[100vh] items-center justify-center">
          {screen.name}
        </div>
      )
    } else {
      return (
        <div
          className={
            layoutConfig.showHeader
              ? layoutConfig.showFooter
                ? 'w-[100vw] h-[100vh] grid grid-rows-headerFooter'
                : 'w-[100vw] h-[100vh] grid grid-rows-header'
              : layoutConfig.showFooter
              ? 'w-[100vw] h-[100vh] grid grid-rows-footer'
              : 'w-[100vw] h-[100vh] grid grid-rows-full'
          }
        >
          {layoutConfig.showHeader && (
            <div>
              <Header />
            </div>
          )}
          {screen.layoutType.name === 'DIASHOW' && <Diashow />}
          {screen.layoutType.name === 'GRID' && (
            <div className="h-full">
              <Grid />
            </div>
          )}
          {layoutConfig.showFooter && <Footer />}
        </div>
      )
    }
  }
}

export default Dashboard
