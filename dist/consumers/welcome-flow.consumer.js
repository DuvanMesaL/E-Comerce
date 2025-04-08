"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWelcomeFlowConsumer = void 0;
const kafka_1 = require("../lib/kafka");
const config_1 = __importDefault(require("../config"));
const user_model_1 = require("../models/user.model");
// Process welcome flow events
const processWelcomeFlow = async (messagePayload) => {
    const { message } = messagePayload;
    const messageValue = message.value?.toString();
    if (!messageValue) {
        console.error("Empty message received in welcome flow consumer");
        return;
    }
    try {
        const event = JSON.parse(messageValue);
        console.log(`Processing welcome flow event: ${event.eventId}`);
        // Get user details
        const user = await (0, user_model_1.findUserByEmail)(event.payload.email);
        if (!user) {
            console.error(`User not found for email: ${event.payload.email}`);
            return;
        }
        // Create notification event
        const notificationPayload = {
            to: user.email,
            subject: `¡Bienvenido a nuestra plataforma, ${user.name}!`,
            content: `
        <h1>Bienvenido a nuestro e-commerce</h1>
        <p>Hola ${user.name},</p>
        <p>Gracias por registrarte en nuestra plataforma. Estamos emocionados de tenerte con nosotros.</p>
        <p>Ahora puedes explorar nuestro catálogo y comenzar a comprar.</p>
        <p>¡Disfruta de tu experiencia de compra!</p>
      `,
        };
        // Publish notification event
        await (0, kafka_1.publishEvent)(config_1.default.topics.notification, "WelcomeFlowService", notificationPayload, {
            userId: user.id,
            status: "WELCOME_EMAIL_SENT",
        });
        console.log(`Welcome flow processed for user: ${user.email}`);
    }
    catch (error) {
        console.error("Error processing welcome flow event:", error);
    }
};
// Initialize welcome flow consumer
const initWelcomeFlowConsumer = async () => {
    const consumer = await (0, kafka_1.createConsumer)("welcome-flow-group");
    await (0, kafka_1.subscribeToTopic)(consumer, config_1.default.topics.welcomeFlow, processWelcomeFlow);
    return consumer;
};
exports.initWelcomeFlowConsumer = initWelcomeFlowConsumer;
