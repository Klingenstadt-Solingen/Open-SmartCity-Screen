import { GeoPoint } from 'parse'
import { Base } from './base'
import { PoiCategory } from './poi-category'

interface detail {
  type?: string
  title?: string
  value?: string
  filterField?: string
  symbolMimetype?: string
  symbolName?: string
  symbolPath?: string
}
export interface POI extends Base {
  poiCategory: string
  poiCategoryFull?: PoiCategory
  name: string
  geopoint: GeoPoint
  address: string
  district: string
  city: string
  zip: string
  details: Array<detail>
}
