import { Base } from './base'

export interface RoomBooking extends Base {
  room: string
  description: string
  details: string
  info: string
}
