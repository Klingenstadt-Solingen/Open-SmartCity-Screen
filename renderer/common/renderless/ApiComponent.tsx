//This eslint-disable comment mostly exists to provoke VSe
/* eslint-disable sonarjs/no-duplicate-string */
import React, { PropsWithChildren, useEffect, useState } from 'react'

import Parse, { Query, GeoPoint, LiveQuerySubscription } from 'parse'
import { db } from '../../utils/dexie'
import { PressRelease } from '../../models/press-release'
import { IndexableType, Table } from 'dexie'
import { v4 as uuidv4 } from 'uuid'
import { uniqueNamesGenerator, Config, names } from 'unique-names-generator'

import { Screen } from '../../models/screen'
import { Weather } from '../../models/weather'
import { useLiveQuery } from 'dexie-react-hooks'

export default function ApiComponent(props: PropsWithChildren): React.JSX.Element {
  //maximum number of entries in each IndexedDB Table
  const maxCachedItems = 20

  const screen = useLiveQuery(() => {
    return db.screen.toCollection().first()
  })

  //reference to subscriptions has to be saved in a state in order to cancel them later.
  const [weatherSubscription, setWeatherSubscription] = useState<LiveQuerySubscription>()

  //Base Queries
  const weatherQuery: Query<Parse.Object<Weather>> = new Query<Parse.Object<Weather>>(
    'WeatherObserved'
  )
    //ignore broken sensorStations
    .notEqualTo('values', {})
    .limit(1)
  const screenQuery: Query<Parse.Object<Screen>> = new Query<Parse.Object<Screen>>('SteleScreen')
    .include('layoutType')
    .include('state')
    .limit(1)
  const pressReleaseQuery: Query<Parse.Object<PressRelease>> = new Query<
    Parse.Object<PressRelease>
  >('PressRelease')
    .descending('date')
    .limit(10)

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
      onCreate?: (created: Parse.Object<T>) => void
      onEnter?: (entered: Parse.Object<T>) => void
      onUpdate?: (updated: Parse.Object<T>) => void
      onDelete?: (deleted: Parse.Object<T>) => void
    }
  ) {
    const subscription = await query.subscribe()
    subscription.on('create', (created: Parse.Object<T>) => {
      if (options?.onCreate) {
        options.onCreate(created)
      } else {
        onlyStickIfYouCanFit(table, created).catch((reason) => {
          console.warn(reason, 'refetching...')
          initTableWithQuery(query, table)
        })
      }
    })
    subscription.on('enter', (entered: Parse.Object<T>) => {
      if (options?.onEnter) {
        options.onEnter(entered)
      } else {
        onlyStickIfYouCanFit(table, entered).catch((reason) => {
          console.warn(reason, 'refetching...')
          initTableWithQuery(query, table)
        })
      }
    })
    subscription.on('update', (updated: Parse.Object<T>) => {
      if (options?.onUpdate) {
        options.onUpdate(updated)
      } else {
        onlyStickIfYouCanFit(table, updated).catch((reason) => {
          console.warn(reason, 'refetching...')
          initTableWithQuery(query, table)
        })
      }
    })
    subscription.on('delete', (deleted: Parse.Object<T>) => {
      if (options?.onDelete) {
        options.onDelete(deleted)
      } else {
        table.delete(deleted.id)
      }
    })
    subscription.on('open', () => {
      console.log(query.className, 'websocket connection established')
    })
    subscription.on('close', () => {
      console.warn(query.className, 'websocket connection closed')
    })
    return subscription
  }

  //fetches ParseQueryData via HTTP and and replaces current IndexedDB Data with response if response has content
  function initTableWithQuery<T>(
    query: Query<Parse.Object<T>>,
    table: Table<T, IndexableType>
  ): Promise<IndexableType> {
    return new Promise<IndexableType>((resolve, reject) => {
      query
        .find()
        .then((results) => {
          if (results.length) {
            table.clear()
            table
              .bulkAdd(
                results.map((res) => {
                  return mapToIndexedDB<T>(res.attributes)
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

  //Some ParseObject Types need to be mapped to JSON before saving to IndexedDB
  function mapToIndexedDB<T>(obj: T): T {
    Object.keys(obj).forEach((key) => {
      if (obj[key] instanceof GeoPoint || obj[key] instanceof Parse.Object) {
        obj = { ...obj, [key]: obj[key].toJSON() }
      }
    })
    return obj
  }

  //Inserts Object into Table if Table maxCacheLimit isn't exceeded. Otherwise rejects Promise.
  async function onlyStickIfYouCanFit<T>(
    table: Table<T, IndexableType>,
    object: Parse.Object<T>
  ): Promise<IndexableType> {
    return new Promise((resolve, reject) => {
      table.count().then((count) => {
        if (count < maxCachedItems) {
          table.put(mapToIndexedDB<T>(object.attributes), object.id).then((savedObjectKey) => {
            resolve(savedObjectKey)
          })
        } else reject('Max Cache Limit exceeded')
      })
    })
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
    screenQuery.equalTo('uuid', appId)
    initTableWithQuery<Screen>(screenQuery, db.screen).catch((error) => {
      console.warn(error, '\nTrying to create a new Screen with id', appId)
      createNewScreen(appId)
        .then((res) => {
          console.log('Successfully created new Screen', res)
          db.screen.add(res.attributes)
        })
        .catch((error) => console.error(error))
    })
    subscribeTableToQuery<Screen>(screenQuery, db.screen, {
      onCreate: () => {
        initTableWithQuery<Screen>(screenQuery, db.screen)
      },
      onEnter: () => {
        initTableWithQuery<Screen>(screenQuery, db.screen)
      },
      onUpdate: () => {
        initTableWithQuery<Screen>(screenQuery, db.screen)
      }
    })
    initTableWithQuery<PressRelease>(pressReleaseQuery, db.pressReleases).catch((error) =>
      console.error(error)
    )
    subscribeTableToQuery<PressRelease>(pressReleaseQuery, db.pressReleases)
  }, [])

  //Update WeatherQuery if ScreenLocation Changes
  useEffect(() => {
    if (typeof screen !== 'undefined') {
      if (typeof weatherSubscription !== 'undefined') {
        weatherSubscription.unsubscribe()
      }
      weatherQuery.near('geopoint', screen.location)
      initTableWithQuery(weatherQuery, db.weather).then((a) =>
        subscribeTableToQuery(weatherQuery.equalTo('objectId', a), db.weather).then((sub) =>
          setWeatherSubscription(sub)
        )
      )
    }
  }, [screen?.location])

  return <>{props.children}</>
}
