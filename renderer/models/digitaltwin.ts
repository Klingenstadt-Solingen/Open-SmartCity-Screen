export interface DigitalTwinMessage {
  uuid: string
  schema_version: number
  message_version: number
  event_type: DigitalTwinEventType
  district_ids: string[]
  event_start_date_time?: string
  event_end_date_time?: string
  expected_duration?: number
  severity: 'normal' | 'low' | 'high'
  payload:
    | DigitalTwinPressRelease
    | DigitalTwinEnvironmentSensor
    | DigitalTwinEvent
    | DigitalTwinProject
    | DigitalTwinJobPosting
}

// Event Type Enum
export type DigitalTwinEventType =
  | 'press_release'
  | 'sensor'
  | 'event'
  | 'project'
  | 'job_posting'
  | 'plain_message'

export interface DigitalTwinPressRelease {
  createdAt: string
  summary: string
  date: string
  title: string
  content: string
  imageUrl?: string | JSX.Element | null
  districts: string[]
  objectId: string
  readingTime: number
  className: 'PressRelease'
}

export interface DigitalTwinEnvironmentSensor {
  id: string
  type: string
  value: number
  timestamp: string
}

export interface DigitalTwinEvent {
  image?: string | JSX.Element | null
  createdAt: number
  id: string
  name: string
  date: string
  location: {
    address: {
      addressLocality: string
      postalCode: string
      streetAddress: string
    }
  }
  details: string
}
export interface DigitalTwinPlainMessage {
  createdAt: number
  id: string
  date: string
  title: string
  message: string
  severity: string
  location: {
    address: {
      addressLocality: string
      postalCode: string
      streetAddress: string
    }
  }
}

export interface DigitalTwinProject {
  name: string
  image?: string | JSX.Element | null
  id: string
  title: string
  description: string
  startDate: {
    iso: Date
  }
  endDate: string
  status: DigitalTwinStatus
}
export interface DigitalTwinStatus {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
}

export interface DigitalTwinJobPosting {
  postingDate: number
  hiringOrganization: any
  id: string
  title: string
  description: string
  company: string
  image?: string | JSX.Element | null
  applicationDeadline: string
}

export interface ProcessedDigitalMessage {
  eventType: string
  title: string
  createdAt: string
  image?: string | JSX.Element | null
  location?: string
  payload?: DigitalTwinMessage
  severity?: string
}
