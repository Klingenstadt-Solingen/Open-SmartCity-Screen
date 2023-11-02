import { GeoPoint } from 'parse'
import { Base } from './base'

interface detail {
  type: string
  title: string
  value: string
}
export interface POI extends Base {
  poiCategory: string
  name: string
  geopoint: GeoPoint
  address: string
  district: string
  city: string
  zip: string
  details: Array<detail>
}
