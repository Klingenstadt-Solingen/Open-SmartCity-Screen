import React, { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../../utils/dexie'
import Parse from 'parse'

interface Props {
  isOpen: boolean
}

export default function BusTileDeparture(props: Props): React.JSX.Element {
  const screen = useLiveQuery(async () => {
    return db.screen.toCollection().first()
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [departures, setDepartures] = useState<any[]>([])

  useEffect(() => {
    if (typeof screen !== 'undefined') {
      Parse.Cloud.run(
        'mobility',
        {
          type: 'public-transport',
          lat: screen.location.latitude,
          lon: screen.location.longitude
        },
        { useMasterKey: true }
      ).then((a) => {
        setDepartures(a[0].availableOptions)
      })
      setInterval(() => {
        Parse.Cloud.run(
          'mobility',
          {
            type: 'public-transport',
            lat: screen.location.latitude,
            lon: screen.location.longitude
          },
          { useMasterKey: true }
        ).then((a) => {
          setDepartures(a[0].availableOptions)
        })
      }, 1000 * 30)
    }
  }, [screen])

  if (typeof departures !== 'undefined' && departures.length) {
    return (
      <div
        className={
          props.isOpen
            ? 'p-8 w-full h-full opacity-0 transition-opacity transition-app-speed'
            : 'p-8 w-full h-full opacity-100 transition-opacity transition-app-speed'
        }
      >
        {props.isOpen}
        <table className="w-full h-full tracking-wide text-on-background-color">
          <tbody>
            {departures.map((item, index) => {
              if (index < 6)
                return (
                  <tr key={index} className="a text-5xl">
                    <td
                      className={
                        index % 2 === 0
                          ? 'text-primary-color p-3'
                          : 'text-primary-color bg-background-color-dark p-3'
                      }
                    >
                      {item.shortName}
                    </td>
                    <td
                      className={
                        index % 2 === 0 ? 'text-left' : 'text-left bg-background-color-dark '
                      }
                    >
                      {item.name}
                    </td>
                    <td className={index % 2 === 0 ? '' : 'bg-background-color-dark '}>
                      {item.deparureTimeEstimated
                        ? Math.floor(
                            (new Date(item.deparureTimeEstimated).getTime() -
                              new Date().getTime()) /
                              60000
                          ) + 1
                        : Math.floor(
                            (new Date(item.departureTimePlanned).getTime() - new Date().getTime()) /
                              60000
                          ) + 1}
                      Min.
                    </td>
                  </tr>
                )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}
