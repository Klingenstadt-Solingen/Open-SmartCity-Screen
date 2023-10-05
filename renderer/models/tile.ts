import { Base } from './base'

export interface Tile extends Base {
  tileType: { name: string }
  order: number
}

export interface TileType {
  name:
    | 'MAP'
    | 'POI'
    | 'PRESSRELEASES'
    | 'WEATHER'
    | 'DIASHOW'
    | 'BUS_DEPARTURE'
    | 'BUS_SCHEDULE'
    | 'BOB'
}
