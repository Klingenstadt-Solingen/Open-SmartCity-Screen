import React from 'react'
import dynamic from 'next/dynamic'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../utils/dexie'

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
    return <></>
  } else {
    if (screen.state.name === 'INACTIVE') {
      return <div className="text-8xl">{screen.name}</div>
    } else {
      if (screen.layoutType.name === 'GRID') {
        return <Grid></Grid>
      } else if (screen.layoutType.name === 'DIASHOW') {
        return <Diashow></Diashow>
      }
    }
  }
}

export default Dashboard
