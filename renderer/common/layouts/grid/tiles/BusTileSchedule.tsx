import React, { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../../utils/dexie'
import Parse from 'parse'
import ImagePanel from '../panels/ImagePanel'
import { TransportInfo } from '../../../../models/transport-info'

let completeVrrInfos: Promise<TransportInfo> = null

type setCenter = (panel: React.JSX.Element) => void

interface Props {
  setCenter: setCenter
}

export default function BusTileDeparture(props: Props): React.JSX.Element {
  const [nearestBusStopName, setNearestBusStopName] = useState<string>('')
  const [nearestBusStopId, setNearestBusStopId] = useState<string>('')
  const [busServingList, setBusServingList] = useState([])

  const screen = useLiveQuery(() => {
    return db.screen.toCollection().first()
  })

  Parse.initialize('***REMOVED***')
  Parse.serverURL = 'https://parse.solingen.de/'
  Parse.masterKey = 'enrTPQGtJX8QqnPjre7hjSfnrwtbQZ2b'

  let nearestBusStopId_tmp = ''
  let nearestBusStopName_tmp = ''

  async function getBusInfos(lat: number, lon: number) {
    completeVrrInfos = await Parse.Cloud.run(
      'vrrStt',
      { lat: lat, lon: lon },
      { useMasterKey: true }
    )

    if (completeVrrInfos[''].itdOdvAssignedStops instanceof Array) {
      nearestBusStopId_tmp = completeVrrInfos[''].itdOdvAssignedStops[0].stopID
      nearestBusStopName_tmp = completeVrrInfos[''].itdOdvAssignedStops[0].name
    } else if (completeVrrInfos[''].itdOdvAssignedStops instanceof Object) {
      nearestBusStopId_tmp = completeVrrInfos[''].itdOdvAssignedStops.stopID
      nearestBusStopName_tmp = completeVrrInfos[''].itdOdvAssignedStops.name
    }

    if (
      nearestBusStopId_tmp !== undefined &&
      nearestBusStopId_tmp !== null &&
      nearestBusStopId_tmp !== ''
    ) {
      return await Parse.Cloud.run(
        'vrrServingLines',
        { stopID: nearestBusStopId_tmp },
        { useMasterKey: true }
      )
    }
  }

  async function getPDF(stopID: string, stateless: string) {
    return await Parse.Cloud.run(
      'vrrPDF',
      { stopID: stopID, stateless: stateless },
      { useMasterKey: true }
    )
  }

  useEffect(() => {
    getBusInfos(screen?.location.latitude, screen?.location.longitude)
      .then((res) => {
        if (res instanceof Array && res[0] instanceof Object) {
          setBusServingList(res)
          setNearestBusStopName(nearestBusStopName_tmp)
          setNearestBusStopId(nearestBusStopId_tmp)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }, [screen?.location])

  return (
    <div className="w-full h-full bg-solingen-blue">
      <div className="pt-20 pb-20 flex flex-col gap-5 flex-wrap w-full h-full whitespace-nowrap overflow-hidden">
        {busServingList.map((item, index) => {
          if (index < 10)
            return (
              <button
                key={index}
                className="mb-5 mx-10 bg-solingen-grey text-black font-extrabold text-2xl p-4 h-25 rounded-lg"
                onClick={() => {
                  getPDF(nearestBusStopId, item.mode.diva.line)
                    .then((res) => {
                      props.setCenter(<ImagePanel imgAlt="" imgSrc={res} fileType=""></ImagePanel>)
                    })
                    .catch((err) => {
                      console.log(err)
                      alert('Keine PDF-Daten!')
                    })
                }}
              >
                {item.mode.number} nach
                <br />
                {item.mode.destination}
              </button>
            )
        })}
      </div>
    </div>
  )
}
