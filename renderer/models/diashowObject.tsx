import { Base } from './base'

export interface DiashowObject extends Base {
  startDate: Date | { iso: string }
  endDate: Date | { iso: string }
  file: file
  duration: number
  fileType: string
}

interface file {
  name: string
  url: string
}
