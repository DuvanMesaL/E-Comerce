"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_service_1 = require("../services/cart.service");
const user_service_1 = require("../services/user.service");
const router = express_1.default.Router();
// Add item to cart
router.post("/items", async (req, res) => {
    try {
        const cartItemInput = req.body;
        const cart = await (0, cart_service_1.addToCart)(cartItemInput);
        res.status(200).json({
            success: true,
            data: cart,
        });
    }
    catch (error) {
        console.error("Error adding item to cart:", error);
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
// Remove item from cart
router.delete("/items/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        const { userId, email } = req.body;
        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "User ID is required",
            });
        }
        // Get user email if not provided
        let userEmail = email;
        if (!userEmail) {
            const user = await (0, user_service_1.getUserByEmail)(userEmail);
            if (user) {
                userEmail = user.email;
            }
            else {
                userEmail = "user@example.com"; // Fallback
            }
        }
        const cart = await (0, cart_service_1.removeFromCart)(userId, productId, userEmail);
        res.status(200).json({
            success: true,
            data: cart,
        });
    }
    catch (error) {
        console.error("Error removing item from cart:", error);
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
// Get user's cart
router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await (0, cart_service_1.getUserCart)(userId);
        if (!cart) {
            return res.status(404).json({
                success: false,
                error: "Cart not found",
            });
        }
        res.status(200).json({
            success: true,
            data: cart,
        });
    }
    catch (error) {
        console.error("Error getting cart:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
});
exports.default = router;
