"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCartRemovalConsumer = void 0;
const kafka_1 = require("../lib/kafka");
const config_1 = __importDefault(require("../config"));
const processCartRemoval = async (messagePayload) => {
    const { message } = messagePayload;
    const messageValue = message.value?.toString();
    if (!messageValue) {
        console.error("Empty message received in cart removal consumer");
        return;
    }
    try {
        const event = JSON.parse(messageValue);
        console.log(`Processing cart removal event: ${event.eventId}`);
        const { userId, productId, userEmail, productName } = event.payload;
        const notificationPayload = {
            to: userEmail,
            subject: "¿Olvidaste algo en tu carrito?",
            content: `
        <h1>Artículo eliminado de tu carrito</h1>
        <p>Hola,</p>
        <p>Vimos que eliminaste "${productName}" de tu carrito.</p>
        <p>¿Necesitas ayuda para encontrar algo más? Estamos aquí para ayudarte.</p>
        <p>Vuelve a visitar nuestra tienda para ver más productos.</p>
      `,
        };
        await (0, kafka_1.publishEvent)(config_1.default.topics.notification, "CartRemovalService", notificationPayload, {
            userId,
            productId,
            status: "CART_REMOVAL_NOTIFICATION_SENT",
        });
        console.log(`Cart removal notification sent for user: ${userEmail}`);
    }
    catch (error) {
        console.error("Error processing cart removal event:", error);
    }
};
// Initialize cart removal consumer
const initCartRemovalConsumer = async () => {
    const consumer = await (0, kafka_1.createConsumer)("cart-removal-group");
    await (0, kafka_1.subscribeToTopic)(consumer, config_1.default.topics.cartRemovals, processCartRemoval);
    return consumer;
};
exports.initCartRemovalConsumer = initCartRemovalConsumer;
