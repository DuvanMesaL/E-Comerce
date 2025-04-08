import { jest } from '@jest/globals'

// Tipado de cliente PostgreSQL simulado
type MockPostgresClient = {
  query: jest.Mock<() => Promise<{ rows: any[] }>>;
  release: jest.Mock<() => void>;
};

// Mock MongoDB
jest.mock('mongodb', () => {
  const mockToArray = jest.fn<() => Promise<any[]>>().mockResolvedValue([]);
  const mockSort = jest.fn().mockReturnValue({ toArray: mockToArray });
  const mockFind = jest.fn().mockReturnValue({ sort: mockSort });
  const mockInsertOne = jest.fn<() => Promise<{ insertedId: string }>>().mockResolvedValue({ insertedId: 'mock-id' });
  const mockCreateIndex = jest.fn<() => Promise<string>>().mockResolvedValue('mock-index');

  const mockCollection = jest.fn().mockReturnValue({
    insertOne: mockInsertOne,
    find: mockFind,
    createIndex: mockCreateIndex,
  });

  const mockDb = jest.fn().mockReturnValue({ collection: mockCollection });
  const mockConnect = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const mockClose = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);

  return {
    MongoClient: jest.fn().mockImplementation(() => ({
      connect: mockConnect,
      db: mockDb,
      close: mockClose,
    }))
  };
}, { virtual: true });

// Mock KafkaJS
jest.mock('kafkajs', () => {
  const mockSend = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const mockProducerConnect = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const mockProducerDisconnect = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);

  const mockSubscribe = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const mockRun = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const mockConsumerConnect = jest.fn<() => Promise<void>>().mockResolvedValue(undefined);

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
    Kafka: jest.fn().mockImplementation(() => ({
      producer: jest.fn().mockReturnValue(mockProducer),
      consumer: jest.fn().mockReturnValue(mockConsumer),
    })),
    __mocks: {
      producer: mockProducer,
      consumer: mockConsumer,
    },
  };
}, { virtual: true });

// Mock PostgreSQL
jest.mock('../lib/postgres', () => {
  const query = jest.fn<() => Promise<{ rows: any[] }>>().mockResolvedValue({ rows: [] });
  const release = jest.fn<() => void>();

  const client: MockPostgresClient = {
    query,
    release,
  };

  const mockTransaction = jest.fn(
    async (callback: (client: MockPostgresClient) => Promise<any>) => {
      return await callback(client)
    }
  )
  
  return {
    query,
    transaction: mockTransaction,
    testConnection: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
    closePool: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
  };
}, { virtual: true });

// Mock UUID
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('test-event-id')
}), { virtual: true });

// Mock dotenv
jest.mock('dotenv', () => ({
  config: jest.fn()
}), { virtual: true });
