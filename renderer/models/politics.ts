import { Person } from './person'
import { Location } from './location'
import { Member } from './member'

export interface Politics {
  classification: string
  id: string
  location: Location
  memberCount: number
  name: string
  newestMayor: Member
  organizationType: string
  shortName: string
  startDate: string
  votingMemberCount: number
  webUrl: string
  website: string
  endDateTime: string | number | Date
  startDateTime: string
  organizationName: string
  person: Person
  role: string
  index: string
  attributes: Record<string, { __component: string; text?: string; content?: string }>
}
