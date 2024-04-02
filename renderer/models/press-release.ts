import { Base } from './base'

export interface PressRelease extends Base {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  date: any
  imageUrl: string
  title: string
  content: string
  sourceId?: string
}
