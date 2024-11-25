import { Person } from './person'

export interface Member {
  id: string
  mayor: boolean
  organizationName: string
  person: Person
  role: string
  startDate: string
  votingRight: boolean
}
