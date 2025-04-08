"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initInvoiceProcessingConsumer = void 0;
const kafka_1 = require("../lib/kafka");
const config_1 = __importDefault(require("../config"));
const order_model_1 = require("../models/order.model");
// Process invoice events
const processInvoice = async (messagePayload) => {
    const { message } = messagePayload;
    const messageValue = message.value?.toString();
    if (!messageValue) {
        console.error("Empty message received in invoice processing consumer");
        return;
    }
    try {
        const event = JSON.parse(messageValue);
        console.log(`Processing invoice event: ${event.eventId}`);
        // Extract order data
        const { orderId, userEmail } = event.payload;
        // Get order details
        const order = await (0, order_model_1.getOrderById)(orderId);
        if (!order) {
            console.error(`Order not found: ${orderId}`);
            return;
        }
        // Update order status
        await (0, order_model_1.updateOrderStatus)(orderId, order_model_1.OrderStatus.PROCESSING);
        // Generate invoice content
        const invoiceContent = `
      <h1>Factura #${orderId}</h1>
      <p>Fecha: ${new Date().toLocaleDateString()}</p>
      <h2>Detalles del pedido</h2>
      <table border="1" cellpadding="5" style="border-collapse: collapse;">
        <tr>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio unitario</th>
          <th>Total</th>
        </tr>
        ${order.items
            .map((item) => `
          <tr>
            <td>${item.name || "Producto"}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `)
            .join("")}
        <tr>
          <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
          <td><strong>$${order.totalAmount.toFixed(2)}</strong></td>
        </tr>
      </table>
      <p>Gracias por tu compra!</p>
    `;
        // Create notification for invoice
        const notificationPayload = {
            to: userEmail,
            subject: `Factura #${orderId}`,
            content: invoiceContent,
        };
        // Publish notification event
        await (0, kafka_1.publishEvent)(config_1.default.topics.notification, "InvoiceService", notificationPayload, {
            orderId,
            status: "INVOICE_SENT",
        });
        console.log(`Invoice sent for order: ${orderId}`);
    }
    catch (error) {
        console.error("Error processing invoice event:", error);
    }
};
// Initialize invoice processing consumer
const initInvoiceProcessingConsumer = async () => {
    const consumer = await (0, kafka_1.createConsumer)("invoice-processing-group");
    await (0, kafka_1.subscribeToTopic)(consumer, config_1.default.topics.invoiceProcessing, processInvoice);
    return consumer;
};
exports.initInvoiceProcessingConsumer = initInvoiceProcessingConsumer;
