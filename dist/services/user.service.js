"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmail = exports.loginUser = exports.registerUser = exports.UserLoginSchema = exports.UserRegistrationSchema = void 0;
const zod_1 = require("zod");
const user_model_1 = require("../models/user.model");
const kafka_1 = require("../lib/kafka");
const config_1 = __importDefault(require("../config"));
// User registration input schema
exports.UserRegistrationSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(50),
    lastName: zod_1.z.string().min(2).max(50),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    phone: zod_1.z.string().optional(),
});
// User login input schema
exports.UserLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
// Register a new user
const registerUser = async (userData) => {
    // Validate user data
    const validatedData = exports.UserRegistrationSchema.parse(userData);
    // Check if user already exists
    const existingUser = await (0, user_model_1.findUserByEmail)(validatedData.email);
    if (existingUser) {
        throw new Error("User with this email already exists");
    }
    // Create user
    const user = await (0, user_model_1.createUser)(validatedData);
    // Publish user registration event
    await (0, kafka_1.publishEvent)(config_1.default.topics.userRegistration, "UserService", {
        name: user.name,
        email: user.email,
    }, {
        userId: user.id,
        status: "REGISTERED",
    });
    // Publish welcome flow event
    await (0, kafka_1.publishEvent)(config_1.default.topics.welcomeFlow, "UserService", {
        name: user.name,
        email: user.email,
    }, {
        userId: user.id,
        status: "WELCOME_FLOW_INITIATED",
    });
    return user;
};
exports.registerUser = registerUser;
// Login user
const loginUser = async (loginData) => {
    // Validate login data
    const validatedData = exports.UserLoginSchema.parse(loginData);
    // Verify credentials
    const user = await (0, user_model_1.verifyUserCredentials)(validatedData.email, validatedData.password);
    if (!user) {
        throw new Error("Invalid email or password");
    }
    return user;
};
exports.loginUser = loginUser;
// Get user by email
const getUserByEmail = async (email) => {
    return (0, user_model_1.findUserByEmail)(email);
};
exports.getUserByEmail = getUserByEmail;
