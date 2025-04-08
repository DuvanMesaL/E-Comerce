import { Kafka, type Producer, type Consumer } from "kafkajs"
import config from "../config"
import { v4 as uuidv4 } from "uuid"
import { saveEvent } from "./event-store"

const kafka = new Kafka({
  clientId: config.kafka.clientId,
  brokers: config.kafka.brokers,
})

let producer: Producer | null = null

export const initProducer = async (): Promise<Producer> => {
  if (!producer) {
    producer = kafka.producer()
    await producer.connect()
    console.log("Kafka producer connected")
  }
  return producer
}

export const createConsumer = async (groupId: string): Promise<Consumer> => {
  const consumer = kafka.consumer({ groupId })
  await consumer.connect()
  console.log(`Kafka consumer connected: ${groupId}`)
  return consumer
}

export const publishEvent = async <T>(
  topic: string,
  source: string,
  payload: T,
  snapshot?: any
): Promise<string> => {
  if (!producer) {
    await initProducer()
  }

  const eventId = uuidv4()
  const timestamp = new Date().toISOString()

  await saveEvent({
    eventId,
    timestamp,
    source,
    topic,
    payload,
    snapshot: snapshot || {},
  })

  await producer!.send({
    topic,
    messages: [
      {
        key: eventId,
        value: JSON.stringify({
          eventId,
          timestamp,
          source,
          payload,
        }),
      },
    ],
  })

  console.log(`Event published to ${topic}: ${eventId}`)
  return eventId
}

// ✅ Tipo exacto para el parámetro de `eachMessage`
type EachMessagePayloadType = Parameters<
  NonNullable<Parameters<Consumer["run"]>[0]>["eachMessage"]
>[0]

export const subscribeToTopic = async (
  consumer: Consumer,
  topic: string,
  handler: (message: EachMessagePayloadType) => Promise<void>,
): Promise<void> => {
  await consumer.subscribe({ topic, fromBeginning: true })

  await consumer.run({
    eachMessage: async (messagePayload: EachMessagePayloadType) => {
      try {
        await handler(messagePayload)
      } catch (error) {
        console.error(`Error processing message from ${topic}:`, error)
      }
    }
  })

  console.log(`Subscribed to topic: ${topic}`)
}



export const disconnectKafka = async (): Promise<void> => {
  if (producer) {
    await producer.disconnect()
    producer = null
    console.log("Kafka producer disconnected")
  }
}

export type EachMessagePayload = EachMessagePayloadType
