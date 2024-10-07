import React from 'react'
import {
  DigitalTwinMessage,
  ProcessedDigitalMessage,
  DigitalTwinPressRelease,
  DigitalTwinProject,
  DigitalTwinJobPosting,
  DigitalTwinEvent,
  DigitalTwinPlainMessage
} from '../../../models/digitaltwin'
import { Pressrelease } from '../../../public/Pressrelease'
import { Project } from '../../../public/Project'
import { Jobposting } from '../../../public/Jobposting'
import { Event } from '../../../public/Event'

const getStringValue = (value: string) => {
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value)
  }
  return String(value)
}

const processMessage = (message: DigitalTwinMessage): ProcessedDigitalMessage | null => {
  if (!message || !message.payload) return null

  const innerPayload = message.payload
  const eventType = message.event_type || 'unknown'

  switch (eventType) {
    case 'press_release': {
      const pressrelease = innerPayload as DigitalTwinPressRelease
      return {
        eventType: 'Pressemitteilung',
        title: getStringValue(pressrelease.title) || 'Unbekannte Pressemitteilung',
        createdAt: new Date(pressrelease.createdAt || Date.now()).toLocaleString(),
        image: pressrelease.imageUrl || <Pressrelease></Pressrelease>,
        location: pressrelease.readingTime + ' Minuten Lesezeit'
      }
    }

    case 'project': {
      const project = innerPayload as DigitalTwinProject
      const statusMapping: { [key: string]: string } = {
        completed_status: 'Abgeschlossen',
        ongoing: 'Laufend'
      }
      return {
        eventType: 'Projekt',
        title: project.name || 'Unbekanntes Projekt',
        location: statusMapping[project.status?.title] || 'Kein Standort',
        createdAt: new Date(project.startDate?.iso || Date.now()).toLocaleString(),
        image: project.image || <Project></Project>
      }
    }

    case 'job_posting': {
      const jobposting = innerPayload as DigitalTwinJobPosting
      return {
        eventType: 'Stellenanzeige',
        title: jobposting.title || 'Unbekannter Job',
        location: jobposting.hiringOrganization?.name || 'Unbekannte Firma',
        createdAt: new Date(jobposting.postingDate || Date.now()).toLocaleString(),
        image: jobposting.hiringOrganization?.imageUrl || <Jobposting></Jobposting>
      }
    }

    case 'event': {
      const event = innerPayload as DigitalTwinEvent
      return {
        eventType: 'Veranstaltung',
        title: getStringValue(event.name) || 'Unbekanntes Event',
        createdAt: new Date(event.createdAt || Date.now()).toLocaleString(),
        image: event.image || <Event></Event>,
        location: `${event.location?.address?.addressLocality}, ${event.location?.address?.postalCode}, ${event.location?.address?.streetAddress}`
      }
    }

    case 'plain_message': {
      const plainMessage = innerPayload as unknown as DigitalTwinPlainMessage
      return {
        eventType: 'Meldung',
        title: getStringValue(plainMessage.title) || 'Unbekanntes Event',
        createdAt: new Date(plainMessage.createdAt || Date.now()).toLocaleString(),
        location: null,
        image: plainMessage.severity || <Event></Event>,
        severity: plainMessage.severity
      }
    }

    default:
      return {
        eventType: 'Unbekannter Typ',
        title: 'Unbekannte Nachricht',
        createdAt: new Date().toLocaleString(),
        location: 'Unbekannter Ort',
        image: null
      }
  }
}

const updateMessageTime = (createdAt: string) => {
  const [datePart, timePart] = createdAt.split(', ')
  const [day, month, year] = datePart.split('.').map(Number)
  const [hours, minutes, seconds] = timePart.split(':').map(Number)

  const createdDate = new Date(year, month - 1, day, hours, minutes, seconds)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'jetzt'
  }

  if (diffInSeconds < 3600) {
    const minutesDiff = Math.floor(diffInSeconds / 60)
    return `${minutesDiff} Minute${minutesDiff !== 1 ? 'n' : ''}`
  } else {
    const hoursDiff = Math.floor(diffInSeconds / 3600)
    return `${hoursDiff} Stunde${hoursDiff !== 1 ? 'n' : ''}`
  }
}

const ComponentCommonNewstickerItem = ({ message }: { message: ProcessedDigitalMessage }) => {
  if (!message) return null

  const backgroundColor = message.severity === 'high' ? 'bg-red-500' : 'bg-white'

  return (
    <div
      className={`flex items-center ${backgroundColor} border-gray-300 rounded-2xl shadow-md w-full h-24 p-1`}
    >
      {message.image ? (
        typeof message.image === 'string' ? (
          <img
            src={message.image}
            alt="message-icon"
            className="w-16 h-16 object-cover rounded-full"
          />
        ) : (
          <div className="flex items-center justify-center object-cover w-20 h-16 bg-gray-200 rounded-full">
            {message.image}
          </div>
        )
      ) : (
        <div className="flex items-center justify-center max-w-10 w-16 h-16 bg-gray-200 rounded-full">
          <div className="text-red-500" />
        </div>
      )}
      <div className="ml-4 flex-1 w-32 fade-container">
        <span className="block text-lg !line-clamp-2 font-semibold text-fade">
          {message.eventType}
        </span>
        <span className="block text-md !line-clamp-2 text-gray-700 text-fade">{message.title}</span>
      </div>
      <div className="flex flex-col mr-1 items-end">
        <span className="text-sm text-gray-500 text-right">
          {message.location || 'Unbekannter Ort'}
        </span>
        <span className="text-sm text-gray-500 text-right">
          {'Stand: ' + updateMessageTime(message.createdAt)}
        </span>
      </div>
    </div>
  )
}

interface DigitalTwinProps {
  messages: DigitalTwinMessage[]
}

export default function DigitalTwin({ messages }: DigitalTwinProps): React.JSX.Element | null {
  const processedMessages = messages
    .map(processMessage)
    .filter((message): message is ProcessedDigitalMessage => message !== null) // Type guard
    .slice(0, 3)

  if (processedMessages.length === 0) {
    return null
  }

  return (
    <div className="flex justify-center">
      {processedMessages.map((message, index) => (
        <div className="flex-grow m-2 w-1/3 max-w-xs" key={index}>
          <ComponentCommonNewstickerItem message={message} />
        </div>
      ))}
    </div>
  )
}
