"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_service_1 = require("../services/order.service");
const router = express_1.default.Router();
// Create a new order
router.post("/", async (req, res) => {
    try {
        const { userId, email } = req.body;
        const orderData = { userId };
        const order = await (0, order_service_1.createNewOrder)(orderData, email);
        res.status(201).json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        console.error("Error creating order:", error);
        if (error instanceof Error) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
        else {
            res.status(500).json({
                success: false,
                error: "Internal server error",
            });
        }
    }
});
// Get order by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const order = await (0, order_service_1.getOrder)(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                error: "Order not found",
            });
        }
        res.status(200).json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        console.error("Error getting order:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
});
// Get user's orders
router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await (0, order_service_1.getUserOrders)(userId);
        res.status(200).json({
            success: true,
            data: orders,
        });
    }
    catch (error) {
        console.error("Error getting user orders:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
});
exports.default = router;
