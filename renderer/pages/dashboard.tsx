import React from 'react'
import dynamic from 'next/dynamic'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../utils/dexie'
import Header from '../common/layouts/grid/Header'
import Footer from '../common/layouts/grid/Footer'

interface Props {
  isParseOnline: boolean
}
// eslint-disable-next-line sonarjs/cognitive-complexity
const Dashboard = ({ isParseOnline }: Props) => {
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
        <div className="text-center w-full h-[100vh] items-center justify-center bg-solingen-blue flex flex-col flex-nowrap">
          <img
            className="w-[200px] mb-[3vh]"
            src="/images/button_menschsolingen_175px_2_0e8ecd94f8.png"
          />
          <div className="text-4xl w-full text-solingen-yellow leading-relaxed">
            Diese Stele wird gerade konfiguriert.
            <br />
            Kommen Sie gerne später wieder!
          </div>
          <div className="text-4xl w-full text-white absolute bottom-20">{screen.name}</div>
        </div>
      )
    } else {
      return (
        <div
          className={
            layoutConfig.showHeader
              ? layoutConfig.showFooter
                ? 'w-[100vw] h-[100vh] grid grid-rows-headerFooter bg-solingen-blue'
                : 'w-[100vw] h-[100vh] grid grid-rows-header bg-solingen-blue'
              : layoutConfig.showFooter
              ? 'w-[100vw] h-[100vh] grid grid-rows-footer bg-solingen-blue'
              : 'w-[100vw] h-[100vh] grid grid-rows-full bg-solingen-blue'
          }
        >
          {layoutConfig.showHeader && isParseOnline && (
            <div>
              <Header />
            </div>
          )}
          {(screen.layoutType.name === 'DIASHOW' || !isParseOnline) && (
            <div className="w-[100vw]">
              <Diashow />
            </div>
          )}
          {screen.layoutType.name === 'GRID' && isParseOnline && (
            <div className="h-full">
              <Grid />
            </div>
          )}
          {(layoutConfig.showFooter || !isParseOnline) && <Footer isOnline={isParseOnline} />}
        </div>
      )
    }
  }
}

export default Dashboard
