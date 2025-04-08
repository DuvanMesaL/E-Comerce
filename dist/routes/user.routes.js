"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_service_1 = require("../services/user.service");
const router = express_1.default.Router();
// Register a new user
router.post("/register", async (req, res) => {
    try {
        const userData = req.body;
        const user = await (0, user_service_1.registerUser)(userData);
        res.status(201).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        console.error("Error registering user:", error);
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
// Login user
router.post("/login", async (req, res) => {
    try {
        const loginData = req.body;
        const user = await (0, user_service_1.loginUser)(loginData);
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        console.error("Error logging in user:", error);
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
exports.default = router;
