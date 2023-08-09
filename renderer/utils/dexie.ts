import Dexie, { Table } from 'dexie'
import { PressRelease } from '../models/press-release'
import { Screen } from '../models/screen'
import { Weather } from '../models/weather'

export class SteleDB extends Dexie {
  pressReleases!: Table<PressRelease, string>
  screen!: Table<Screen, string>
  weather!: Table<Weather, string>

  constructor() {
    super('steleDB')
    this.version(1).stores({
      pressReleases: '++,title,date,content',
      screen: '++,uuid,name,location',
      weather: '++,values,shortName,geopoint'
    })
  }
}

export const db = new SteleDB()
