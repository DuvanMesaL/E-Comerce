"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
// Mock MongoDB
globals_1.jest.mock('mongodb', () => {
    const mockToArray = globals_1.jest.fn().mockResolvedValue([]);
    const mockSort = globals_1.jest.fn().mockReturnValue({ toArray: mockToArray });
    const mockFind = globals_1.jest.fn().mockReturnValue({ sort: mockSort });
    const mockInsertOne = globals_1.jest.fn().mockResolvedValue({ insertedId: 'mock-id' });
    const mockCreateIndex = globals_1.jest.fn().mockResolvedValue('mock-index');
    const mockCollection = globals_1.jest.fn().mockReturnValue({
        insertOne: mockInsertOne,
        find: mockFind,
        createIndex: mockCreateIndex,
    });
    const mockDb = globals_1.jest.fn().mockReturnValue({ collection: mockCollection });
    const mockConnect = globals_1.jest.fn().mockResolvedValue(undefined);
    const mockClose = globals_1.jest.fn().mockResolvedValue(undefined);
    return {
        MongoClient: globals_1.jest.fn().mockImplementation(() => ({
            connect: mockConnect,
            db: mockDb,
            close: mockClose,
        }))
    };
}, { virtual: true });
// Mock KafkaJS
globals_1.jest.mock('kafkajs', () => {
    const mockSend = globals_1.jest.fn().mockResolvedValue(undefined);
    const mockProducerConnect = globals_1.jest.fn().mockResolvedValue(undefined);
    const mockProducerDisconnect = globals_1.jest.fn().mockResolvedValue(undefined);
    const mockSubscribe = globals_1.jest.fn().mockResolvedValue(undefined);
    const mockRun = globals_1.jest.fn().mockResolvedValue(undefined);
    const mockConsumerConnect = globals_1.jest.fn().mockResolvedValue(undefined);
    const mockProducer = {
        connect: mockProducerConnect,
        send: mockSend,
        disconnect: mockProducerDisconnect,
    };
    const mockConsumer = {
        connect: mockConsumerConnect,
        subscribe: mockSubscribe,
        run: mockRun,
    };
    return {
        Kafka: globals_1.jest.fn().mockImplementation(() => ({
            producer: globals_1.jest.fn().mockReturnValue(mockProducer),
            consumer: globals_1.jest.fn().mockReturnValue(mockConsumer),
        })),
        __mocks: {
            producer: mockProducer,
            consumer: mockConsumer,
        },
    };
}, { virtual: true });
// Mock PostgreSQL
globals_1.jest.mock('../lib/postgres', () => {
    const query = globals_1.jest.fn().mockResolvedValue({ rows: [] });
    const release = globals_1.jest.fn();
    const client = {
        query,
        release,
    };
    const mockTransaction = globals_1.jest.fn(async (callback) => {
        return await callback(client);
    });
    return {
        query,
        transaction: mockTransaction,
        testConnection: globals_1.jest.fn().mockResolvedValue(true),
        closePool: globals_1.jest.fn().mockResolvedValue(undefined),
    };
}, { virtual: true });
// Mock UUID
globals_1.jest.mock('uuid', () => ({
    v4: globals_1.jest.fn().mockReturnValue('test-event-id')
}), { virtual: true });
// Mock dotenv
globals_1.jest.mock('dotenv', () => ({
    config: globals_1.jest.fn()
}), { virtual: true });
