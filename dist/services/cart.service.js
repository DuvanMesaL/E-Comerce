"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptyCart = exports.getUserCart = exports.removeFromCart = exports.addToCart = exports.CartItemInputSchema = void 0;
const zod_1 = require("zod");
const cart_model_1 = require("../models/cart.model");
const product_model_1 = require("../models/product.model");
const kafka_1 = require("../lib/kafka");
const config_1 = __importDefault(require("../config"));
// Cart item input schema
exports.CartItemInputSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    productId: zod_1.z.string(),
    quantity: zod_1.z.number().int().positive(),
});
// Add item to cart
const addToCart = async (cartItemInput) => {
    // Validate input
    const validatedData = exports.CartItemInputSchema.parse(cartItemInput);
    // Get product details
    const product = await (0, product_model_1.getProductById)(validatedData.productId);
    if (!product) {
        throw new Error("Product not found");
    }
    // Check if product has enough stock
    if (product.stock < validatedData.quantity) {
        throw new Error("Not enough stock available");
    }
    // Add item to cart
    const cart = await (0, cart_model_1.addItemToCart)(validatedData.userId, {
        productId: product.id,
        quantity: validatedData.quantity,
        price: product.price,
        name: product.name,
    });
    // Publish cart update event
    await (0, kafka_1.publishEvent)(config_1.default.topics.cartUpdates, "CartService", {
        userId: validatedData.userId,
        productId: product.id,
        quantity: validatedData.quantity,
    }, {
        cartId: cart.id,
        totalItems: cart.totalItems,
        updatedAt: cart.updatedAt,
    });
    return cart;
};
exports.addToCart = addToCart;
// Remove item from cart
const removeFromCart = async (userId, productId, userEmail) => {
    // Get product details for notification
    const product = await (0, product_model_1.getProductById)(productId);
    if (!product) {
        throw new Error("Product not found");
    }
    // Remove item from cart
    const cart = await (0, cart_model_1.removeItemFromCart)(userId, productId);
    if (!cart) {
        throw new Error("Cart not found");
    }
    // Publish cart removal event
    await (0, kafka_1.publishEvent)(config_1.default.topics.cartRemovals, "CartService", {
        userId,
        productId,
        userEmail,
        productName: product.name,
    }, {
        removedProduct: {
            id: product.id,
            name: product.name,
            price: product.price,
        },
    });
    return cart;
};
exports.removeFromCart = removeFromCart;
// Get user's cart
const getUserCart = async (userId) => {
    return (0, cart_model_1.getCartByUserId)(userId);
};
exports.getUserCart = getUserCart;
// Clear user's cart
const emptyCart = async (userId) => {
    return (0, cart_model_1.clearCart)(userId);
};
exports.emptyCart = emptyCart;
