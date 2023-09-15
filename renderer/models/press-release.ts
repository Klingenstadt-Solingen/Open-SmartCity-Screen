import { Base } from './base'

export interface PressRelease extends Base {
  date: { iso: string }
  title: string
  content: string
}
