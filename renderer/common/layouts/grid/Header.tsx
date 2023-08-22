import { useLiveQuery } from 'dexie-react-hooks'
import React from 'react'
import { db } from '../../../utils/dexie'

export default function Header(): React.JSX.Element {
  const name = useLiveQuery(async () => {
    return (await db.screen.toCollection().first()).name
  })
  if (typeof name === 'undefined') {
    return <></>
  } else {
    return (
      <div className="text-6xl text-center text-solingen-yellow font-bold bg-solingen-blue border-gray-400 border-b py-5">
        Stele: {name}
      </div>
    )
  }
}
