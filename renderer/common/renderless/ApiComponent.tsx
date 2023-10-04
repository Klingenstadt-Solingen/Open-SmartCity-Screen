//This eslint-disable comment mostly exists to provoke VSe
/* eslint-disable sonarjs/no-duplicate-string */
import React, { PropsWithChildren, useEffect, useState } from 'react'

import Parse, { Query, LiveQuerySubscription } from 'parse'
import { db } from '../../utils/dexie'
import { PressRelease } from '../../models/press-release'
import { IndexableType, Table } from 'dexie'
import { v4 as uuidv4 } from 'uuid'
import { uniqueNamesGenerator, Config, names } from 'unique-names-generator'

import { DiashowConfig, GridConfig, LayoutConfig, Screen } from '../../models/screen'
import { Weather } from '../../models/weather'
import { useLiveQuery } from 'dexie-react-hooks'
import { DiashowObject } from '../../models/diashowObject'
import { Tile } from '../../models/tile'

import fs, { unlink } from 'fs'
import { downloadPath, downloadDir, hourInMilliseconds } from '../../utils/constants'

import EventEmitter from 'events'
import { PoiCategory } from '../../models/poi-category'
import { POI } from '../../models/poi'

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

  const filesInDownload = getAllDFileInfos(downloadPath + downloadDir)

  const [isParseOnline, setIsParseOnline] = useState<boolean>(true)

  //reference to subscriptions has to be saved in a state in order to cancel them later.
  const [weatherSubscription, setWeatherSubscription] = useState<LiveQuerySubscription>()
  const [layoutConfigSubscription, setLayoutConfigSubscription] = useState<LiveQuerySubscription>()
  const [gridConfigSubscription, setGridConfigSubscription] = useState<LiveQuerySubscription>()
  const [diashowConfigSubscription, setDiashowConfigSubscription] =
    useState<LiveQuerySubscription>()
  const [diashowObjectsSubscription, setDiashowObjectsSubscription] =
    useState<LiveQuerySubscription>()
  const [tilesSubscription, setTilesSubscription] = useState<LiveQuerySubscription>()

  const [gridConfigDirty, setGridConfigDirty] = useState<boolean>(false)
  const [diashowConfigDirty, setDiashowConfigDirty] = useState<boolean>(false)

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

  let timerFor24H: ReturnType<typeof setTimeout>

  Parse.LiveQuery.on('open', () => {
    clearTimeout(timerFor24H)
    setIsParseOnline(true)
    console.warn('opened')
  })

  Parse.LiveQuery.on('close', () => {
    console.warn('closed')
    timerFor24H = setTimeout(() => {
      setIsParseOnline(false)
    }, hourInMilliseconds)
  })

  Parse.LiveQuery.on('error', (error) => {
    console.warn('got error: ', error)
    timerFor24H = setTimeout(() => {
      setIsParseOnline(false)
    }, hourInMilliseconds)
  })

  //fetches ParseQueryData via HTTP and and replaces current IndexedDB Data with response if response has content
  function initTableWithQuery<T>(
    query: Query<Parse.Object<T>>,
    table: Table<T, IndexableType>,
    canBeEmtpy = false
  ): Promise<IndexableType> {
    if (typeof table !== 'undefined' && typeof query !== 'undefined') {
      return new Promise<IndexableType>((resolve, reject) => {
        query
          .find()
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
        .save()
        .then((result) => {
          resolve(result)
        })
        .catch((error) => reject(error))
    })
  }

  //Function calls happen in useEffect([]) to ensure client side handling
  useEffect(() => {
    const appId = getAppId()

    Parse.initialize('dashboard')
    Parse.serverURL = 'https://parse-be.hosting.nedeco.mobi/parse'

    const screenQuery: Query<Parse.Object<Screen>> = new Query<Parse.Object<Screen>>('SteleScreen')
      .limit(1)
      .equalTo('uuid', appId)
      //only use include with never changing constants like state and layout type
      .include('state')
      .include('layoutType')
    initTableWithQuery<Screen>(screenQuery, db.screen).catch((error) => {
      console.warn(error, '\nTrying to create a new Screen with id', appId)
      createNewScreen(appId)
        .then((res) => {
          console.log('Successfully created new Screen', res)
          db.screen.add(res.attributes)
        })
        .catch((error) => console.error(error))
    })
    subscribeTableToQuery<Screen>(screenQuery, db.screen)
  }, [])

  useEffect(() => {
    const pressReleaseQuery = new Query<Parse.Object<PressRelease>>('PressRelease')
      .descending('date')
      .limit(10)
    initTableWithQuery(pressReleaseQuery, db.pressReleases)
    subscribeTableToQuery(pressReleaseQuery, db.pressReleases)

    const poiCategoryQuery = new Query<Parse.Object<PoiCategory>>('POICategory')
    initTableWithQuery(poiCategoryQuery, db.poiCategories)
    subscribeTableToQuery(poiCategoryQuery, db.poiCategories)

    const poiQuery = new Query<Parse.Object<POI>>('POI').limit(1000)
    initTableWithQuery(poiQuery, db.pois)
    subscribeTableToQuery(poiQuery, db.pois)
  }, [])

  //Update WeatherQuery if ScreenLocation Changes
  useEffect(() => {
    if (typeof screen?.location !== 'undefined') {
      const weatherQuery: Query<Parse.Object<Weather>> = new Query<Parse.Object<Weather>>(
        'WeatherObserved'
      )
        //ignore broken sensorStations
        .notEqualTo('values', {})
        .limit(1)
        .near('geopoint', screen.location)
      initTableWithQuery(weatherQuery, db.weather).then((a) => {
        if (typeof weatherSubscription !== 'undefined') {
          weatherSubscription.unsubscribe()
        }
        subscribeTableToQuery(weatherQuery.equalTo('objectId', a as string), db.weather).then(
          (sub) => setWeatherSubscription(sub)
        )
      })
    }
  }, [screen?.location?.latitude, screen?.location?.longitude])

  useEffect(() => {
    if (typeof screen?.layoutConfig.objectId !== 'undefined') {
      const layoutConfigQuery: Query<Parse.Object<LayoutConfig>> = new Query<
        Parse.Object<LayoutConfig>
      >('SteleLayoutConfig').equalTo('objectId', screen.layoutConfig.objectId)
      initTableWithQuery(layoutConfigQuery, db.layoutConfig).then(() => {
        if (typeof layoutConfigSubscription !== 'undefined') {
          layoutConfigSubscription.unsubscribe()
        }
        subscribeTableToQuery(layoutConfigQuery, db.layoutConfig).then((sub) =>
          setLayoutConfigSubscription(sub)
        )
      })
    }
  }, [screen?.layoutConfig?.objectId])

  useEffect(() => {
    if (typeof layoutConfig?.gridConfig?.objectId !== 'undefined') {
      setGridConfigDirty(true)
      const gridConfigQuery: Query<Parse.Object<GridConfig>> = new Query<Parse.Object<GridConfig>>(
        'SteleGridConfig'
      ).equalTo('objectId', layoutConfig.gridConfig.objectId)

      initTableWithQuery(gridConfigQuery, db.gridConfig).then(() => {
        if (typeof gridConfigSubscription !== 'undefined') {
          gridConfigSubscription.unsubscribe()
        }
        subscribeTableToQuery(gridConfigQuery, db.gridConfig)
          .then((sub) => {
            setGridConfigSubscription(sub)
          })
          .finally(() => setGridConfigDirty(false))
      })
    }
  }, [layoutConfig?.gridConfig?.objectId])

  useEffect(() => {
    if (typeof layoutConfig?.diashowConfig?.objectId !== 'undefined') {
      setDiashowConfigDirty(true)
      const diashowConfigQuery: Query<Parse.Object<DiashowConfig>> = new Query<
        Parse.Object<DiashowConfig>
      >('SteleDiashowConfig').equalTo('objectId', layoutConfig.diashowConfig.objectId)
      initTableWithQuery(diashowConfigQuery, db.diashowConfig).then(() => {
        if (typeof diashowConfigSubscription !== 'undefined') {
          diashowConfigSubscription.unsubscribe()
        }
        subscribeTableToQuery(diashowConfigQuery, db.diashowConfig)
          .then((sub) => {
            setDiashowConfigSubscription(sub)
          })
          .finally(() => setDiashowConfigDirty(false))
      })
    }
  }, [layoutConfig?.diashowConfig?.objectId])

  useEffect(() => {
    if (typeof diashowConfig?.diashowObjects !== 'undefined') {
      new Query<Parse.Object<DiashowConfig>>('SteleDiashowConfig')
        .get(diashowConfig.objectId)
        .then((dC) => {
          initTableWithQuery(
            dC.attributes.diashowObjects.query().includeAll(),
            db.diashowObjects,
            true
          ).then(() => {
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
        })
    }
  }, [diashowConfig?.diashowObjects])

  useEffect(() => {
    if (typeof gridConfig?.tiles !== 'undefined') {
      new Query<Parse.Object<GridConfig>>('SteleGridConfig').get(gridConfig.objectId).then((gC) => {
        initTableWithQuery(gC.attributes.tiles.query().includeAll(), db.tiles).then(() => {
          if (!gridConfigDirty) {
            if (typeof tilesSubscription !== 'undefined') {
              tilesSubscription.unsubscribe()
            }
            subscribeTableToQuery(new Query<Parse.Object<Tile>>('SteleTile'), db.tiles, {
              initQuery: gC.attributes.tiles.query().includeAll()
            }).then((sub) => {
              setTilesSubscription(sub)
            })
          }
        })
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
