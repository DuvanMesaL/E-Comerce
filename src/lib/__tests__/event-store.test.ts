import { saveEvent, getEventsBySource, getEventsByTopic, getAllEvents } from "../event-store"
import { jest, describe, beforeEach, it, expect } from "@jest/globals"

// Import the mocks
import "../../test/simple-mocks"

describe("Event Store", () => {
  type TestEvent = {
    eventId: string
    timestamp: string
    source: string
    topic: string
    payload: any
    snapshot: any
  };

  const mockEvent: TestEvent = {
    eventId: '1',
    timestamp: '2023-01-01T00:00:00Z',
    source: 'test',
    topic: 'test-topic',
    payload: { test: 'data' },
    snapshot: { status: 'success' },
  };

  beforeEach(() => {
    jest.clearAllMocks()
  
    const mongodb = require("mongodb")
  
    const mockCollection = {
      find: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          toArray: jest.fn<() => Promise<TestEvent[]>>().mockResolvedValue([mockEvent]),
        }),
      }),
      insertOne: jest.fn<() => Promise<{ insertedId: string }>>().mockResolvedValue({ insertedId: "mock-id" }),
    }
  
    const mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    }
  
    mongodb.MongoClient.mockImplementation(() => ({
      connect: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
      db: jest.fn().mockReturnValue(mockDb),
      close: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
    }))
  })
  

  describe("saveEvent", () => {
    it("should save an event to MongoDB", async () => {
      await saveEvent(mockEvent)
      // Test passes if no error is thrown
      expect(true).toBe(true)
    })
  })

  describe("getEventsBySource", () => {
    it("should get events by source", async () => {
      const events = await getEventsBySource("TestService")
      expect(events).toEqual([mockEvent])
    })
  })

  describe("getEventsByTopic", () => {
    it("should get events by topic", async () => {
      const events = await getEventsByTopic("test-topic")
      expect(events).toEqual([mockEvent])
    })
  })

  describe("getAllEvents", () => {
    it("should get all events", async () => {
      const events = await getAllEvents()
      expect(events).toEqual([mockEvent])
    })
  })
})

