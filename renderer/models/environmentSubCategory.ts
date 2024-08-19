import { Relation } from 'parse'
import { Base } from './base'
import { EnvironmentIcon } from './environmentIcon'
import { EnvironmentSensorType } from './environmentSensorType'

export interface EnvironmentSubCategory extends Base {
  name: string
  order: number
  icon: EnvironmentIcon
  sensorTypes: Relation<Parse.Object<EnvironmentSensorType>>
}
