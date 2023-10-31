import Dexie, { Table } from 'dexie'
import { PressRelease } from '../models/press-release'
import { Screen } from '../models/screen'
import { Weather } from '../models/weather'
import { DiashowObject } from '../models/diashowObject'
import { Tile } from '../models/tile'
import { PoiCategory } from '../models/poi-category'
import { POI } from '../models/poi'
import { Diashow } from '../models/diashow'
import { Grid } from '../models/grid'
import { Layout } from '../models/layout'
import { Busstop } from '../models/busstop'
import { Busdeparture } from '../models/busdeparture'

export class SteleDB extends Dexie {
  pressReleases!: Table<PressRelease, string>
  screen!: Table<Screen, string>
  layoutConfig!: Table<Layout, string>
  gridConfig!: Table<Grid, string>
  diashowConfig!: Table<Diashow, string>
  weather!: Table<Weather, string>
  diashowObjects!: Table<DiashowObject, string>
  tiles!: Table<Tile, string>
  poiCategories!: Table<PoiCategory, string>
  pois!: Table<POI, string>
  stops!: Table<Busstop, string>
  departures!: Table<Busdeparture, string>

  constructor() {
    super('steleDB')
    this.version(2).stores({
      pressReleases: '++,title,date,content',
      screen: '++,uuid,name,location',
      layoutConfig: '++,name',
      gridConfig: '++,name',
      diashowConfig: '++,name',
      weather: '++,values,shortName,geopoint',
      diashowObjects: '++,file,duration,startDate,endDate,fileType',
      tiles: '++',
      poiCategories: '++',
      pois: '++',
      stops: '++',
      departures: '++'
    })
  }
}

export const db = new SteleDB()
