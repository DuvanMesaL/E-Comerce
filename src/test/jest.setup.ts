import { jest } from "@jest/globals";

// Mock MongoDB
jest.mock("mongodb", () => {
  const mockToArray = jest.fn<() => Promise<any[]>>().mockResolvedValue([]);
  const mockSort = jest.fn().mockReturnValue({ toArray: mockToArray });
  const mockFind = jest.fn().mockReturnValue({ sort: mockSort });
  const mockInsertOne = jest.fn<() => Promise<any>>().mockResolvedValue({ insertedId: "mock-id" });
  const mockCreateIndex = jest.fn<() => Promise<string>>().mockResolvedValue("mock-index");
  const mockCollection = jest.fn().mockReturnValue({
    insertOne: mockInsertOne,
    find: mockFind,
    createIndex: mockCreateIndex,
  });
  const mockDb = jest.fn().mockReturnValue({
    collection: mockCollection,
  });
  const mockConnect = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const mockClose = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);

  const MockMongoClient = jest.fn().mockImplementation(() => {
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
jest.mock("kafkajs", () => {
  const mockSend = jest.fn<() => Promise<any>>().mockResolvedValue(undefined);
  const mockProducerConnect = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const mockDisconnect = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const mockSubscribe = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const mockRun = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const mockConsumerConnect = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);

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

  const MockKafka = jest.fn().mockImplementation(() => {
    return {
      producer: jest.fn().mockReturnValue(mockProducer),
      consumer: jest.fn().mockReturnValue(mockConsumer),
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
jest.mock("../lib/postgres", () => {
  const mockQuery = jest.fn<() => Promise<{ rows: any[] }>>().mockResolvedValue({ rows: [] });

  const mockTransaction = jest.fn().mockImplementation(async (callback: any) => {
    const client = {
      query: jest.fn<() => Promise<{ rows: any[] }>>().mockResolvedValue({ rows: [] }),
      release: jest.fn(),
    };
    return callback(client);
  });

  return {
    query: mockQuery,
    transaction: mockTransaction,
    testConnection: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
    closePool: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
    __mocks: {
      query: mockQuery,
      transaction: mockTransaction,
    },
  };
});

// Mock UUID
jest.mock("uuid", () => ({
  v4: jest.fn().mockReturnValue("test-event-id"),
}));
