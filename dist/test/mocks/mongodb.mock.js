"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockMongoDB = exports.createMockMongoClient = void 0;
const globals_1 = require("@jest/globals");
const createMockMongoClient = () => {
    const mockToArray = globals_1.jest.fn().mockResolvedValue([]);
    const mockSort = globals_1.jest.fn().mockReturnValue({ toArray: mockToArray });
    const mockFind = globals_1.jest.fn().mockReturnValue({ sort: mockSort });
    const mockInsertOne = globals_1.jest.fn().mockResolvedValue({ insertedId: "mock-id" });
    const mockCreateIndex = globals_1.jest.fn().mockResolvedValue("mock-index");
    const mockCollection = {
        insertOne: mockInsertOne,
        find: mockFind,
        createIndex: mockCreateIndex,
    };
    const mockDb = {
        collection: globals_1.jest.fn().mockReturnValue(mockCollection),
    };
    const mockClient = {
        connect: globals_1.jest.fn().mockResolvedValue(undefined),
        db: globals_1.jest.fn().mockReturnValue(mockDb),
        close: globals_1.jest.fn().mockResolvedValue(undefined),
    };
    return {
        client: mockClient,
        db: mockDb,
        collection: mockCollection,
        methods: {
            find: mockFind,
            sort: mockSort,
            toArray: mockToArray,
            insertOne: mockInsertOne,
            createIndex: mockCreateIndex,
        },
    };
};
exports.createMockMongoClient = createMockMongoClient;
const mockMongoDB = () => {
    const mockMongo = (0, exports.createMockMongoClient)();
    globals_1.jest.mock("mongodb", () => ({
        MongoClient: globals_1.jest.fn().mockImplementation(() => mockMongo.client),
    }));
    return mockMongo;
};
exports.mockMongoDB = mockMongoDB;
