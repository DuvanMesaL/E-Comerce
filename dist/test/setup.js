"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import the mocks first
require("./simple-mocks");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const postgres_1 = require("../lib/postgres");
const event_store_1 = require("../lib/event-store");
const globals_1 = require("@jest/globals");
// Fix dotenv import in config
globals_1.jest.mock("../config", () => {
    const originalModule = globals_1.jest.requireActual("../config");
    return {
        __esModule: true,
        ...originalModule,
        default: originalModule,
    };
});
// MongoDB Memory Server for tests
let mongoServer;
(0, globals_1.beforeAll)(async () => {
    // Start MongoDB Memory Server
    mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();
});
(0, globals_1.afterAll)(async () => {
    // Clean up after tests
    await (0, postgres_1.closePool)();
    await (0, event_store_1.closeMongoDB)();
    if (mongoServer) {
        await mongoServer.stop();
    }
});
