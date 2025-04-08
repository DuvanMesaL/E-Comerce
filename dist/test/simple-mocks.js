"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
// Mock MongoDB
globals_1.jest.mock("mongodb", () => {
    return {
        MongoClient: globals_1.jest.fn().mockImplementation(() => ({
            connect: globals_1.jest.fn().mockImplementation(() => Promise.resolve()),
            db: globals_1.jest.fn().mockImplementation(() => ({
                collection: globals_1.jest.fn().mockImplementation(() => ({
                    insertOne: globals_1.jest.fn().mockImplementation(() => Promise.resolve({ insertedId: "mock-id" })),
                    find: globals_1.jest.fn().mockImplementation(() => ({
                        sort: globals_1.jest.fn().mockImplementation(() => ({
                            toArray: globals_1.jest.fn().mockImplementation(() => Promise.resolve([])),
                        })),
                    })),
                    createIndex: globals_1.jest.fn().mockImplementation(() => Promise.resolve("mock-index")),
                })),
            })),
            close: globals_1.jest.fn().mockImplementation(() => Promise.resolve()),
        })),
    };
});
// Mock KafkaJS
globals_1.jest.mock("kafkajs", () => {
    const mockProducer = {
        connect: globals_1.jest.fn().mockImplementation(() => Promise.resolve()),
        send: globals_1.jest.fn().mockImplementation(() => Promise.resolve()),
        disconnect: globals_1.jest.fn().mockImplementation(() => Promise.resolve()),
    };
    const mockConsumer = {
        connect: globals_1.jest.fn().mockImplementation(() => Promise.resolve()),
        subscribe: globals_1.jest.fn().mockImplementation(() => Promise.resolve()),
        run: globals_1.jest.fn().mockImplementation(() => Promise.resolve()),
    };
    return {
        Kafka: globals_1.jest.fn().mockImplementation(() => ({
            producer: globals_1.jest.fn().mockImplementation(() => mockProducer),
            consumer: globals_1.jest.fn().mockImplementation(() => mockConsumer),
        })),
    };
});
// Mock PostgreSQL
globals_1.jest.mock("../lib/postgres", () => {
    return {
        query: globals_1.jest.fn().mockImplementation(() => Promise.resolve({ rows: [] })),
        transaction: globals_1.jest.fn().mockImplementation(async (callback) => {
            const client = {
                query: globals_1.jest.fn().mockImplementation(() => Promise.resolve({ rows: [] })),
                release: globals_1.jest.fn(),
            };
            return callback(client);
        }),
        testConnection: globals_1.jest.fn().mockImplementation(() => Promise.resolve(true)),
        closePool: globals_1.jest.fn().mockImplementation(() => Promise.resolve()),
    };
});
// Mock UUID
globals_1.jest.mock("uuid", () => ({
    v4: globals_1.jest.fn().mockImplementation(() => "test-event-id"),
}));
// Mock dotenv
globals_1.jest.mock("dotenv", () => ({
    config: globals_1.jest.fn(),
}));
