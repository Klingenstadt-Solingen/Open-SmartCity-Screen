import { Base } from './base'

export interface PoiCategory extends Base {
  sourceId: string
  metathema: string
  symbolName: string
  iconName: string
  symbolMimetype: string
  iconMimetype: string
  name: string
  showCategory: 'true' | 'false'
  mapTitle: string
  symbolPath: string
  iconPath: string
}
