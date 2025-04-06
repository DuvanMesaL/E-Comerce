import { MongoClient, type Collection, type Document } from "mongodb"
import config from "../config"

let client: MongoClient | null = null
let eventsCollection: Collection<Document> | null = null

// Initialize MongoDB connection
export const initMongoDB = async (): Promise<void> => {
  if (!client) {
    client = new MongoClient(config.mongodb.uri)
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db()
    eventsCollection = db.collection("events")

    // Create indexes for better query performance
    await eventsCollection.createIndex({ timestamp: 1 })
    await eventsCollection.createIndex({ source: 1 })
    await eventsCollection.createIndex({ topic: 1 })
    await eventsCollection.createIndex({ eventId: 1 }, { unique: true })

    console.log("MongoDB indexes created")
  }
}

// Save an event to MongoDB
export const saveEvent = async (event: {
  eventId: string
  timestamp: string
  source: string
  topic: string
  payload: any
  snapshot: any
}): Promise<void> => {
  if (!eventsCollection) {
    await initMongoDB()
  }

  await eventsCollection!.insertOne(event)
  console.log(`Event saved to MongoDB: ${event.eventId}`)
}

// Get events by source
export const getEventsBySource = async (source: string): Promise<Document[]> => {
  if (!eventsCollection) {
    await initMongoDB()
  }

  return eventsCollection!.find({ source }).sort({ timestamp: 1 }).toArray()
}

// Get events by topic
export const getEventsByTopic = async (topic: string): Promise<Document[]> => {
  if (!eventsCollection) {
    await initMongoDB()
  }

  return eventsCollection!.find({ topic }).sort({ timestamp: 1 }).toArray()
}

// Get all events
export const getAllEvents = async (): Promise<Document[]> => {
  if (!eventsCollection) {
    await initMongoDB()
  }

  return eventsCollection!.find({}).sort({ timestamp: 1 }).toArray()
}

// Close MongoDB connection
export const closeMongoDB = async (): Promise<void> => {
  if (client) {
    await client.close()
    client = null
    eventsCollection = null
    console.log("MongoDB connection closed")
  }
}

