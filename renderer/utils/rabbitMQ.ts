import { Client, IMessage } from '@stomp/stompjs'
import { DigitalTwinMessage } from '../models/digitaltwin'
import { useEffect, useState } from 'react'

const useRabbitMQ = (exchangeName: string, maxMessages = 3): DigitalTwinMessage[] => {
  const [rabbitMessages, setRabbitMessages] = useState<DigitalTwinMessage[]>([])

  useEffect(() => {
    const brokerURL = process.env.NEXT_PUBLIC_RABBITMQ_HOST
    if (!brokerURL) {
      console.error('brokerURL is undefined. Please check your environment variables.')
      return
    }

    const client = new Client({
      webSocketFactory: () => new WebSocket(brokerURL),
      connectHeaders: {
        login: process.env.NEXT_PUBLIC_RABBITMQ_USER,
        passcode: process.env.NEXT_PUBLIC_RABBITMQ_PASSWORD
      },
      onConnect: () => {
        console.log(`Connected to RabbitMQ. Subscribing to exchange: ${exchangeName}`)

        client.subscribe(
          `/exchange/${exchangeName}/*`,
          (message: IMessage) => {
            try {
              const payload = JSON.parse(message.body) as DigitalTwinMessage

              setRabbitMessages((prevMessages) => {
                const updatedMessages = [
                  payload,
                  ...prevMessages.filter((msg) => msg.uuid !== payload.uuid)
                ]

                return updatedMessages.slice(0, maxMessages)
              })
            } catch (error) {
              console.warn('Invalid messagqe received:', message, error)
            }

            message.ack()
          },
          {
            ack: 'client'
          }
        )
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame)
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error:', event)
      },
      onDisconnect: () => {
        console.log('Disconnected from RabbitMQ')
      }
    })

    const connectToRabbitMQ = () => {
      console.log('Attempting to connect to RabbitMQ...')
      client.activate()
    }

    connectToRabbitMQ()

    return () => {
      console.log('Cleaning up RabbitMQ connection...')
      if (client.active) {
        client.deactivate()
      }
    }
  }, [exchangeName, maxMessages])

  return rabbitMessages
}

export default useRabbitMQ
