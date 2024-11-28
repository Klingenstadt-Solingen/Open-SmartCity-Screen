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
import { Grid } from '../../models/grid'
import { Diashow } from '../../models/diashow'
import { Layout } from '../../models/layout'
import { environment } from '../../environment'
import { EnvironmentCategory } from '../../models/environmentCategory'
import { EnvironmentSubCategory } from '../../models/environmentSubCategory'
import { EnvironmentSensorType } from '../../models/environmentSensorType'
import { EnvironmentStation } from '../../models/environmentStation'
import { EnvironmentSensor } from '../../models/environmentSensor'
import { EnvironmentIcon } from '../../models/environmentIcon'
import { EnvironmentLocale } from '../../models/environmentLocale'

EventEmitter.defaultMaxListeners = 20

function runAtSpecificTimeOfDay(hour, minutes, func) {
  const twentyFourHours = 86400000
  const now = new Date()
  let eta_ms =
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minutes, 0, 0).getTime() -
    now.getTime()
  if (eta_ms < 0) {
    eta_ms += twentyFourHours
  }
  setTimeout(function () {
    //run once
    func()
    // run every 24 hours from now on
    setInterval(func, twentyFourHours)
  }, eta_ms)
}

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
  const [screenSubscription, setScreenSubscription] = useState<LiveQuerySubscription>()
  const [poiCategorySubscription, setPoiCategorySubscription] = useState<LiveQuerySubscription>()
  const [pressReleaseSubscription, setPressReleaseSubscription] = useState<LiveQuerySubscription>()
  const [environmentSubscriptions, setEnvironmentSubscriptions] =
    useState<LiveQuerySubscription[]>()

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

  //fetches a parse function and and replaces current IndexedDB Data with response if response has content
  function initTableWithFunction<T>(
    functionName: string,
    table: Table<T, IndexableType>,
    data: unknown = null,
    canBeEmtpy = false
  ): Promise<IndexableType> {
    if (typeof table !== 'undefined' && typeof functionName !== 'undefined') {
      return new Promise<IndexableType>((resolve, reject) => {
        Parse.Cloud.run(functionName, data)
          .then((results: any[]) => {
            if (results.length || canBeEmtpy) {
              table.clear()
              table
                .bulkAdd(
                  results.map((res) => {
                    return res as unknown as T
                  }),
                  results.map((res) => {
                    return res.id
                  })
                )
                .then((a) => resolve(a))
                .catch((reason) => reject(reason))
            } else {
              reject('No results found for function ' + functionName)
            }
          })
          .catch((reason) => reject(reason))
      })
    }
  }

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

  function fetchConfig() {
    const appId = getAppId()

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
    if (typeof screenSubscription !== 'undefined') {
      screenSubscription.unsubscribe()
    }
    subscribeTableToQuery<Screen>(screenQuery, db.screen).then((sub) => setScreenSubscription(sub))

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const pressReleaseQuery = new Query<Parse.Object<PressRelease>>('PressRelease')
      .lessThanOrEqualTo('date', today)
      .descending('date')
      .limit(10)

    initTableWithQuery(pressReleaseQuery, db.pressReleases).catch((e) => console.log(e))
    if (typeof pressReleaseSubscription !== 'undefined') {
      pressReleaseSubscription.unsubscribe()
    }
    subscribeTableToQuery(pressReleaseQuery, db.pressReleases).then((sub) => {
      setPressReleaseSubscription(sub)
    })

    const poiCategoryQuery = new Query<Parse.Object<PoiCategory>>('POICategory')
    initTableWithQuery(poiCategoryQuery, db.poiCategories).catch((e) => console.log(e))
    if (typeof poiCategorySubscription !== 'undefined') {
      poiCategorySubscription.unsubscribe()
    }
    subscribeTableToQuery(poiCategoryQuery, db.poiCategories).then((sub) => {
      setPoiCategorySubscription(sub)
    })

    initTableWithFunction('poi-all', db.pois).catch((e) => console.log(e))

    fetchEnvironment()
    subscribeToEnvironment()
  }

  async function subscribeToEnvironment() {
    if (environmentSubscriptions?.length) {
      environmentSubscriptions.forEach((a) => a.unsubscribe())
      setEnvironmentSubscriptions([])
    }
    const q1 = await new Query('EnvironmentLocale').subscribe()
    q1.on('create', () => {
      fetchEnvironment()
    })
    q1.on('update', () => {
      fetchEnvironment()
    })
    q1.on('delete', () => {
      fetchEnvironment()
    })
    const q2 = await new Query('EnvironmentCategory').subscribe()
    q2.on('create', () => {
      fetchEnvironment()
    })
    q2.on('update', () => {
      fetchEnvironment()
    })
    q2.on('delete', () => {
      fetchEnvironment()
    })
    const q3 = await new Query('EnvironmentSubCategory').subscribe()
    q3.on('create', () => {
      fetchEnvironment()
    })
    q3.on('update', () => {
      fetchEnvironment()
    })
    q3.on('delete', () => {
      fetchEnvironment()
    })
    const q4 = await new Query('EnvironmentSensorType').subscribe()
    q4.on('create', () => {
      fetchEnvironment()
    })
    q4.on('update', () => {
      fetchEnvironment()
    })
    q4.on('delete', () => {
      fetchEnvironment()
    })
    const q5 = await new Query('EnvironmentStation').subscribe()
    q5.on('create', () => {
      fetchEnvironment()
    })
    q5.on('update', () => {
      fetchEnvironment()
    })
    q5.on('delete', () => {
      fetchEnvironment()
    })
    const q6 = await new Query('EnvironmentSensor').subscribe()
    q6.on('create', () => {
      fetchEnvironment()
    })
    q6.on('update', () => {
      fetchEnvironment()
    })
    q6.on('delete', () => {
      fetchEnvironment()
    })
    const q7 = await new Query('EnvironmentIcon').subscribe()
    q7.on('create', () => {
      fetchEnvironment()
    })
    q7.on('update', () => {
      fetchEnvironment()
    })
    q7.on('delete', () => {
      fetchEnvironment()
    })
    setEnvironmentSubscriptions([q1, q2, q3, q4, q5, q6, q7])
  }

  function fetchEnvironment() {
    const environmentLocaleQuery = new Query<Parse.Object<EnvironmentLocale>>('EnvironmentLocale')
      .equalTo('locale', 'de-DE')
      .limit(1000)
    initTableWithQuery(environmentLocaleQuery, db.environmentLocales).catch((e) => console.log(e))

    const environmentCategoryQuery = new Query<Parse.Object<EnvironmentCategory>>(
      'EnvironmentCategory'
    )
      .ascending('order')
      .limit(1000)

    environmentCategoryQuery.find().then(async (categories) => {
      if (categories) {
        await db.environmentCategories.clear()
        await db.environmentSubCategories.clear()
        await db.environmentSensorTypes.clear()
        await db.environmentCategories.bulkAdd(
          categories.map((category) => {
            return { ...category.attributes, id: category.id } as EnvironmentCategory
          })
        )
        categories.map((category) => {
          category.attributes.subCategories
            .query()
            .include('icon')
            .limit(1000)
            .ascending('order')
            .find()
            .then(async (subCategories) => {
              if (subCategories) {
                await db.environmentSubCategories.bulkAdd(
                  subCategories.map((subCategory) => {
                    return {
                      ...subCategory.attributes,
                      id: subCategory.id,
                      category: category.id
                    } as EnvironmentSubCategory & {
                      category: string
                    }
                  })
                )
                ;(subCategories as unknown as Parse.Object<EnvironmentSubCategory>[]).map(
                  (subCategory) => {
                    subCategory.attributes.sensorTypes
                      .query()
                      .limit(1000)
                      .include('icon')
                      .find()
                      .then(async (sensorTypes) => {
                        if (sensorTypes) {
                          await db.environmentSensorTypes.bulkAdd(
                            sensorTypes.map((st) => {
                              return {
                                ...st.attributes,
                                id: st.id,
                                subCategory: subCategory.id
                              } as EnvironmentSensorType & {
                                subCategory: string
                              }
                            })
                          )
                        }
                      })
                  }
                )
              }
            })
        })
      }
    })

    const environmentSensorTypeQuery = new Query<Parse.Object<EnvironmentSensorType>>(
      'EnvironmentSensorType'
    )
      .ascending('order')
      .include('icon')
      .limit(1000)
    initTableWithQuery(environmentSensorTypeQuery, db.environmentSensorTypes).catch((e) =>
      console.log(e)
    )
    const environmentStationsQuery = new Query<Parse.Object<EnvironmentStation>>(
      'EnvironmentStation'
    )
      .include('poi')
      .limit(1000)
    initTableWithQuery(environmentStationsQuery, db.environmentStations).catch((e) =>
      console.log(e)
    )

    const environmentSensorQuery = new Query<Parse.Object<EnvironmentSensor>>(
      'EnvironmentSensor'
    ).limit(5000)
    environmentSensorQuery.find().then(async (sensors) => {
      if (sensors) {
        await db.environmentSensors.clear()
        await db.environmentSensors.bulkAdd(
          sensors.map((sensor) => {
            return {
              ...sensor.attributes,
              sensorType: (sensor.attributes.sensorType as EnvironmentSensorType).id,
              station: (sensor.attributes.station as EnvironmentStation).id,
              id: sensor.id
            } as EnvironmentSensor
          })
        )
      }
    })

    const environmentIconQuery = new Query<Parse.Object<EnvironmentIcon>>('EnvironmentIcon').limit(
      1000
    )
    initTableWithQuery(environmentIconQuery, db.environmentIcons).catch((e) => console.log(e))
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
        .save(null)
        .then((result) => {
          resolve(result)
        })
        .catch((error) => reject(error))
    })
  }

  //Function calls happen in useEffect([]) to ensure client side handling
  useEffect(() => {
    Parse.initialize(environment.parseAppId, environment.parseJavascriptKey)
    Parse.serverURL = environment.parseUrl
    Parse.User.logIn(environment.parseUsername, environment.parsePassword).then(() => {
      fetchConfig()
    })
    runAtSpecificTimeOfDay(2, 0, () => {
      location.reload()
    })
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

      //  - Query, to find which district the Screen is in
      const district_query = new Parse.Query('District').polygonContains('area', screen.location)
      district_query
        .find()
        .then((a) => {
          localStorage.setItem('district-id', a[0].id)
          localStorage.setItem('district-logo', a[0].get('logo')._url)
          const districtUrl =
            '***REMOVED***/api/v1/organisations?districtId=' + a[0].id
          const settings = { method: 'Get' }
          try {
            fetch(districtUrl, settings)
              .then((res) => res.json())
              .then((json) => {
                localStorage.setItem('district-object-id', json[0].id)
              })
          } catch (error) {
            console.error('Error fetching data:', error)
          }
        })
        .catch((e) => console.log(e))

      Parse.Cloud.run('pt-stop-nearby', {
        lat: screen?.location?.latitude,
        lon: screen?.location?.longitude
      })
        .then((a) => {
          db.stops
            .clear()
            .then(() => {
              db.stops.add(a.stops[0])
              Parse.Cloud.run('pt-serving-lines', { stopId: a.stops[0].id })
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
        .get(diashowConfig.objectId)
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
      new Query<Parse.Object<Grid>>('SteleGridConfig').get(gridConfig.objectId).then((gC) => {
        initTableWithQuery(
          gC.attributes.tiles.query().include('tile.tileType').include('position'),
          db.tiles
        )
          .then(() => {
            if (!gridConfigDirty) {
              if (typeof tilesSubscription !== 'undefined') {
                tilesSubscription.unsubscribe()
              }
              subscribeTableToQuery(new Query<Parse.Object<Tile>>('SteleTilePosition'), db.tiles, {
                initQuery: gC.attributes.tiles.query().include('tile.tileType').include('position')
              }).then((sub) => {
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
            if (files && files?.length) {
              const f = files
                ?.map((fileName) => {
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
                screenshotQuery.find().then((scs) => {
                  Parse.Object.destroyAll(scs).then(() => {
                    f.map((file) => {
                      fs.readFile(dir + '/' + file.name, 'base64', (err, data) => {
                        const screenshot = new Parse.File(
                          screen.objectId + '_screenshot_' + file.name + '.png',
                          { base64: data }
                        )
                        screenshot.save().then((f) => {
                          const screenshot = new Parse.Object('SteleScreenshot')
                          screenshot.set('screenshot', f)
                          screenshot.set('date', new Date(file.time))
                          screenshot.set(
                            'screen',
                            Parse.Object.extend('SteleScreen').createWithoutData(screen.objectId)
                          )
                          screenshot.save(undefined).then(() => {
                            console.log('saved new screenshots')
                          })
                        })
                      })
                    })
                  })
                })
              }
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
