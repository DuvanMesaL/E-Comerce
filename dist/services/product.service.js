"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStock = exports.getProduct = exports.getProducts = exports.createNewProduct = exports.ProductCreationSchema = void 0;
const zod_1 = require("zod");
const product_model_1 = require("../models/product.model");
const kafka_1 = require("../lib/kafka");
// Product creation input schema
exports.ProductCreationSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    description: zod_1.z.string().min(10).max(1000),
    price: zod_1.z.number().positive(),
    category: zod_1.z.string().min(2).max(50),
    stock: zod_1.z.number().int().nonnegative().default(0),
});
// Create a new product
const createNewProduct = async (productData) => {
    // Validate product data
    const validatedData = exports.ProductCreationSchema.parse(productData);
    // Create product
    const product = await (0, product_model_1.createProduct)(validatedData);
    // Publish product created event
    await (0, kafka_1.publishEvent)("product-created", // Not in the main topics list, but useful for tracking
    "ProductService", {
        productId: product.id,
        name: product.name,
        price: product.price,
    }, {
        productId: product.id,
        status: "CREATED",
    });
    return product;
};
exports.createNewProduct = createNewProduct;
// Get all products
const getProducts = async () => {
    return (0, product_model_1.getAllProducts)();
};
exports.getProducts = getProducts;
// Get product by ID
const getProduct = async (id) => {
    return (0, product_model_1.getProductById)(id);
};
exports.getProduct = getProduct;
// Update product stock
const updateStock = async (id, quantity) => {
    return (0, product_model_1.updateProductStock)(id, quantity);
};
exports.updateStock = updateStock;
