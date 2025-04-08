"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_service_1 = require("../services/product.service");
const router = express_1.default.Router();
// Create a new product
router.post("/", async (req, res) => {
    try {
        const productData = req.body;
        const product = await (0, product_service_1.createNewProduct)(productData);
        res.status(201).json({
            success: true,
            data: product,
        });
    }
    catch (error) {
        console.error("Error creating product:", error);
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
// Get all products
router.get("/", async (_req, res) => {
    try {
        const products = await (0, product_service_1.getProducts)();
        res.status(200).json({
            success: true,
            data: products,
        });
    }
    catch (error) {
        console.error("Error getting products:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
});
// Get product by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await (0, product_service_1.getProduct)(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: "Product not found",
            });
        }
        res.status(200).json({
            success: true,
            data: product,
        });
    }
    catch (error) {
        console.error("Error getting product:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
});
exports.default = router;
