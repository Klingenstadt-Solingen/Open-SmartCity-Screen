import Dexie, { Table } from 'dexie'
import { PressRelease } from '../models/press-release'
import { DiashowConfig, GridConfig, LayoutConfig, Screen } from '../models/screen'
import { Weather } from '../models/weather'
import { DiashowObject } from '../models/diashowObject'
import { Tile } from '../models/tile'

export class SteleDB extends Dexie {
  pressReleases!: Table<PressRelease, string>
  screen!: Table<Screen, string>
  layoutConfig!: Table<LayoutConfig, string>
  gridConfig!: Table<GridConfig, string>
  diashowConfig!: Table<DiashowConfig, string>
  weather!: Table<Weather, string>
  diashowObjects!: Table<DiashowObject, string>
  tiles!: Table<Tile, string>

  constructor() {
    super('steleDB')
    this.version(1).stores({
      pressReleases: '++,title,date,content',
      screen: '++,uuid,name,location',
      layoutConfig: '++,name',
      gridConfig: '++,name',
      diashowConfig: '++,name',
      weather: '++,values,shortName,geopoint',
      diashowObjects: '++,file,duration,startDate,endDate,fileType',
      tiles: '++,name,description,order'
    })
  }
}

export const db = new SteleDB()
