import React from 'react'
import dynamic from 'next/dynamic'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../utils/dexie'
import Header from '../common/layouts/grid/Header'
import Footer from '../common/layouts/grid/Footer'

interface Props {
  isParseOnline: boolean
}
//aaa
// eslint-disable-next-line sonarjs/cognitive-complexity
const Dashboard = ({ isParseOnline }: Props) => {
  const screen = useLiveQuery(async () => {
    return db.screen.toCollection().first()
  })

  const layoutConfig = useLiveQuery(async () => {
    return db.layoutConfig.toCollection().first()
  })

  //Prevent any Serverside Rendering
  const Grid = dynamic(() => import('../common/layouts/grid/Grid'), {
    ssr: false
  })

  const Diashow = dynamic(() => import('../common/layouts/diashow/Diashow'), {
    ssr: false
  })

  if (typeof screen === 'undefined') {
    return (
      <div className="h-screen w-screen bg-primary-color flex justify-center items-center text-8xl text-on-primary-color">
        No Screen Defined
      </div>
    )
  } else {
    if (screen.state?.name !== 'ACTIVE' || typeof layoutConfig === 'undefined') {
      return (
        <div className="text-center w-full h-screen items-center justify-center bg-primary-color flex flex-col flex-nowrap">
          <img className="w-[200px] mb-[3vh]" src="/images/city-logo.png" />
          <div className="text-4xl w-full text-secondary-color leading-relaxed">
            Diese Stele wird gerade konfiguriert.
            <br />
            Kommen Sie gerne später wieder!
          </div>
          <div className="text-4xl w-full text-on-primary-color absolute bottom-20">
            {screen.name}
          </div>
        </div>
      )
    } else {
      return (
        <div
          className={
            layoutConfig.showHeader
              ? layoutConfig.showFooter
                ? 'w-screen h-screen grid grid-rows-headerFooter bg-primary-color'
                : 'w-screen h-screen grid grid-rows-header bg-primary-color'
              : layoutConfig.showFooter
              ? 'w-screen h-screen grid grid-rows-footer bg-primary-color'
              : 'w-screen h-screen grid grid-rows-full bg-primary-color'
          }
        >
          {layoutConfig.showHeader && (
            <div className="h-full flex items-center">
              <Header />
            </div>
          )}
          {(screen.layoutType?.name === 'DIASHOW' ||
            !isParseOnline ||
            screen.layoutType === undefined) && (
            <div className="h-full w-screen">
              <Diashow />
            </div>
          )}
          {screen.layoutType?.name === 'GRID' && isParseOnline && (
            <div className="h-full w-screen">
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
