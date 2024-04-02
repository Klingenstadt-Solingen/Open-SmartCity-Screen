import { File } from 'parse'
import { Base } from './base'

export interface DiashowObject extends Base {
  startDate: Date | { iso: string }
  endDate: Date | { iso: string }
  file: File
  duration: number
  fileType: string
}
