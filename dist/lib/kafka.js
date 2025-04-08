"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectKafka = exports.subscribeToTopic = exports.publishEvent = exports.createConsumer = exports.initProducer = void 0;
const kafkajs_1 = require("kafkajs");
const config_1 = __importDefault(require("../config"));
const uuid_1 = require("uuid");
const event_store_1 = require("./event-store");
const kafka = new kafkajs_1.Kafka({
    clientId: config_1.default.kafka.clientId,
    brokers: config_1.default.kafka.brokers,
});
let producer = null;
const initProducer = async () => {
    if (!producer) {
        producer = kafka.producer();
        await producer.connect();
        console.log("Kafka producer connected");
    }
    return producer;
};
exports.initProducer = initProducer;
const createConsumer = async (groupId) => {
    const consumer = kafka.consumer({ groupId });
    await consumer.connect();
    console.log(`Kafka consumer connected: ${groupId}`);
    return consumer;
};
exports.createConsumer = createConsumer;
const publishEvent = async (topic, source, payload, snapshot) => {
    if (!producer) {
        await (0, exports.initProducer)();
    }
    const eventId = (0, uuid_1.v4)();
    const timestamp = new Date().toISOString();
    await (0, event_store_1.saveEvent)({
        eventId,
        timestamp,
        source,
        topic,
        payload,
        snapshot: snapshot || {},
    });
    await producer.send({
        topic,
        messages: [
            {
                key: eventId,
                value: JSON.stringify({
                    eventId,
                    timestamp,
                    source,
                    payload,
                }),
            },
        ],
    });
    console.log(`Event published to ${topic}: ${eventId}`);
    return eventId;
};
exports.publishEvent = publishEvent;
const subscribeToTopic = async (consumer, topic, handler) => {
    await consumer.subscribe({ topic, fromBeginning: true });
    await consumer.run({
        eachMessage: async (messagePayload) => {
            try {
                await handler(messagePayload);
            }
            catch (error) {
                console.error(`Error processing message from ${topic}:`, error);
            }
        }
    });
    console.log(`Subscribed to topic: ${topic}`);
};
exports.subscribeToTopic = subscribeToTopic;
const disconnectKafka = async () => {
    if (producer) {
        await producer.disconnect();
        producer = null;
        console.log("Kafka producer disconnected");
    }
};
exports.disconnectKafka = disconnectKafka;
