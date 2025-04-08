import { MongoClient } from "mongodb"
import config from "../config"

let client: MongoClient | null = null
let eventsCollection: any = null

type Event = {
  eventId: string
  timestamp: string
  source: string
  topic: string
  payload: any
  snapshot: any
}

export const initMongoDB = async (): Promise<void> => {
  if (!client) {
    const uri: string = config.mongodb.uri // 👈 forzamos el tipo
    client = new (MongoClient as any)(uri)

    await client!.connect()
    console.log("Connected to MongoDB")

    const db = client!.db()
    eventsCollection = db.collection("events") // 👈 no usamos <Event>

    await eventsCollection.createIndex({ timestamp: 1 })
    await eventsCollection.createIndex({ source: 1 })
    await eventsCollection.createIndex({ topic: 1 })
    await eventsCollection.createIndex({ eventId: 1 }, { unique: true })

    console.log("MongoDB indexes created")
  }
}

export const saveEvent = async (event: Event): Promise<void> => {
  if (!eventsCollection) {
    await initMongoDB()
  }

  await eventsCollection!.insertOne(event)
  console.log(`Event saved to MongoDB: ${event.eventId}`)
}

export const getEventsBySource = async (source: string): Promise<Event[]> => {
  if (!eventsCollection) {
    await initMongoDB()
  }

  return eventsCollection!.find({ source }).sort({ timestamp: 1 }).toArray()
}

export const getEventsByTopic = async (topic: string): Promise<Event[]> => {
  if (!eventsCollection) {
    await initMongoDB()
  }

  return eventsCollection!.find({ topic }).sort({ timestamp: 1 }).toArray()
}

export const getAllEvents = async (): Promise<Event[]> => {
  if (!eventsCollection) {
    await initMongoDB()
  }

  return eventsCollection!.find({}).sort({ timestamp: 1 }).toArray()
}

export const closeMongoDB = async (): Promise<void> => {
  if (client) {
    await client.close()
    client = null
    eventsCollection = null
    console.log("MongoDB connection closed")
  }
}
