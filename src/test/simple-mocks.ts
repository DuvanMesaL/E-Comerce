import { jest } from "@jest/globals"

// Mock MongoDB
jest.mock("mongodb", () => {
  return {
    MongoClient: jest.fn().mockImplementation(() => ({
      connect: jest.fn().mockImplementation(() => Promise.resolve()),
      db: jest.fn().mockImplementation(() => ({
        collection: jest.fn().mockImplementation(() => ({
          insertOne: jest.fn().mockImplementation(() => Promise.resolve({ insertedId: "mock-id" })),
          find: jest.fn().mockImplementation(() => ({
            sort: jest.fn().mockImplementation(() => ({
              toArray: jest.fn().mockImplementation(() => Promise.resolve([])),
            })),
          })),
          createIndex: jest.fn().mockImplementation(() => Promise.resolve("mock-index")),
        })),
      })),
      close: jest.fn().mockImplementation(() => Promise.resolve()),
    })),
  }
})

// Mock KafkaJS
jest.mock("kafkajs", () => {
  const mockProducer = {
    connect: jest.fn().mockImplementation(() => Promise.resolve()),
    send: jest.fn().mockImplementation(() => Promise.resolve()),
    disconnect: jest.fn().mockImplementation(() => Promise.resolve()),
  }

  const mockConsumer = {
    connect: jest.fn().mockImplementation(() => Promise.resolve()),
    subscribe: jest.fn().mockImplementation(() => Promise.resolve()),
    run: jest.fn().mockImplementation(() => Promise.resolve()),
  }

  return {
    Kafka: jest.fn().mockImplementation(() => ({
      producer: jest.fn().mockImplementation(() => mockProducer),
      consumer: jest.fn().mockImplementation(() => mockConsumer),
    })),
  }
})

// Mock PostgreSQL
jest.mock("../lib/postgres", () => {
  return {
    query: jest.fn().mockImplementation(() => Promise.resolve({ rows: [] })),
    transaction: jest.fn().mockImplementation(async (callback: any) => {
      const client = {
        query: jest.fn().mockImplementation(() => Promise.resolve({ rows: [] })),
        release: jest.fn(),
      }
      return callback(client)
    }),
    testConnection: jest.fn().mockImplementation(() => Promise.resolve(true)),
    closePool: jest.fn().mockImplementation(() => Promise.resolve()),
  }
})

// Mock UUID
jest.mock("uuid", () => ({
  v4: jest.fn().mockImplementation(() => "test-event-id"),
}))

// Mock dotenv
jest.mock("dotenv", () => ({
  config: jest.fn(),
}))
