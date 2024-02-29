//This eslint-disable comment mostly exists to provoke VSe
/* eslint-disable sonarjs/no-duplicate-string */
import React, { PropsWithChildren, useEffect, useState } from 'react'

import Parse, { Query, LiveQuerySubscription } from 'parse'
import { db } from '../../utils/dexie'
import { PressRelease } from '../../models/press-release'
import { IndexableType, Table } from 'dexie'
import { v4 as uuidv4 } from 'uuid'
import { uniqueNamesGenerator, Config, names } from 'unique-names-generator'

import { Screen } from '../../models/screen'
import { Weather } from '../../models/weather'
import { useLiveQuery } from 'dexie-react-hooks'
import { DiashowObject } from '../../models/diashowObject'
import { Tile } from '../../models/tile'

import fs, { unlink } from 'fs'
import { downloadDir } from '../../utils/constants'

import EventEmitter from 'events'
import { PoiCategory } from '../../models/poi-category'
import { POI } from '../../models/poi'
import { Grid } from '../../models/grid'
import { Diashow } from '../../models/diashow'
import { Layout } from '../../models/layout'
import { environment } from '../../environment'

EventEmitter.defaultMaxListeners = 20

export default function ApiComponent(props: PropsWithChildren): React.JSX.Element {
  const screen = useLiveQuery(() => {
    return db.screen.toCollection().first()
  })

  const layoutConfig = useLiveQuery(() => {
    return db.layoutConfig.toCollection().first()
  })

  const diashowConfig = useLiveQuery(() => {
    return db.diashowConfig.toCollection().first()
  })

  const gridConfig = useLiveQuery(() => {
    return db.gridConfig.toCollection().first()
  })

  const diashowObjects = useLiveQuery(() => {
    return db.diashowObjects.toArray()
  })

  const filesInDownload = getAllDFileInfos('' + downloadDir)

  const [isParseOnline] = useState<boolean>(true)

  //reference to subscriptions has to be saved in a state in order to cancel them later.
  const [weatherSubscription, setWeatherSubscription] = useState<LiveQuerySubscription>()
  const [layoutConfigSubscription, setLayoutConfigSubscription] = useState<LiveQuerySubscription>()
  const [gridConfigSubscription, setGridConfigSubscription] = useState<LiveQuerySubscription>()
  const [diashowConfigSubscription, setDiashowConfigSubscription] =
    useState<LiveQuerySubscription>()
  const [diashowObjectsSubscription, setDiashowObjectsSubscription] =
    useState<LiveQuerySubscription>()
  const [tilesSubscription, setTilesSubscription] = useState<LiveQuerySubscription>()

  //states to prevent multiple subscriptions
  const [gridConfigDirty, setGridConfigDirty] = useState<boolean>(false)
  const [diashowConfigDirty, setDiashowConfigDirty] = useState<boolean>(false)

  const [screenshotInterval, setScreenshotInterval] = useState<any>()

  function getAllDFileInfos(filePath: string) {
    let allFileNames = []
    let allFilePaths = []
    const alleFileInfos = { filename: allFileNames, filepath: allFilePaths }
    if (fs.existsSync(filePath)) {
      const files = fs.readdirSync(filePath)
      files.forEach((file) => {
        const currentFilePath = `${filePath}${file}`
        if (fs.lstatSync(currentFilePath).isDirectory()) {
          allFileNames = allFileNames.concat(getAllDFileInfos(currentFilePath))
          allFilePaths = allFilePaths.concat(getAllDFileInfos(currentFilePath))
        } else {
          allFileNames.push(file)
          allFilePaths.push(currentFilePath)
        }
      })
    }
    return alleFileInfos
  }

  /**
   * @returns appID from localStorage or creates new one if none is found
   */
  function getAppId(): string {
    if (localStorage.getItem('app-id')) {
      console.log('Found AppID: ', localStorage.getItem('app-id'))
      return localStorage.getItem('app-id')
    } else {
      const newAppId = uuidv4()
      localStorage.setItem('app-id', newAppId)
      console.log('Created AppID: ', newAppId)
      return newAppId
    }
  }

  /**
   * creates liveQuerySubscription and hooks it to IndexedDB Table. Use options to overwrite certain Event behavior
   * @param query
   * query to subscribe to
   * @param table
   * table to fill with query results
   * @param options
   * further options
   * @returns
   */
  async function subscribeTableToQuery<T>(
    query: Query<Parse.Object<T>>,
    table: Table<T, IndexableType>,
    options?: {
      initQuery?: Parse.Query
    }
  ) {
    const subscription = await query.subscribe()
    subscription.on('create', () => {
      initTableWithQuery(options?.initQuery || query, table)
    })
    subscription.on('enter', () => {
      initTableWithQuery(options?.initQuery || query, table)
    })
    subscription.on('update', () => {
      initTableWithQuery(options?.initQuery || query, table)
    })
    subscription.on('delete', () => {
      initTableWithQuery(options?.initQuery || query, table)
    })
    subscription.on('open', () => {
      console.log(query.className, 'websocket connection established')
    })
    subscription.on('close', () => {
      console.warn(query.className, 'websocket connection closed')
    })
    return subscription
  }

  // let timerFor24H: ReturnType<typeof setTimeout>

  // Parse.LiveQuery.on('open', () => {
  //   clearTimeout(timerFor24H)
  //   setIsParseOnline(true)
  // })

  // Parse.LiveQuery.on('close', () => {
  //   console.warn('closed')
  //   timerFor24H = setTimeout(() => {
  //     setIsParseOnline(true)
  //   }, hourInMilliseconds)
  // })

  // Parse.LiveQuery.on('error', (error) => {
  //   console.warn('got error: ', error)
  //   timerFor24H = setTimeout(() => {
  //     setIsParseOnline(true)
  //   }, hourInMilliseconds)
  // })

  //fetches ParseQueryData via HTTP and and replaces current IndexedDB Data with response if response has content
  function initTableWithQuery<T>(
    query: Query<Parse.Object<T>>,
    table: Table<T, IndexableType>,
    canBeEmtpy = false
  ): Promise<IndexableType> {
    if (typeof table !== 'undefined' && typeof query !== 'undefined') {
      return new Promise<IndexableType>((resolve, reject) => {
        query
          .find({ useMasterKey: true })
          .then((results) => {
            if (results.length || canBeEmtpy) {
              table.clear()
              table
                .bulkAdd(
                  results.map((res) => {
                    return res.toJSON() as unknown as T
                  }),
                  results.map((res) => {
                    return res.id
                  })
                )
                .then((a) => resolve(a))
                .catch((reason) => reject(reason))
            } else {
              reject('No results found for ' + query.className)
            }
          })
          .catch((reason) => reject(reason))
      })
    }
  }

  //Creates new Screen in Parse with given AppId
  function createNewScreen(appId: string): Promise<Parse.Object<Screen>> {
    const NewScreen = Parse.Object.extend('SteleScreen')
    const newScreen: Parse.Object<Screen> = new NewScreen()
    const config: Config = {
      dictionaries: [names]
    }
    newScreen.set('uuid', appId)
    newScreen.set('name', uniqueNamesGenerator(config))
    return new Promise((resolve, reject) => {
      newScreen
        .save(null, { useMasterKey: true })
        .then((result) => {
          resolve(result)
        })
        .catch((error) => reject(error))
    })
  }

  //Function calls happen in useEffect([]) to ensure client side handling
  useEffect(() => {
    const appId = getAppId()

    Parse.initialize(environment.parseAppId)
    Parse.masterKey = environment.parseMasterKey
    Parse.serverURL = environment.parseUrl

    const screenQuery: Query<Parse.Object<Screen>> = new Query<Parse.Object<Screen>>('SteleScreen')
      .limit(1)
      .equalTo('uuid', appId)
      //only use include with never changing constants like state and layout type
      .include('state')
      .include('layoutType')
    initTableWithQuery<Screen>(screenQuery, db.screen)
      .catch((error) => {
        try {
          localStorage.setItem(
            new Date().getTime().toString(),
            'Error finding Screen: ' + JSON.stringify(error)
          )
        } catch {
          localStorage.setItem(new Date().getTime().toString(), 'Error finding Screen')
        }

        console.warn(error, '\nTrying to create a new Screen with id', appId)
        createNewScreen(appId)
          .then((res) => {
            console.log('Successfully created new Screen', res)
            db.screen.add(res.attributes)
          })
          .catch((error) => {
            console.error(error)
            try {
              localStorage.setItem(
                new Date().getTime().toString(),
                'Error creating Screen: ' + JSON.stringify(error)
              )
            } catch {
              localStorage.setItem(new Date().getTime().toString(), 'Error creating Screen')
            }
          })
      })
      .then((a) => {
        localStorage.setItem('screenId set/found', a as string)
      })
    subscribeTableToQuery<Screen>(screenQuery, db.screen)
  }, [])

  useEffect(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const pressReleaseQuery = new Query<Parse.Object<PressRelease>>('PressRelease')
      .lessThanOrEqualTo('date', today)
      .descending('date')
      .limit(10)

    initTableWithQuery(pressReleaseQuery, db.pressReleases).catch((e) => console.log(e))
    subscribeTableToQuery(pressReleaseQuery, db.pressReleases)

    const poiCategoryQuery = new Query<Parse.Object<PoiCategory>>('POICategory')
    initTableWithQuery(poiCategoryQuery, db.poiCategories).catch((e) => console.log(e))
    subscribeTableToQuery(poiCategoryQuery, db.poiCategories)

    const poiQuery = new Query<Parse.Object<POI>>('POI').limit(1000)
    initTableWithQuery(poiQuery, db.pois).catch((e) => console.log(e))
    subscribeTableToQuery(poiQuery, db.pois)
  }, [])

  //Update WeatherQuery if ScreenLocation Changes
  useEffect(() => {
    if (typeof screen?.location !== 'undefined') {
      const weatherQuery: Query<Parse.Object<Weather>> = new Query<Parse.Object<Weather>>(
        'WeatherObserved'
      )
        //ignore broken sensorStations
        .limit(1)
        .near('geopoint', screen.location)
      initTableWithQuery(weatherQuery, db.weather)
        .then((a) => {
          if (typeof weatherSubscription !== 'undefined') {
            weatherSubscription.unsubscribe()
          }
          subscribeTableToQuery(weatherQuery.equalTo('objectId', a as string), db.weather).then(
            (sub) => setWeatherSubscription(sub)
          )
        })
        .catch((e) => console.log(e))

      Parse.Cloud.run(
        'pt-stop-nearby',
        { lat: screen?.location?.latitude, lon: screen?.location?.longitude },
        { useMasterKey: true }
      )
        .then((a) => {
          db.stops
            .clear()
            .then(() => {
              db.stops.add(a.stops[0])
              Parse.Cloud.run('pt-serving-lines', { stopId: a.stops[0].id }, { useMasterKey: true })
                .then((b) => {
                  db.departures
                    .clear()
                    .then(() => {
                      db.departures.bulkAdd(b)
                    })
                    .catch(() => {
                      console.error('Error getting Stop')
                    })
                })
                .catch(() => {
                  console.error('Error getting Stop')
                })
            })
            .catch(() => {
              console.error('Error getting Stop')
            })
        })
        .catch(() => {
          console.error('Error getting Stop')
        })
    }
  }, [screen?.location?.latitude, screen?.location?.longitude])

  useEffect(() => {
    if (typeof screen?.layoutConfig?.objectId !== 'undefined') {
      const layoutConfigQuery: Query<Parse.Object<Layout>> = new Query<Parse.Object<Layout>>(
        'SteleLayoutConfig'
      ).equalTo('objectId', screen.layoutConfig.objectId)
      initTableWithQuery(layoutConfigQuery, db.layoutConfig)
        .then(() => {
          if (typeof layoutConfigSubscription !== 'undefined') {
            layoutConfigSubscription.unsubscribe()
          }
          subscribeTableToQuery(layoutConfigQuery, db.layoutConfig).then((sub) =>
            setLayoutConfigSubscription(sub)
          )
        })
        .catch((e) => console.log(e))
    }
  }, [screen?.layoutConfig?.objectId])

  useEffect(() => {
    if (typeof layoutConfig?.gridConfig?.objectId !== 'undefined') {
      setGridConfigDirty(true)
      const gridConfigQuery: Query<Parse.Object<Grid>> = new Query<Parse.Object<Grid>>(
        'SteleGridConfig'
      ).equalTo('objectId', layoutConfig.gridConfig.objectId)

      initTableWithQuery(gridConfigQuery, db.gridConfig)
        .then(() => {
          if (typeof gridConfigSubscription !== 'undefined') {
            gridConfigSubscription.unsubscribe()
          }
          subscribeTableToQuery(gridConfigQuery, db.gridConfig)
            .then((sub) => {
              setGridConfigSubscription(sub)
            })
            .finally(() => setGridConfigDirty(false))
        })
        .catch((e) => console.log(e))
    }
  }, [layoutConfig?.gridConfig?.objectId])

  useEffect(() => {
    if (typeof layoutConfig?.diashowConfig?.objectId !== 'undefined') {
      setDiashowConfigDirty(true)
      const diashowConfigQuery: Query<Parse.Object<Diashow>> = new Query<Parse.Object<Diashow>>(
        'SteleDiashowConfig'
      ).equalTo('objectId', layoutConfig.diashowConfig.objectId)
      initTableWithQuery(diashowConfigQuery, db.diashowConfig)
        .then(() => {
          if (typeof diashowConfigSubscription !== 'undefined') {
            diashowConfigSubscription.unsubscribe()
          }
          subscribeTableToQuery(diashowConfigQuery, db.diashowConfig)
            .then((sub) => {
              setDiashowConfigSubscription(sub)
            })
            .finally(() => setDiashowConfigDirty(false))
        })
        .catch((e) => console.log(e))
    }
  }, [layoutConfig?.diashowConfig?.objectId])

  useEffect(() => {
    if (typeof diashowConfig?.diashowObjects !== 'undefined') {
      new Query<Parse.Object<Diashow>>('SteleDiashowConfig')
        .get(diashowConfig.objectId, { useMasterKey: true })
        .then((dC) => {
          initTableWithQuery(
            dC.attributes.diashowObjects.query().includeAll(),
            db.diashowObjects,
            true
          )
            .then(() => {
              if (!diashowConfigDirty) {
                if (typeof diashowObjectsSubscription !== 'undefined') {
                  diashowObjectsSubscription.unsubscribe()
                }
                subscribeTableToQuery(
                  new Query<Parse.Object<DiashowObject>>('SteleDiashowObject'),
                  db.diashowObjects,
                  {
                    initQuery: dC.attributes.diashowObjects.query().includeAll()
                  }
                ).then((sub) => {
                  setDiashowObjectsSubscription(sub)
                })
              }
            })
            .catch((e) => console.log(e))
        })
    }
  }, [diashowConfig?.diashowObjects])

  useEffect(() => {
    if (typeof gridConfig?.tiles !== 'undefined') {
      new Query<Parse.Object<Grid>>('SteleGridConfig')
        .get(gridConfig.objectId, { useMasterKey: true })
        .then((gC) => {
          initTableWithQuery(
            gC.attributes.tiles.query().include('tile.tileType').include('position'),
            db.tiles
          )
            .then(() => {
              if (!gridConfigDirty) {
                if (typeof tilesSubscription !== 'undefined') {
                  tilesSubscription.unsubscribe()
                }
                subscribeTableToQuery(
                  new Query<Parse.Object<Tile>>('SteleTilePosition'),
                  db.tiles,
                  {
                    initQuery: gC.attributes.tiles
                      .query()
                      .include('tile.tileType')
                      .include('position')
                  }
                ).then((sub) => {
                  setTilesSubscription(sub)
                })
              }
            })
            .catch((e) => console.log(e))
        })
    }
  }, [gridConfig?.tiles])

  useEffect(() => {
    Promise.all(
      filesInDownload.filename.map((name, index) => {
        return new Promise<string>((resolve, reject) => {
          if (!diashowObjects?.map((dO) => dO.file.name)?.includes(name)) {
            unlink(filesInDownload.filepath[index], (err) => {
              if (err) {
                reject(err)
              } else {
                resolve(name)
              }
            })
          } else {
            resolve('File not found')
          }
        })
      })
    )
      .then()
      .catch((err) => console.error(err))
  }, [diashowObjects])

  useEffect(() => {
    const dir = environment.screenshotDir
    if (typeof screen !== 'undefined') {
      clearInterval(screenshotInterval)
      setScreenshotInterval(
        setInterval(() => {
          fs.readdir(dir + '/', (err, files) => {
            const f = files
              .map((fileName) => {
                return {
                  name: fileName,
                  time: fs.statSync(dir + '/' + fileName).mtime.getTime()
                }
              })
              .sort(function (a, b) {
                return b.time - a.time
              })
              .slice(0, 2)
            if (typeof f !== 'undefined') {
              const screenshotQuery = new Parse.Query('SteleScreenshot').equalTo('screen', {
                __type: 'Pointer',
                className: 'SteleScreen',
                objectId: screen.objectId
              })
              screenshotQuery.find({ useMasterKey: true }).then((scs) => {
                Parse.Object.destroyAll(scs, { useMasterKey: true }).then((a) => {
                  f.map((file) => {
                    fs.readFile(dir + '/' + file.name, 'base64', (err, data) => {
                      const screenshot = new Parse.File(
                        screen.objectId + '_screenshot_' + file.name + '.png',
                        { base64: data }
                      )
                      screenshot.save({ useMasterKey: true }).then((f) => {
                        const screenshot = new Parse.Object('SteleScreenshot')
                        screenshot.set('screenshot', f)
                        screenshot.set('date', new Date(file.time))
                        screenshot.set(
                          'screen',
                          Parse.Object.extend('SteleScreen').createWithoutData(screen.objectId)
                        )
                        screenshot.save(undefined, { useMasterKey: true }).then(() => {
                          console.log('saved new screenshots')
                        })
                      })
                    })
                  })
                })
              })
            }
          })
        }, 600000 /*10min*/)
      )
    }
  }, [screen])

  return (
    <>
      {React.Children.map(props.children, (child: React.JSX.Element) => {
        return React.cloneElement(child, {
          isParseOnline: isParseOnline
        })
      })}
    </>
  )
}
