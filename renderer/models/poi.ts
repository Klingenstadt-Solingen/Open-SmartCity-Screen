import { GeoPoint } from 'parse'
import { Base } from './base'

export interface POI extends Base {
  poiCategory: string
  name: string
  geopoint: GeoPoint
}
