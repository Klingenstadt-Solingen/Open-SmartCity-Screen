import React, { useState } from 'react'
import PoliticsPanel from '../panels/PoliticsPanel'
import PeopleIcon from '../../../icons/PeopleIcon'
import dayjs from 'dayjs'
import Clock from '../../../icons/Clock'
import { environment } from '../../../../environment'
import { Politics } from '../../../../models/politics'
import { Meeting } from '../../../../models/meeting'
import { Member } from '../../../../models/member'

type setCenter = (panel: React.JSX.Element) => void

interface Props {
  isOpen: boolean
  tilePos: number
  setCenter: setCenter
  accessabilityCode: number
  config: any
}

export default function PoliticsTile(props: Props): React.JSX.Element {
  let cssForTitle: React.CSSProperties = {}
  if (props.isOpen) {
    if (props.tilePos < 3) {
      switch (props.accessabilityCode) {
        case 0:
          cssForTitle = { marginBottom: '5rem' }
          break
        case 1:
          cssForTitle = { opacity: 0, marginBottom: '5rem' }
          break
        case 2:
          cssForTitle = {
            position: 'absolute',
            bottom: '4.4rem',
            marginBottom: '0',
            marginLeft: '3rem'
          }
          break
      }
    } else {
      switch (props.accessabilityCode) {
        case 0:
          cssForTitle = { marginBottom: '5rem' }
          break
        case 1:
          cssForTitle = { marginBottom: '5rem' }
          break
        case 2:
          cssForTitle = { opacity: 0, marginBottom: '5rem' }
          break
      }
    }
  }
  const [isDetail, setIsDetail] = useState(false)
  const [dataType, setDataType] = useState('')
  const [results, setResults] = useState<Array<Politics> | Array<Meeting> | Array<Member>>()

  const fetchData = async (dataType: string) => {
    const districtObjectId = localStorage.getItem('district-object-id')

    const districtUrl = environment.politicsServiceUrl + '/api/v1/organisations/' + districtObjectId
    const meetingsUrl =
      environment.politicsServiceUrl + '/api/v1/meetings?organizationId=' + districtObjectId
    const membersUrl =
      environment.politicsServiceUrl + '/api/v1/memberships?organizationId=' + districtObjectId
    const settings = { method: 'Get' }

    let url = ''
    if (dataType == 'district') url = districtUrl
    else if (dataType == 'meetings') url = meetingsUrl
    else if (dataType == 'members') url = membersUrl
    try {
      fetch(url, settings)
        .then((res) => res.json())
        .then((json) => {
          if (dataType !== 'district') setResults(json)
          else setResults([json])
        })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  function loadInfos(dataType: string): void {
    setIsDetail(true)
    setDataType(dataType)
    fetchData(dataType)
  }

  return (
    <div className="h-full w-full p-6 overflow-hidden">
      <div className="bg-background-color-dark p-6 rounded-lg text-primary-color w-full h-full flex flex-col overflow-hidden">
        <div
          className="ml-4 text-left tracking-wide text-6xl font-bold mb-11"
          style={
            isDetail ? { ...cssForTitle, display: 'none' } : { ...cssForTitle, display: 'flex' }
          }
        >
          Politik im
          <br />
          Stadtbezirk.
        </div>
        <div
          className="w-full flex flex-col justify-between h-3/4 text-on-primary-color font-medium transition-opacity duration-app-speed"
          style={props.isOpen || isDetail ? { display: 'none' } : { display: 'flex' }}
        >
          <button
            className="text-3xl bg-primary-color rounded-xl h-[30%] p-5 flex justify-between"
            onMouseDown={() => loadInfos('district')}
          >
            <PeopleIcon height="100%" width="30%" stroke="#ffbf00" />
            <div className="self-end w-full text-right">
              Infos zur
              <br />
              Bezirksvertretung
            </div>
          </button>
          <button
            className="text-3xl bg-primary-color rounded-xl h-[30%] p-5 flex justify-between"
            onMouseDown={() => loadInfos('meetings')}
          >
            <PeopleIcon height="100%" width="30%" stroke="#ffbf00" />
            <div className="self-end w-full text-right whitespace-nowrap">
              Sitzungen
              <br /> der Bezirksvertretung
            </div>
          </button>
          <button
            className="text-3xl bg-primary-color rounded-xl h-[30%] p-5 flex justify-between"
            onMouseDown={() => loadInfos('members')}
          >
            <PeopleIcon height="100%" width="30%" stroke="#ffbf00" />
            <div className="self-end w-full text-right">
              Mitglieder der <br />
              Bezirksvertretung
            </div>
          </button>
        </div>
        <div
          className="w-full flex flex-col justify-between min-h-96 text-on-background-color font-medium transition-opacity duration-app-speed "
          style={isDetail ? { display: 'flex' } : { display: 'none' }}
        >
          <div className="text-xl pb-5 flex" onMouseDown={() => setIsDetail(false)}>
            <span className="text-secondary-color">&lt;&nbsp;&nbsp;</span>zurück
          </div>
          <span className="text-5xl pb-5 text-primary-color font-bold text-left">
            {dataType == 'district' && 'Infos zur Bezirksvertretung'}
            {dataType == 'meetings' && 'Sitzungen Bezirksvertretung'}
            {dataType == 'members' && 'Mitglieder der Bezirksvertretung'}
          </span>

          <div className="overflow-x-auto scrollbar-hide h-full">
            {results &&
              results.map((item, index) => {
                if (dataType == 'district') {
                  return (
                    <div key={index} className="text-left font-bold mb-4 w-full">
                      <div className="text-3xl pb-0 text-secondary-color font-bold text-center">
                        {item?.name}
                      </div>
                      <div className="text-center pb-5 w-full flex justify-center">
                        <img
                          src={localStorage.getItem('district-logo')}
                          width={160}
                          height={160}
                        ></img>
                      </div>
                      <div className="text-2xl pl-[30px] ml-8 mr-12 font-thin border-l-2 border-secondary-color text-on-background-color">
                        {item?.newestMayor?.role}
                      </div>
                      <div className="mx-12 text-2xl my-2 text-primary-color line-clamp-3">
                        {item?.newestMayor?.person?.formOfAddress}{' '}
                        {item?.newestMayor?.person?.firstName} {item?.newestMayor?.person?.lastName}
                      </div>
                      <div className="mt-8 text-2xl pl-[30px] ml-8 mr-12 font-thin border-l-2 border-secondary-color text-on-background-color">
                        Anschrift
                      </div>
                      <div className="mx-12 text-2xl my-2 text-primary-color line-clamp-3">
                        {item?.location?.streetAddress}
                        <br />
                        {item?.location?.postalCode} {item?.location?.locality}
                        <br />
                        {item?.location?.room}
                      </div>
                      <div className="flex">
                        <div className="w-2/4">
                          <div className="mt-8 text-2xl pl-[30px] ml-8 mr-12 font-thin border-l-2 border-secondary-color text-on-background-color">
                            Ratsmitglieder
                          </div>
                          <div className="mx-12 text-2xl my-2 text-primary-color line-clamp-3">
                            {item?.memberCount}
                          </div>
                        </div>
                        <div className="w-2/4">
                          <div className="mt-8 text-2xl pl-[30px]  mr-12 font-thin border-l-2 border-secondary-color text-on-background-color">
                            Stimmberechtigte
                          </div>
                          <div className="mx-12 text-2xl my-2 text-primary-color line-clamp-3">
                            {item?.votingMemberCount}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                } else if (dataType == 'members') {
                  return (
                    <div key={index} className="text-left font-bold mb-4 w-full">
                      <div className="text-xl pl-[30px] ml-8 mr-12 font-thin border-l-2 border-secondary-color text-on-background-color">
                        {item?.role}
                      </div>
                      <div className="mx-12 text-2xl mb-2 text-primary-color line-clamp-3">
                        {item?.person?.formOfAddress} {item?.person?.firstName}{' '}
                        {item?.person?.lastName}
                      </div>
                      <div
                        className="mx-12 text-l font-normal text-on-background-color"
                        onMouseDown={() =>
                          props.setCenter(
                            <PoliticsPanel
                              preSelectedIndex="member"
                              objectId={item?.person?.id}
                              title={
                                item?.person?.formOfAddress +
                                ' ' +
                                item?.person?.firstName +
                                ' ' +
                                item?.person?.lastName
                              }
                            ></PoliticsPanel>
                          )
                        }
                      >
                        <span className="text-secondary-color">&gt;&nbsp;&nbsp;</span>mehr Infos
                      </div>
                    </div>
                  )
                } else if (dataType == 'meetings') {
                  return (
                    <div key={index} className="text-left font-bold mb-8 w-full">
                      <div className="text-xl pl-[30px] ml-8 mr-12 font-thin border-l-2 border-secondary-color text-on-background-color">
                        {dayjs(new Date(item?.startDateTime)).format('DD.MMM YYYY')}
                      </div>
                      <div className="mx-12 text-2xl my-2 text-primary-color line-clamp-3">
                        {item?.name}
                      </div>

                      <div className="flex">
                        <div className="w-2/4">
                          <span className="pl-[30px] ml-8 mr-12 mt-3 font-thin text-normal text-on-background-color flex">
                            <Clock height="38" width="38" fill="#999"></Clock>
                            <p className="ml-3">
                              {dayjs(new Date(item?.startDateTime)).format('HH:mm')} -{' '}
                              {dayjs(new Date(item?.endDateTime)).format('HH:mm')}
                            </p>
                          </span>
                        </div>
                        <div className="w-2/4 text-right">
                          <button
                            className="h-10 rounded-xl text-l bg-secondary-color text-primary-color pl-3 pr-3 mr-10"
                            onMouseDown={() =>
                              props.setCenter(
                                <PoliticsPanel
                                  preSelectedIndex="meeting"
                                  objectId={item?.id}
                                  title={item?.name}
                                ></PoliticsPanel>
                              )
                            }
                          >
                            Tagesordnung
                            <span className="text-on-primary-color">&nbsp;&nbsp;&gt;</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                }
              })}
          </div>
        </div>
      </div>
    </div>
  )
}
