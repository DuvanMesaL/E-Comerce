"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductStock = exports.getProductById = exports.getAllProducts = exports.createProduct = exports.ProductSchema = void 0;
const postgres_1 = require("../lib/postgres");
const zod_1 = require("zod");
// Product schema validation with Zod
exports.ProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    description: zod_1.z.string().min(10).max(1000),
    price: zod_1.z.number().positive(),
    category: zod_1.z.string().min(2).max(50),
    stock: zod_1.z.number().int().nonnegative().default(0),
});
// Create a new product
const createProduct = async (productData) => {
    // Validate product data
    const validatedData = exports.ProductSchema.parse(productData);
    // Insert product
    const result = await (0, postgres_1.query)(`INSERT INTO products (name, description, price, category, stock)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, description, price, category, stock, created_at, updated_at`, [validatedData.name, validatedData.description, validatedData.price, validatedData.category, validatedData.stock]);
    const product = result.rows[0];
    return {
        id: product.id.toString(),
        name: product.name,
        description: product.description,
        price: Number.parseFloat(product.price),
        category: product.category,
        stock: product.stock,
    };
};
exports.createProduct = createProduct;
// Get all products
const getAllProducts = async () => {
    const result = await (0, postgres_1.query)(`SELECT id, name, description, price, category, stock
     FROM products
     ORDER BY name ASC`);
    return result.rows.map((product) => ({
        id: product.id.toString(),
        name: product.name,
        description: product.description,
        price: Number.parseFloat(product.price),
        category: product.category,
        stock: product.stock,
    }));
};
exports.getAllProducts = getAllProducts;
// Get product by ID
const getProductById = async (id) => {
    try {
        const result = await (0, postgres_1.query)(`SELECT id, name, description, price, category, stock
       FROM products
       WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            return null;
        }
        const product = result.rows[0];
        return {
            id: product.id.toString(),
            name: product.name,
            description: product.description,
            price: Number.parseFloat(product.price),
            category: product.category,
            stock: product.stock,
        };
    }
    catch (error) {
        console.error("Error getting product by ID:", error);
        return null;
    }
};
exports.getProductById = getProductById;
// Update product stock
const updateProductStock = async (id, quantity) => {
    try {
        const result = await (0, postgres_1.query)(`UPDATE products
       SET stock = stock - $1, updated_at = NOW()
       WHERE id = $2 AND stock >= $1
       RETURNING id`, [quantity, id]);
        return result.rows.length > 0;
    }
    catch (error) {
        console.error("Error updating product stock:", error);
        return false;
    }
};
exports.updateProductStock = updateProductStock;
