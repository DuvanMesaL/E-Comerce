"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockKafkaJS = exports.createMockKafka = void 0;
const globals_1 = require("@jest/globals");
const createMockLogger = () => {
    const logger = {
        info: globals_1.jest.fn(),
        error: globals_1.jest.fn(),
        warn: globals_1.jest.fn(),
        debug: globals_1.jest.fn(),
        setLogLevel: globals_1.jest.fn(),
        namespace: globals_1.jest.fn(),
    };
    logger.namespace.mockReturnValue(logger);
    return logger;
};
const createMockKafka = () => {
    // Producer mocks
    const mockSend = globals_1.jest.fn().mockResolvedValue(undefined);
    const mockProducerConnect = globals_1.jest.fn().mockResolvedValue(undefined);
    const mockProducerDisconnect = globals_1.jest.fn().mockResolvedValue(undefined);
    const mockProducer = {
        connect: mockProducerConnect,
        send: mockSend,
        disconnect: mockProducerDisconnect,
        logger: createMockLogger,
    };
    // Consumer mocks
    const mockSubscribe = globals_1.jest.fn().mockResolvedValue(undefined);
    const mockRun = globals_1.jest.fn().mockResolvedValue(undefined);
    const mockConsumerConnect = globals_1.jest.fn().mockResolvedValue(undefined);
    const mockConsumerDisconnect = globals_1.jest.fn().mockResolvedValue(undefined);
    const mockDescribeGroup = globals_1.jest.fn().mockResolvedValue({
        groupId: "test-group",
        members: [],
        protocol: "roundrobin",
        protocolType: "consumer",
        state: "Stable",
    });
    const mockPaused = globals_1.jest.fn().mockReturnValue([]);
    const mockConsumer = {
        connect: mockConsumerConnect,
        disconnect: mockConsumerDisconnect,
        subscribe: mockSubscribe,
        run: mockRun,
        stop: globals_1.jest.fn().mockResolvedValue(undefined),
        commitOffsets: globals_1.jest.fn().mockResolvedValue(undefined),
        pause: globals_1.jest.fn(),
        resume: globals_1.jest.fn(),
        seek: globals_1.jest.fn(),
        describeGroup: mockDescribeGroup,
        paused: mockPaused,
        on: globals_1.jest.fn(),
        logger: createMockLogger,
    };
    const mockKafkaInstance = {
        producer: globals_1.jest.fn().mockReturnValue(mockProducer),
        consumer: globals_1.jest.fn().mockReturnValue(mockConsumer),
    };
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
    };
};
exports.createMockKafka = createMockKafka;
// Kafka mock export
const mockKafkaJS = () => {
    const mockKafka = (0, exports.createMockKafka)();
    globals_1.jest.mock("kafkajs", () => ({
        Kafka: globals_1.jest.fn().mockImplementation(() => mockKafka.instance),
    }));
    return mockKafka;
};
exports.mockKafkaJS = mockKafkaJS;
