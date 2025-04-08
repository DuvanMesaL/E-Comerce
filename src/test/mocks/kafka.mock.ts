import type { Kafka, Producer, Consumer } from "kafkajs"
import { jest } from "@jest/globals"

type Logger = {
  info: jest.Mock
  error: jest.Mock
  warn: jest.Mock
  debug: jest.Mock
  setLogLevel: jest.Mock
  namespace: jest.Mock
}

const createMockLogger = (): Logger => {
  const logger: Partial<Logger> = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    setLogLevel: jest.fn(),
    namespace: jest.fn(),
  }
  logger.namespace!.mockReturnValue(logger as Logger)
  return logger as Logger
}

export const createMockKafka = () => {
  // Producer mocks
  const mockSend = jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
  const mockProducerConnect = jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
  const mockProducerDisconnect = jest.fn<() => Promise<void>>().mockResolvedValue(undefined)

  const mockProducer = {
    connect: mockProducerConnect,
    send: mockSend,
    disconnect: mockProducerDisconnect,
    logger: createMockLogger,
  } as unknown as Producer

  // Consumer mocks
  const mockSubscribe = jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
  const mockRun = jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
  const mockConsumerConnect = jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
  const mockConsumerDisconnect = jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
  const mockDescribeGroup = jest.fn<() => Promise<{
    groupId: string
    members: any[]
    protocol: string
    protocolType: string
    state: string
  }>>().mockResolvedValue({
    groupId: "test-group",
    members: [],
    protocol: "roundrobin",
    protocolType: "consumer",
    state: "Stable",
  })
  const mockPaused = jest.fn<() => any[]>().mockReturnValue([])

  const mockConsumer = {
    connect: mockConsumerConnect,
    disconnect: mockConsumerDisconnect,
    subscribe: mockSubscribe,
    run: mockRun,
    stop: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
    commitOffsets: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
    pause: jest.fn(),
    resume: jest.fn(),
    seek: jest.fn(),
    describeGroup: mockDescribeGroup,
    paused: mockPaused,
    on: jest.fn(),
    logger: createMockLogger,
  } as unknown as Consumer

  const mockKafkaInstance = {
    producer: jest.fn().mockReturnValue(mockProducer),
    consumer: jest.fn().mockReturnValue(mockConsumer),
  } as unknown as Kafka

  return {
    instance: mockKafkaInstance,
    producer: mockProducer,
    consumer: mockConsumer,
    methods: {
      send: mockSend,
      producerConnect: mockProducerConnect,
      producerDisconnect: mockProducerDisconnect,
      subscribe: mockSubscribe,
      run: mockRun,
      consumerConnect: mockConsumerConnect,
      consumerDisconnect: mockConsumerDisconnect,
      describeGroup: mockDescribeGroup,
    },
  }
}

// Kafka mock export
export const mockKafkaJS = () => {
  const mockKafka = createMockKafka()
  jest.mock("kafkajs", () => ({
    Kafka: jest.fn().mockImplementation(() => mockKafka.instance),
  }))
  return mockKafka
}
