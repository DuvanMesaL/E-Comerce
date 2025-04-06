import { Kafka, type Producer, type Consumer, type EachMessagePayload } from "kafkajs"
import config from "../config"
import { v4 as uuidv4 } from "uuid"
import { saveEvent } from "./event-store"

// Initialize Kafka client
const kafka = new Kafka({
  clientId: config.kafka.clientId,
  brokers: config.kafka.brokers,
})

// Create a producer instance
let producer: Producer | null = null

// Initialize the producer
export const initProducer = async (): Promise<Producer> => {
  if (!producer) {
    producer = kafka.producer()
    await producer.connect()
    console.log("Kafka producer connected")
  }
  return producer
}

// Create a consumer instance
export const createConsumer = async (groupId: string): Promise<Consumer> => {
  const consumer = kafka.consumer({ groupId })
  await consumer.connect()
  console.log(`Kafka consumer connected: ${groupId}`)
  return consumer
}

// Publish an event to a Kafka topic
export const publishEvent = async <T>(
  topic: string,
  source: string,
  payload: T,
  snapshot?: any
)
: Promise<string> =>
{
  if (!producer) {
    await initProducer()
  }

  const eventId = uuidv4()
  const timestamp = new Date().toISOString()

  // Store the event in MongoDB
  await saveEvent({
    eventId,
    timestamp,
    source,
    topic,
    payload,
    snapshot: snapshot || {},
  })

  // Publish to Kafka
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
  return eventId;
}

// Subscribe to a Kafka topic
export const subscribeToTopic = async (
  consumer: Consumer,
  topic: string,
  handler: (message: EachMessagePayload) => Promise<void>,
): Promise<void> => {
  await consumer.subscribe({ topic, fromBeginning: true })

  await consumer.run({
    eachMessage: async (messagePayload) => {
      try {
        await handler(messagePayload)
      } catch (error) {
        console.error(`Error processing message from ${topic}:`, error)
      }
    },
  })

  console.log(`Subscribed to topic: ${topic}`)
}

// Disconnect Kafka clients
export const disconnectKafka = async (): Promise<void> => {
  if (producer) {
    await producer.disconnect()
    producer = null
    console.log("Kafka producer disconnected")
  }
}

