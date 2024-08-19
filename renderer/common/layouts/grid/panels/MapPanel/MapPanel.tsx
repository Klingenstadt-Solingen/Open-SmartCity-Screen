import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { fromLonLat } from 'ol/proj'
import { db } from '../../../../../utils/dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import { PoiCategory } from '../../../../../models/poi-category'
import { POI } from '../../../../../models/poi'
import { environment } from '../../../../../environment'
import Parse from 'parse'
import Close from '../../../../icons/Close'

const MapBase = dynamic(async () => await import('./BaseMap'), {
  loading: () => <p>Lade Karte...</p>,
  ssr: false
})

interface Props {
  setAccessabilityCode?: (number) => void
  setShowKeyboard?: (boolean) => void
  keyboardChange?: string
  preSelected?: string
}

export default function MapPanel(props: Props) {
  const screen = useLiveQuery(async () => {
    return db.screen.toCollection().first()
  })

  const categories = useLiveQuery(async () => {
    return db.poiCategories.toArray()
  })

  const pois = useLiveQuery(async () => {
    return db.pois.toArray()
  })

  const [detailSelection, setDetailSelection] = useState<PoiCategory>()
  const [displayedPoiFilter, setDisplayedPoiFilter] = useState<string[]>([])
  const [displayedPois, setDisplayedPois] = useState<POI[]>([])
  const [showDetailSelection, setShowDetailSelection] = useState(false)
  const [tripSelection, setTripSelection] = useState<any>()
  const [trip, setTrip] = useState<any>()

  function getTrip(
    from: { latitude: number; longitude: number },
    to: { latitude: number; longitude: number }
    // ): Promise<[{ trips: [{ coords: [number]; interchange: { coords: [number] } }] }]> {
  ): Promise<any[]> {
    return new Promise((resolve) => {
      Promise.all([
        Parse.Cloud.run('pt-stop-nearby', { lat: from.latitude, lon: from.longitude }),
        Parse.Cloud.run('pt-stop-nearby', { lat: to.latitude, lon: to.longitude })
      ]).then((a) => {
        Parse.Cloud.run('pt-trip', {
          from: {
            geoPoint: '[' + from.latitude + ', ' + from.longitude + ']',
            stop: a[0].stops[0].properties.stopId
          },
          to: {
            geoPoint: '[' + to.latitude + ', ' + to.longitude + ']',
            stop: a[1].stops[0].properties.stopId
          },
          trip: { tz: 'Europe/Berlin' }
        }).then((a) => {
          resolve(a)
        })
      })
    })
  }

  function tripTo(longitude: number, latitude: number) {
    getTrip(
      { longitude: screen.location.longitude, latitude: screen.location.latitude },
      {
        longitude: longitude,
        latitude: latitude
      }
    ).then((a) => {
      const seen = []
      const b = a.filter((el) => {
        const duplicate = seen.includes(el.trips[0].destination.name)
        seen.push(el.trips[0].destination.name)
        return !duplicate
      })
      if (b.length > 1) {
        setTripSelection(b.slice(0, 3))
        setTrip(undefined)
      } else {
        setTrip(b[0])
      }
    })
  }

  useEffect(() => {
    if (typeof categories !== 'undefined' && typeof pois !== 'undefined') {
      switch (props.preSelected) {
        case 'preSelect1':
          setShowDetailSelection(true)
          setDetailSelection(categories.find((category) => category.name === 'Freifunk'))
          setDisplayedPoiFilter(['Online'])
          break
        case 'preSelect2':
          setShowDetailSelection(true)
          setDetailSelection(categories.find((category) => category.name === 'Übernachten'))
          setDisplayedPoiFilter(['Hotel'])
          break
        case 'preSelect3':
          setShowDetailSelection(true)
          setDetailSelection(categories.find((category) => category.name === 'Freizeit'))
          setDisplayedPoiFilter(['Museen und Bildung', 'Sport und Spiel'])
          break
      }
    }
  }, [categories, pois])

  useEffect(() => {
    if (typeof pois !== 'undefined') {
      setDisplayedPois(
        pois
          .filter((poi) => {
            return displayedPoiFilter.includes(
              poi.details.find(
                (detail) => detail.filterField === detailSelection?.filterFields[0].field
              )?.value
            )
          })
          .filter((poi) => poi.name.toLowerCase().includes(props.keyboardChange.toLowerCase()))
      )
    }
  }, [displayedPoiFilter, props.keyboardChange])

  if (typeof screen === 'undefined') return <p>Kein Screen gefunden</p>
  if (typeof categories === 'undefined') return <p>Keine Kategorien gefunden</p>
  if (typeof pois === 'undefined') return <p>Keine POIs gefunden</p>
  else {
    const center = fromLonLat([screen.location?.longitude, screen.location?.latitude])
    const zoom = 18

    return (
      <>
        <div
          className="w-screen h-full grid"
          style={{
            gridTemplateRows:
              'auto minmax(0, min-content) minmax(0, min-content) minmax(0, min-content)'
          }}
        >
          <div
            className="h-full w-full grid grid-flow-col"
            style={{ gridTemplateColumns: '10fr auto' }}
          >
            <MapBase
              pois={displayedPois}
              center={center}
              zoom={zoom}
              trip={trip}
              tripTo={tripTo}
              showRoute={true}
              showInfo={true}
            />
            {trip && (
              <div className="flex flex-col p-10 bg-primary-color text-on-primary-color h-full w-[25rem] text-2xl">
                <div className="w-full h-min flex justify-between">
                  <span className="text-4xl text-secondary-color font-bold">Reiseinfos:</span>
                  <button
                    onMouseDown={() => {
                      setTrip(undefined)
                    }}
                    className="bg-gray-500 text-on-secondary-color bg-opacity-50 aspect-square h-full rounded-md"
                  >
                    <Close
                      width="100%"
                      height="2rem"
                      fill={environment.onPrimaryColor || '#FFFFFF'}
                    />
                  </button>
                </div>
                <div className="h-full grid grid-flow-row">
                  {trip.trips.map((t, index) => {
                    return (
                      <>
                        <div
                          key={index}
                          className="w-full flex flex-row justify-between items-center"
                        >
                          <img
                            width="12%"
                            src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png"
                          ></img>
                          {t.origin.name}
                        </div>
                        <div className="py-10 px-5 h-full border-l-4 w-full ml-[1.2rem] flex flex-col items-start justify-around">
                          {t.duration && (
                            <span className="text-lg">
                              Dauer: {Math.round(t.duration / 60)} Min.
                            </span>
                          )}

                          {t.transportation && (
                            <span className="text-lg">{t.transportation.name}</span>
                          )}
                        </div>

                        {trip.trips.length === index + 1 ? (
                          <div className="w-full flex flex-row justify-between items-center">
                            <img
                              width="12%"
                              src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png"
                            ></img>
                            {t.destination?.name}
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    )
                  })}
                </div>
              </div>
            )}
            {tripSelection && (
              <div className="flex flex-col p-10 bg-primary-color text-on-primary-color h-full w-[25rem] text-2xl">
                <div className="w-full h-min flex justify-around">
                  <span className="text-4xl text-secondary-color font-bold">
                    Verbindung Wählen:
                  </span>
                  <button
                    onMouseDown={() => {
                      setTripSelection(undefined)
                      setTrip(undefined)
                    }}
                    className="bg-gray-500 text-on-secondary-color bg-opacity-50 aspect-square h-full rounded-md"
                  >
                    <Close
                      width="100%"
                      height="2rem"
                      fill={environment.onPrimaryColor || '#FFFFFF'}
                    ></Close>
                  </button>
                </div>
                <div className="mt-10 gap-5 grid grid-flow-row items-center">
                  {tripSelection.map((t, index) => {
                    return (
                      <>
                        <button
                          key={index}
                          className="w-full bg-secondary-color rounded-xl text-on-secondary-color p-3 h-min flex flex-col justify-around items-start text-center border border-secondary-color"
                          onMouseDown={() => {
                            for (let i = 0; i <= t?.trips.length; i++) {
                              setTripSelection(undefined)
                              setTrip(t)
                            }
                          }}
                        >
                          Über: {t.trips[0].destination.name} <br />
                          Mit: {t.trips[0].transportation.name}
                        </button>
                      </>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
          {!trip && !tripSelection && (
            <>
              <div className="bg-secondary-color text-3xl text-primary-color font-bold py-3 flex flex-row justify-center gap-14 items-center">
                <span>Was suchen Sie?</span>
                <div>
                  <input
                    onFocus={() => {
                      props.setAccessabilityCode(1)
                      props.setShowKeyboard(true)
                    }}
                    onBlur={() => {
                      props.setAccessabilityCode(0)
                      props.setShowKeyboard(false)
                    }}
                    value={props.keyboardChange}
                    readOnly
                    className="w-[50vw] rounded-xl p-2"
                    placeholder="Suchbegriff eingeben"
                  ></input>
                </div>
              </div>
              <div
                className="transition-all h-full px-2 py-2 bg-primary-color duration-500 flex overflow-x-scroll scrollbar-hide text-on-primary-color"
                style={showDetailSelection === false ? { marginBottom: '-15%' } : {}}
              >
                <div
                  className="w-full gap-2 grid grid-rows-2 grid-flow-col items-around py-2"
                  style={{ gridAutoColumns: '1fr' }}
                >
                  {!detailSelection && (
                    <button
                      className={
                        'bg-on-primary-color text-lg opacity-80 rounded-xl p-2 text-on-secondary-color h-full whitespace-nowrap'
                      }
                    >
                      Alle
                    </button>
                  )}
                  {detailSelection &&
                    pois
                      .filter((poi) => poi.poiCategory === detailSelection?.sourceId)
                      .map((poi) => {
                        const a = poi.details.find(
                          (detail) => detail.filterField === detailSelection?.filterFields[0].field
                        )
                        return a ? a.value : 'Sonstige'
                      })
                      .filter((value, index, self) => {
                        return self.indexOf(value) === index
                      })
                      .map((value, index) => {
                        return (
                          <button
                            onMouseDown={() => {
                              if (displayedPoiFilter.includes(value))
                                setDisplayedPoiFilter(
                                  displayedPoiFilter.filter((poi) => poi !== value)
                                )
                              else setDisplayedPoiFilter([...displayedPoiFilter, value])
                            }}
                            className={
                              displayedPoiFilter.includes(value)
                                ? 'bg-secondary-color text-lg rounded-xl p-2 text-on-secondary-color h-full whitespace-nowrap'
                                : 'bg-on-primary-color text-lg opacity-80 rounded-xl p-2 text-on-secondary-color h-full whitespace-nowrap'
                            }
                            key={index}
                          >
                            {value.length > 30 ? value.substring(0, 30) + '...' : value}
                          </button>
                        )
                      })}
                </div>
              </div>
            </>
          )}
          {categories && (
            <div className="h-full bg-primary-color flex overflow-x-scroll scrollbar-hide text-on-primary-color">
              <div
                className="h-full w-full grid grid-flow-col items-around py-2"
                style={{ gridAutoColumns: '1fr' }}
              >
                {categories.map((category, index) => {
                  if (category.showCategory === 'true') {
                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center justify-center w-48"
                        onMouseDown={() => {
                          if (detailSelection?.name === category?.name) {
                            setDisplayedPoiFilter([])
                            setShowDetailSelection(false)
                            setTimeout(() => {
                              setDetailSelection(undefined)
                            }, 500)
                          } else {
                            setDisplayedPoiFilter([])
                            setShowDetailSelection(true)
                            setDetailSelection(category)
                          }
                        }}
                      >
                        <img
                          draggable="false"
                          className={
                            detailSelection?.name === category?.name && showDetailSelection
                              ? 'rounded-full bg-secondary-color duration-800 aspect-square mb-1 h-16 transition-all'
                              : 'rounded-full bg-background-color duration-800 aspect-square mb-1 opacity-70 h-16 transition-all'
                          }
                          src={category.iconPath + '/' + category.iconName + category.iconMimetype}
                        ></img>
                        <div>
                          <div className="text-lg inline-block whitespace-nowrap w-full">
                            {category.name}&nbsp;
                            <span className="text-secondary-color">{'>'}</span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          )}
        </div>
      </>
    )
  }
}
