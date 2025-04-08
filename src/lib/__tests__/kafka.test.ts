import {
  initProducer,
  publishEvent,
  createConsumer,
  subscribeToTopic,
} from "../kafka"

import { saveEvent } from "../event-store"
import { jest, describe, beforeEach, it, expect } from "@jest/globals"
import type { Consumer, GroupDescription, EachMessagePayload, TopicPartitions, Logger  } from "kafkajs"


// Import the mocks
import "../../test/simple-mocks"

// Mock the event store
jest.mock("../event-store", () => ({
  saveEvent: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
  initMongoDB: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
}))

describe("Kafka Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Reset the producer in the kafka module
    const kafkaModule = require("../kafka")
    kafkaModule.producer = null
  })

  describe("initProducer", () => {
    it("should initialize a Kafka producer", async () => {
      const producer = await initProducer()
      expect(producer).toBeDefined()
    })
  })

  describe("publishEvent", () => {
    it("should publish an event to Kafka and save it to the event store", async () => {
      const topic = "test-topic"
      const event = {
        eventId: "1",
        timestamp: new Date().toISOString(),
        source: "test-service",
        topic,
        payload: { foo: "bar" },
        snapshot: {},
      }

      await publishEvent(event.topic, event.source, event.payload, event.snapshot)

      expect(saveEvent).toHaveBeenCalledWith(event)
    })
  })

  describe("subscribeToTopic", () => {
    it("should subscribe a Kafka consumer to a topic and run the handler", async () => {
      const handler = jest.fn<(msg: EachMessagePayload) => Promise<void>>().mockResolvedValue()

      const mockConsumer: Consumer = {
        connect: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
        disconnect: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
        subscribe: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
        run: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
        stop: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
        commitOffsets: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
        pause: jest.fn(),
        resume: jest.fn(),
        seek: jest.fn(),
        describeGroup: jest.fn<() => Promise<GroupDescription>>().mockResolvedValue({
          groupId: "test-group",
          members: [],
          protocol: "roundrobin",
          protocolType: "consumer",
          state: "Stable",
        }),
        events: {
          HEARTBEAT: "consumer.heartbeat",
          COMMIT_OFFSETS: "consumer.commit_offsets",
          GROUP_JOIN: "consumer.group_join",
          FETCH_START: "consumer.fetch_start",
          FETCH: "consumer.fetch",
          START_BATCH_PROCESS: "consumer.start_batch_process",
          END_BATCH_PROCESS: "consumer.end_batch_process",
          CONNECT: "consumer.connect",
          DISCONNECT: "consumer.disconnect",
          STOP: "consumer.stop",
          CRASH: "consumer.crash",
          REQUEST: "consumer.network.request",
          REQUEST_TIMEOUT: "consumer.network.request_timeout",
          REQUEST_QUEUE_SIZE: "consumer.network.request_queue_size",
        } as any,
        paused: jest.fn<() => TopicPartitions[]>().mockReturnValue([]),
        on: jest.fn() as unknown as Consumer["on"],
        logger: (): Logger => {
          const loggerMock = {
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            setLogLevel: jest.fn(),
            namespace: jest.fn(),
          }

          loggerMock.namespace.mockReturnValue(loggerMock as Logger)
        
          return loggerMock as Logger
        },
      }

      await subscribeToTopic(mockConsumer, "test-topic", handler)

      expect(mockConsumer.subscribe).toHaveBeenCalled()
      expect(mockConsumer.run).toHaveBeenCalled()
    })
  })
})
