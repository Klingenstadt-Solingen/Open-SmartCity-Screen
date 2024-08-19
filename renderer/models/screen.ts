import { File, GeoPoint, Pointer } from 'parse'
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
  name: 'Diashow' | 'Touchscreen'
}

export interface ScreenState {
  name: 'Aktiv' | 'Inaktiv'
}

export interface Screenshot {
  screenshot: File
  screen: Pointer
  date: Date
}
