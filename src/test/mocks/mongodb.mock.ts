import type { MongoClient, Db, Collection } from "mongodb"
import { jest } from "@jest/globals"

export const createMockMongoClient = () => {
  const mockToArray = jest.fn<() => Promise<any[]>>().mockResolvedValue([])
  const mockSort = jest.fn().mockReturnValue({ toArray: mockToArray })
  const mockFind = jest.fn().mockReturnValue({ sort: mockSort })
  const mockInsertOne = jest.fn<() => Promise<any>>().mockResolvedValue({ insertedId: "mock-id" })
  const mockCreateIndex = jest.fn<() => Promise<string>>().mockResolvedValue("mock-index")

  const mockCollection: Partial<Collection> = {
    insertOne: mockInsertOne,
    find: mockFind,
    createIndex: mockCreateIndex,
  }

  const mockDb: Partial<Db> = {
    collection: jest.fn<() => Collection>().mockReturnValue(mockCollection as Collection),
  }

  const mockClient: Partial<MongoClient> = {
    connect: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
    db: jest.fn().mockReturnValue(mockDb as Db),
    close: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
  }

  return {
    client: mockClient as MongoClient,
    db: mockDb as Db,
    collection: mockCollection as Collection,
    methods: {
      find: mockFind,
      sort: mockSort,
      toArray: mockToArray,
      insertOne: mockInsertOne,
      createIndex: mockCreateIndex,
    },
  }
}

export const mockMongoDB = () => {
  const mockMongo = createMockMongoClient()

  jest.mock("mongodb", () => ({
    MongoClient: jest.fn().mockImplementation(() => mockMongo.client),
  }))

  return mockMongo
}
