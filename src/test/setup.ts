// Import the mocks first
import "./simple-mocks"
import { MongoMemoryServer } from "mongodb-memory-server"
import { closePool } from "../lib/postgres"
import { closeMongoDB } from "../lib/event-store"
import { jest, beforeAll, afterAll } from "@jest/globals"

// Fix dotenv import in config
jest.mock("../config", () => {
  const originalModule = jest.requireActual("../config") as any;
  return {
    __esModule: true,
    ...originalModule,
    default: originalModule,
  };
});

// MongoDB Memory Server for tests
let mongoServer: MongoMemoryServer

beforeAll(async () => {
  // Start MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongoServer.getUri()
})

afterAll(async () => {
  // Clean up after tests
  await closePool()
  await closeMongoDB()

  if (mongoServer) {
    await mongoServer.stop()
  }
})

