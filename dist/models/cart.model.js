"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeItemFromCart = exports.addItemToCart = exports.getCartByUserId = exports.CartItemSchema = void 0;
const postgres_1 = require("../lib/postgres");
const zod_1 = require("zod");
// Cart item schema validation with Zod
exports.CartItemSchema = zod_1.z.object({
    productId: zod_1.z.string(),
    quantity: zod_1.z.number().int().positive(),
    price: zod_1.z.number().positive(),
    name: zod_1.z.string().optional(),
});
// Get cart by user ID
const getCartByUserId = async (userId) => {
    // First, check if the cart exists
    const cartResult = await (0, postgres_1.query)(`SELECT id, user_id, total_items, total_amount, updated_at
     FROM carts
     WHERE user_id = $1`, [userId]);
    if (cartResult.rows.length === 0) {
        return null;
    }
    const cart = cartResult.rows[0];
    // Get cart items
    const itemsResult = await (0, postgres_1.query)(`SELECT ci.id, ci.product_id, ci.quantity, ci.price, p.name
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.cart_id = $1`, [cart.id]);
    const items = itemsResult.rows.map((item) => ({
        productId: item.product_id.toString(),
        quantity: item.quantity,
        price: Number.parseFloat(item.price),
        name: item.name,
    }));
    return {
        id: cart.id.toString(),
        userId: cart.user_id.toString(),
        items,
        totalItems: cart.total_items,
        totalAmount: Number.parseFloat(cart.total_amount),
        updatedAt: cart.updated_at,
    };
};
exports.getCartByUserId = getCartByUserId;
// Add item to cart
const addItemToCart = async (userId, item) => {
    return (0, postgres_1.transaction)(async (client) => {
        // Check if cart exists
        const cartResult = await client.query(`SELECT id FROM carts WHERE user_id = $1`, [userId]);
        let cartId;
        if (cartResult.rows.length === 0) {
            // Create new cart
            const newCartResult = await client.query(`INSERT INTO carts (user_id, total_items, total_amount)
         VALUES ($1, 0, 0)
         RETURNING id`, [userId]);
            cartId = newCartResult.rows[0].id;
        }
        else {
            cartId = cartResult.rows[0].id;
        }
        // Check if item already exists in cart
        const itemResult = await client.query(`SELECT id, quantity FROM cart_items
       WHERE cart_id = $1 AND product_id = $2`, [cartId, item.productId]);
        if (itemResult.rows.length > 0) {
            // Update existing item
            await client.query(`UPDATE cart_items
         SET quantity = quantity + $1, updated_at = NOW()
         WHERE id = $2`, [item.quantity, itemResult.rows[0].id]);
        }
        else {
            // Add new item
            await client.query(`INSERT INTO cart_items (cart_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`, [cartId, item.productId, item.quantity, item.price]);
        }
        // Update cart totals
        const updatedCartResult = await client.query(`UPDATE carts c
       SET total_items = (
         SELECT COALESCE(SUM(quantity), 0)
         FROM cart_items
         WHERE cart_id = c.id
       ),
       total_amount = (
         SELECT COALESCE(SUM(quantity * price), 0)
         FROM cart_items
         WHERE cart_id = c.id
       ),
       updated_at = NOW()
       WHERE id = $1
       RETURNING id, user_id, total_items, total_amount, updated_at`, [cartId]);
        const updatedCart = updatedCartResult.rows[0];
        // Get updated cart items
        const updatedItemsResult = await client.query(`SELECT ci.product_id, ci.quantity, ci.price, p.name
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1`, [cartId]);
        const items = updatedItemsResult.rows.map((item) => ({
            productId: item.product_id.toString(),
            quantity: item.quantity,
            price: Number.parseFloat(item.price),
            name: item.name,
        }));
        return {
            id: updatedCart.id.toString(),
            userId: updatedCart.user_id.toString(),
            items,
            totalItems: updatedCart.total_items,
            totalAmount: Number.parseFloat(updatedCart.total_amount),
            updatedAt: updatedCart.updated_at,
        };
    });
};
exports.addItemToCart = addItemToCart;
// Remove item from cart
const removeItemFromCart = async (userId, productId) => {
    return (0, postgres_1.transaction)(async (client) => {
        // Get cart ID
        const cartResult = await client.query(`SELECT id FROM carts WHERE user_id = $1`, [userId]);
        if (cartResult.rows.length === 0) {
            return null;
        }
        const cartId = cartResult.rows[0].id;
        // Remove item from cart
        await client.query(`DELETE FROM cart_items
       WHERE cart_id = $1 AND product_id = $2`, [cartId, productId]);
        // Update cart totals
        const updatedCartResult = await client.query(`UPDATE carts c
       SET total_items = (
         SELECT COALESCE(SUM(quantity), 0)
         FROM cart_items
         WHERE cart_id = c.id
       ),
       total_amount = (
         SELECT COALESCE(SUM(quantity * price), 0)
         FROM cart_items
         WHERE cart_id = c.id
       ),
       updated_at = NOW()
       WHERE id = $1
       RETURNING id, user_id, total_items, total_amount, updated_at`, [cartId]);
        const updatedCart = updatedCartResult.rows[0];
        // Get updated cart items
        const updatedItemsResult = await client.query(`SELECT ci.product_id, ci.quantity, ci.price, p.name
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = $1`, [cartId]);
        const items = updatedItemsResult.rows.map((item) => ({
            productId: item.product_id.toString(),
            quantity: item.quantity,
            price: Number.parseFloat(item.price),
            name: item.name,
        }));
        return {
            id: updatedCart.id.toString(),
            userId: updatedCart.user_id.toString(),
            items,
            totalItems: updatedCart.total_items,
            totalAmount: Number.parseFloat(updatedCart.total_amount),
            updatedAt: updatedCart.updated_at,
        };
    });
};
exports.removeItemFromCart = removeItemFromCart;
// Clear cart
const clearCart = async (userId) => {
    try {
        const result = await (0, postgres_1.query)(`DELETE FROM carts WHERE user_id = $1 RETURNING id`, [userId]);
        return result.rows.length > 0;
    }
    catch (error) {
        console.error("Error clearing cart:", error);
        return false;
    }
};
exports.clearCart = clearCart;
