import { Base } from './base'

export interface EnvironmentIcon extends Base {
  icon: Parse.File & { url?: string }
  definition: string
}
