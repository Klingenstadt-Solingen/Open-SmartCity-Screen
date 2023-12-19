import { Base } from './base'

export interface PressRelease extends Base {
  date: { iso: string } | Date
  imageUrl: string
  title: string
  content: string
}
