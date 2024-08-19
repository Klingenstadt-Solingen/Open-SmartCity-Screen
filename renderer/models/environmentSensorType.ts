import { Base } from './base'
import { EnvironmentIcon } from './environmentIcon'

export interface EnvironmentSensorType extends Base {
  order: number
  definition: string
  icon: EnvironmentIcon
  type: string
  unit: string
  name: string
}
