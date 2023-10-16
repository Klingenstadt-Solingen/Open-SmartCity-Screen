import { GeoPoint } from 'parse'
import { Base } from './base'
import { Layout } from './layout'

export interface Screen extends Base {
  objectId?: string
  uuid: string
  name?: string
  layoutType: LayoutType
  layoutConfig: Layout
  state: ScreenState
  location?: GeoPoint
}

export interface LayoutType {
  name: 'GRID' | 'DIASHOW'
}

export interface ScreenState {
  name: 'ACTIVE' | 'INACTIVE'
}
