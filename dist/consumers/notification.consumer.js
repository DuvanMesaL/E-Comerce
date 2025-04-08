"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initNotificationConsumer = void 0;
const kafka_1 = require("../lib/kafka");
const config_1 = __importDefault(require("../config"));
const email_1 = require("../lib/email");
// Process notification events
const processNotification = async (messagePayload) => {
    const { message } = messagePayload;
    const messageValue = message.value?.toString();
    if (!messageValue) {
        console.error("Empty message received in notification consumer");
        return;
    }
    try {
        const event = JSON.parse(messageValue);
        console.log(`Processing notification event: ${event.eventId}`);
        // Extract email data
        const { to, subject, content } = event.payload;
        // Send email
        await (0, email_1.sendEmail)({
            to,
            subject,
            content,
        });
        console.log(`Notification sent to: ${to}`);
    }
    catch (error) {
        console.error("Error processing notification event:", error);
    }
};
// Initialize notification consumer
const initNotificationConsumer = async () => {
    const consumer = await (0, kafka_1.createConsumer)("notification-group");
    await (0, kafka_1.subscribeToTopic)(consumer, config_1.default.topics.notification, processNotification);
    return consumer;
};
exports.initNotificationConsumer = initNotificationConsumer;
