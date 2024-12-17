import React, { useEffect, useState } from 'react'
import { environment } from '../../../../environment'

interface Props {
  preSelectedIndex?: string
  objectId?: string
  title?: string
}
PoliticsPanel.displayName = 'PoliticsPanel'
export default function PoliticsPanel(props: Props): React.JSX.Element {
  const [results, setResults] = useState<Array<any>>([])

  const fetchData = async () => {
    const meetingUrl = environment.politicsServiceUrl + '/api/v1/agenda-items?meetingId='

    const memberUrl = environment.politicsServiceUrl + '/api/v1/memberships?personId='

    const settings = { method: 'Get' }

    let url = ''

    if (props.preSelectedIndex == 'meeting') url = meetingUrl + props.objectId
    else if (props.preSelectedIndex == 'member') url = memberUrl + props.objectId
    try {
      fetch(url, settings)
        .then((res) => res.json())
        .then((json) => {
          setResults(json)
        })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="h-full">
      <div className="w-full flex flex-col justify-start text-left p-10 pb-14 overflow-y-scroll scrollbar-hide h-full">
        <div className="text-4xl text-primary-color mb-5">{props.title}</div>

        {props.preSelectedIndex == 'member' && results && (
          <div className="text-left font-bold mb-4 w-full">
            {results[0]?.person.email.length != 0 && (
              <>
                <div className="text-2xl pl-[30px] mr-12 font-thin border-l-2 border-secondary-color text-on-background-color">
                  E-Mail
                </div>
                <div className="mr-12 text-xl my-2 text-on-background-color font-thin line-clamp-3">
                  {results[0]?.person.email.join(', ')}
                </div>
              </>
            )}
            <div className="mr-12 text-4xl my-10 text-secondary-color font-bold line-clamp-3">
              Mitgliedschaften
            </div>
          </div>
        )}
        {results && results?.length === 0 && (
          <div className="text-xl text-red-800">
            {props.preSelectedIndex == 'meeting' &&
              'Es wurden keine Ergebnisse gefunden. Evtl. haben Sie eine Sitzung aus der Zukunft aufgerufen.'}
            {props.preSelectedIndex == 'member' &&
              'Die URL ist noch falsch, bitte Rücksprache mit Niklas'}
          </div>
        )}
        {results &&
          results.map((item, index) => {
            if (props.preSelectedIndex == 'meeting') {
              return (
                <div key={index} className="text-left font-bold mb-4 w-full">
                  <div className="text-2xl pl-[30px]  mr-12 font-thin border-l-2 border-secondary-color text-on-background-color">
                    {item?.number} {item?.name}
                  </div>
                  <div className="mr-12 text-l my-2 text-on-background-color font-thin line-clamp-3">
                    {item?.public ? 'öffentlich' : 'nicht öffentlich'}
                  </div>
                </div>
              )
            } else if (props.preSelectedIndex == 'member') {
              return (
                <div key={index} className="text-left font-bold mb-4 w-full">
                  <div className="text-2xl pl-[30px]  mr-12 font-thin border-l-2 border-secondary-color text-on-background-color">
                    {item?.role}
                  </div>
                  <div className="mr-12 text-2xl my-2 text-primary-color line-clamp-3">
                    {item?.organizationName}
                  </div>
                </div>
              )
            }
          })}
      </div>
    </div>
  )
}
