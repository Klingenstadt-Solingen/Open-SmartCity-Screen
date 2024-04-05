import { Base } from './base'

export interface DiashowObject extends Base {
  startDate: Date | { iso: string }
  endDate: Date | { iso: string }
  file: { name: string; url: string }
  duration: number
  fileType: string
}
