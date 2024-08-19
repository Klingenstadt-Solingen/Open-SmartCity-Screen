import { Base } from './base'
import { EnvironmentSensorType } from './environmentSensorType'
import { EnvironmentStation } from './environmentStation'

export interface EnvironmentSensor extends Base {
  refId: string
  value: number
  observedAt: Date | { iso: string }
  station: EnvironmentStation | string
  sensorType: EnvironmentSensorType | string
}
