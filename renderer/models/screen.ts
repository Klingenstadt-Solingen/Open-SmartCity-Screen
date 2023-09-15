import { GeoPoint, Relation } from 'parse'
import { Base } from './base'
import { Tile } from './tile'
import { DiashowObject } from './diashowObject'

export interface Screen extends Base {
  objectId?: string
  uuid: string
  name?: string
  layoutType: LayoutType
  layoutConfig: LayoutConfig
  state: ScreenState
  location?: GeoPoint
}

export interface LayoutType {
  objectId?: string
  name: 'GRID' | 'DIASHOW'
}

export interface ScreenState {
  objectId?: string
  name: 'ACTIVE' | 'INACTIVE'
}

export interface LayoutConfig {
  objectId?: string
  gridConfig?: GridConfig
  diashowConfig?: DiashowConfig
  showHeader?: boolean
  showFooter?: boolean
}

export interface GridConfig {
  objectId?: string
  tiles: Relation<Parse.Object<Tile>>
}

export interface DiashowConfig {
  objectId?: string
  diashowObjects: Relation<Parse.Object<DiashowObject>>
}
