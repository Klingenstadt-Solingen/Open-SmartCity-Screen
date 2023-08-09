import { GeoPoint } from 'parse'

export interface Screen {
  uuid: string
  name?: string
  layoutType: LayoutType
  state: ScreenState
  location?: GeoPoint
}

export interface LayoutType {
  name: 'GRID' | 'DIASHOW'
}

export interface ScreenState {
  name: 'ACTIVE' | 'INACTIVE'
}
