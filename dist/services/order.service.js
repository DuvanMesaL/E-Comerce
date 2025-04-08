"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserOrders = exports.getOrder = exports.createNewOrder = exports.OrderCreationSchema = void 0;
const zod_1 = require("zod");
const order_model_1 = require("../models/order.model");
const cart_service_1 = require("./cart.service");
const product_service_1 = require("./product.service");
const kafka_1 = require("../lib/kafka");
const config_1 = __importDefault(require("../config"));
// Order creation input schema
exports.OrderCreationSchema = zod_1.z.object({
    userId: zod_1.z.string(),
});
// Create a new order
const createNewOrder = async (orderData, userEmail) => {
    // Validate input
    const validatedData = exports.OrderCreationSchema.parse(orderData);
    // Get user's cart
    const cart = await (0, cart_service_1.getUserCart)(validatedData.userId);
    if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
    }
    // Create order
    const order = await (0, order_model_1.createOrder)(validatedData.userId, cart.items);
    // Update product stock
    for (const item of cart.items) {
        await (0, product_service_1.updateStock)(item.productId, item.quantity);
    }
    // Clear cart
    await (0, cart_service_1.emptyCart)(validatedData.userId);
    // Publish order created event
    await (0, kafka_1.publishEvent)(config_1.default.topics.orderCreated, "OrderService", {
        orderId: order.id,
        userId: order.userId,
        totalAmount: order.totalAmount,
    }, {
        orderId: order.id,
        status: "CREATED",
        items: order.items.length,
    });
    // Publish invoice processing event
    await (0, kafka_1.publishEvent)(config_1.default.topics.invoiceProcessing, "OrderService", {
        orderId: order.id,
        userId: order.userId,
        userEmail,
    }, {
        orderId: order.id,
        status: "INVOICE_REQUESTED",
    });
    return order;
};
exports.createNewOrder = createNewOrder;
// Get order by ID
const getOrder = async (id) => {
    return (0, order_model_1.getOrderById)(id);
};
exports.getOrder = getOrder;
// Get user's orders
const getUserOrders = async (userId) => {
    return (0, order_model_1.getOrdersByUserId)(userId);
};
exports.getUserOrders = getUserOrders;
