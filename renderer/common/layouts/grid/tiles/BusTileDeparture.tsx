import React, { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../../utils/dexie'
import Parse from 'parse'
import { TransportInfo } from '../../../../models/transport-info'

let completeVrrInfos: Promise<TransportInfo> = null

export default function BusTileDeparture(): React.JSX.Element {
  const [nearestBusStopName, setNearestBusStopName] = useState<string>('')
  const [busDepartureList, setBusDepartureList] = useState([])

  const screen = useLiveQuery(() => {
    return db.screen.toCollection().first()
  })

  Parse.initialize('***REMOVED***')
  Parse.serverURL = 'https://parse.solingen.de/'
  Parse.masterKey = 'enrTPQGtJX8QqnPjre7hjSfnrwtbQZ2b'

  async function getBusInfos(lat: number, lon: number) {
    let nearestBusStopId = ''
    completeVrrInfos = await Parse.Cloud.run(
      'vrrStt',
      { lat: lat, lon: lon },
      { useMasterKey: true }
    )

    if (completeVrrInfos[''].itdOdvAssignedStops instanceof Array)
      nearestBusStopId = completeVrrInfos[''].itdOdvAssignedStops[0].stopID
    else if (completeVrrInfos[''].itdOdvAssignedStops instanceof Object)
      nearestBusStopId = completeVrrInfos[''].itdOdvAssignedStops.stopID

    return await Parse.Cloud.run(
      'vrrDm',
      { stopID: nearestBusStopId, line: undefined },
      { useMasterKey: true }
    )
  }

  useEffect(() => {
    getBusInfos(screen?.location.latitude, screen?.location.longitude).then((res) => {
      if (res instanceof Array && res[0] instanceof Object) setNearestBusStopName(res[0].stopName)
      setBusDepartureList(res)
    })
  }, [completeVrrInfos])

  return (
    <table className="table-auto w-full font-bold tracking-wide text-black">
      <tbody>
        <tr>
          <th colSpan={3} className="font-extrabold text-3xl bg-solingen-yellow text-left pl-12">
            {nearestBusStopName}
          </th>
        </tr>
        {busDepartureList.map((item, index) => {
          if (index < 6)
            return (
              <tr
                key={index}
                className={
                  index % 2 !== 0
                    ? 'bg-gray-300 text-left font-normal text-2xl'
                    : 'text-left font-normal text-2xl'
                }
              >
                <td className="font-extrabold pl-12">{item.servingLine.number}</td>
                <td>{item.servingLine.direction}</td>
                <td>{item.countdown} Min</td>
              </tr>
            )
        })}
      </tbody>
    </table>
  )
}
