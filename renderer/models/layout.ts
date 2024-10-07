import { Base } from './base'
import { Diashow } from './diashow'
import { Grid } from './grid'

export interface Layout extends Base {
  gridConfig?: Grid
  diashowConfig?: Diashow
  showHeader?: boolean
  showFooter?: boolean
  showNewsticker?: boolean
}
