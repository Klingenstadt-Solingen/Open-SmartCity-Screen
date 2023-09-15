import { Base } from './base'

export interface DiashowObject extends Base {
  startDate: Date
  endDate: Date
  file: file
  duration: number
  fileType: string
}

interface file {
  name: string
  url: string
}
