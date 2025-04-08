"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getOrdersByUserId = exports.getOrderById = exports.createOrder = exports.OrderStatus = void 0;
const postgres_1 = require("../lib/postgres");
// Order status enum
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["CREATED"] = "CREATED";
    OrderStatus["PROCESSING"] = "PROCESSING";
    OrderStatus["COMPLETED"] = "COMPLETED";
    OrderStatus["CANCELLED"] = "CANCELLED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
// Create a new order
const createOrder = async (userId, items) => {
    return (0, postgres_1.transaction)(async (client) => {
        // Calculate totals
        const totalItems = items.reduce((total, item) => total + item.quantity, 0);
        const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);
        // Create order
        const orderResult = await client.query(`INSERT INTO orders (user_id, total_items, total_amount, status)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, total_items, total_amount, status, created_at, updated_at`, [userId, totalItems, totalAmount, OrderStatus.CREATED]);
        const order = orderResult.rows[0];
        // Add order items
        for (const item of items) {
            await client.query(`INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`, [order.id, item.productId, item.quantity, item.price]);
        }
        return {
            id: order.id.toString(),
            userId: order.user_id.toString(),
            items,
            totalItems: order.total_items,
            totalAmount: Number.parseFloat(order.total_amount),
            status: order.status,
            createdAt: order.created_at,
            updatedAt: order.updated_at,
        };
    });
};
exports.createOrder = createOrder;
// Get order by ID
const getOrderById = async (id) => {
    try {
        // Get order
        const orderResult = await (0, postgres_1.query)(`SELECT id, user_id, total_items, total_amount, status, created_at, updated_at
       FROM orders
       WHERE id = $1`, [id]);
        if (orderResult.rows.length === 0) {
            return null;
        }
        const order = orderResult.rows[0];
        // Get order items
        const itemsResult = await (0, postgres_1.query)(`SELECT oi.product_id, oi.quantity, oi.price, p.name
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`, [id]);
        const items = itemsResult.rows.map((item) => ({
            productId: item.product_id.toString(),
            quantity: item.quantity,
            price: Number.parseFloat(item.price),
            name: item.name,
        }));
        return {
            id: order.id.toString(),
            userId: order.user_id.toString(),
            items,
            totalItems: order.total_items,
            totalAmount: Number.parseFloat(order.total_amount),
            status: order.status,
            createdAt: order.created_at,
            updatedAt: order.updated_at,
        };
    }
    catch (error) {
        console.error("Error getting order by ID:", error);
        return null;
    }
};
exports.getOrderById = getOrderById;
// Get orders by user ID
const getOrdersByUserId = async (userId) => {
    try {
        // Get orders
        const ordersResult = await (0, postgres_1.query)(`SELECT id, user_id, total_items, total_amount, status, created_at, updated_at
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`, [userId]);
        const orders = [];
        for (const orderRow of ordersResult.rows) {
            // Get order items
            const itemsResult = await (0, postgres_1.query)(`SELECT oi.product_id, oi.quantity, oi.price, p.name
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = $1`, [orderRow.id]);
            const items = itemsResult.rows.map((item) => ({
                productId: item.product_id.toString(),
                quantity: item.quantity,
                price: Number.parseFloat(item.price),
                name: item.name,
            }));
            orders.push({
                id: orderRow.id.toString(),
                userId: orderRow.user_id.toString(),
                items,
                totalItems: orderRow.total_items,
                totalAmount: Number.parseFloat(orderRow.total_amount),
                status: orderRow.status,
                createdAt: orderRow.created_at,
                updatedAt: orderRow.updated_at,
            });
        }
        return orders;
    }
    catch (error) {
        console.error("Error getting orders by user ID:", error);
        return [];
    }
};
exports.getOrdersByUserId = getOrdersByUserId;
// Update order status
const updateOrderStatus = async (id, status) => {
    try {
        const result = await (0, postgres_1.query)(`UPDATE orders
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id`, [status, id]);
        return result.rows.length > 0;
    }
    catch (error) {
        console.error("Error updating order status:", error);
        return false;
    }
};
exports.updateOrderStatus = updateOrderStatus;
