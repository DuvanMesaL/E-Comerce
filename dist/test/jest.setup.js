"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
// Mock MongoDB
globals_1.jest.mock("mongodb", () => {
    const mockToArray = globals_1.jest.fn().mockResolvedValue([]);
    const mockSort = globals_1.jest.fn().mockReturnValue({ toArray: mockToArray });
    const mockFind = globals_1.jest.fn().mockReturnValue({ sort: mockSort });
    const mockInsertOne = globals_1.jest.fn().mockResolvedValue({ insertedId: "mock-id" });
    const mockCreateIndex = globals_1.jest.fn().mockResolvedValue("mock-index");
    const mockCollection = globals_1.jest.fn().mockReturnValue({
        insertOne: mockInsertOne,
        find: mockFind,
        createIndex: mockCreateIndex,
    });
    const mockDb = globals_1.jest.fn().mockReturnValue({
        collection: mockCollection,
    });
    const mockConnect = globals_1.jest.fn().mockResolvedValue(undefined);
    const mockClose = globals_1.jest.fn().mockResolvedValue(undefined);
    const MockMongoClient = globals_1.jest.fn().mockImplementation(() => {
        return {
            connect: mockConnect,
            db: mockDb,
            close: mockClose,
        };
    });
    return {
        MongoClient: MockMongoClient,
        __mocks: {
            toArray: mockToArray,
            sort: mockSort,
            find: mockFind,
            insertOne: mockInsertOne,
            createIndex: mockCreateIndex,
            collection: mockCollection,
            db: mockDb,
            connect: mockConnect,
            close: mockClose,
        },
    };
});
// Mock Kafka
globals_1.jest.mock("kafkajs", () => {
    const mockSend = globals_1.jest.fn().mockResolvedValue(undefined);
    const mockProducerConnect = globals_1.jest.fn().mockResolvedValue(undefined);
    const mockDisconnect = globals_1.jest.fn().mockResolvedValue(undefined);
    const mockSubscribe = globals_1.jest.fn().mockResolvedValue(undefined);
    const mockRun = globals_1.jest.fn().mockResolvedValue(undefined);
    const mockConsumerConnect = globals_1.jest.fn().mockResolvedValue(undefined);
    const mockProducer = {
        connect: mockProducerConnect,
        send: mockSend,
        disconnect: mockDisconnect,
    };
    const mockConsumer = {
        connect: mockConsumerConnect,
        subscribe: mockSubscribe,
        run: mockRun,
    };
    const MockKafka = globals_1.jest.fn().mockImplementation(() => {
        return {
            producer: globals_1.jest.fn().mockReturnValue(mockProducer),
            consumer: globals_1.jest.fn().mockReturnValue(mockConsumer),
        };
    });
    return {
        Kafka: MockKafka,
        __mocks: {
            send: mockSend,
            producerConnect: mockProducerConnect,
            disconnect: mockDisconnect,
            subscribe: mockSubscribe,
            run: mockRun,
            consumerConnect: mockConsumerConnect,
            producer: mockProducer,
            consumer: mockConsumer,
        },
    };
});
// Mock PostgreSQL
globals_1.jest.mock("../lib/postgres", () => {
    const mockQuery = globals_1.jest.fn().mockResolvedValue({ rows: [] });
    const mockTransaction = globals_1.jest.fn().mockImplementation(async (callback) => {
        const client = {
            query: globals_1.jest.fn().mockResolvedValue({ rows: [] }),
            release: globals_1.jest.fn(),
        };
        return callback(client);
    });
    return {
        query: mockQuery,
        transaction: mockTransaction,
        testConnection: globals_1.jest.fn().mockResolvedValue(true),
        closePool: globals_1.jest.fn().mockResolvedValue(undefined),
        __mocks: {
            query: mockQuery,
            transaction: mockTransaction,
        },
    };
});
// Mock UUID
globals_1.jest.mock("uuid", () => ({
    v4: globals_1.jest.fn().mockReturnValue("test-event-id"),
}));
