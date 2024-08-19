import { Base } from './base'
import { POI } from './poi'

export interface EnvironmentStation extends Base {
  name: string
  poi: POI
}
