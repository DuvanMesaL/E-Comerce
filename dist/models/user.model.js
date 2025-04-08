"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserCredentials = exports.findUserByEmail = exports.createUser = exports.UserSchema = void 0;
const postgres_1 = require("../lib/postgres");
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
// User schema validation with Zod
exports.UserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(50),
    lastName: zod_1.z.string().min(2).max(50),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    phone: zod_1.z.string().optional(),
});
// Create a new user
const createUser = async (userData) => {
    // Validate user data
    const validatedData = exports.UserSchema.parse(userData);
    // Hash password
    const hashedPassword = await bcrypt_1.default.hash(validatedData.password, 10);
    // Insert user with hashed password
    const result = await (0, postgres_1.query)(`INSERT INTO users (name, last_name, email, password, phone)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, last_name, email, phone, created_at, updated_at`, [validatedData.name, validatedData.lastName, validatedData.email, hashedPassword, validatedData.phone || null]);
    const user = result.rows[0];
    // Return user without password
    return {
        id: user.id.toString(),
        name: user.name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
    };
};
exports.createUser = createUser;
// Find user by email
const findUserByEmail = async (email) => {
    const result = await (0, postgres_1.query)(`SELECT id, name, last_name, email, phone, created_at, updated_at
     FROM users
     WHERE email = $1`, [email]);
    if (result.rows.length === 0) {
        return null;
    }
    const user = result.rows[0];
    return {
        id: user.id.toString(),
        name: user.name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
    };
};
exports.findUserByEmail = findUserByEmail;
// Verify user credentials
const verifyUserCredentials = async (email, password) => {
    const result = await (0, postgres_1.query)(`SELECT id, name, last_name, email, phone, password
     FROM users
     WHERE email = $1`, [email]);
    if (result.rows.length === 0) {
        return null;
    }
    const user = result.rows[0];
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        return null;
    }
    // Return user without password
    return {
        id: user.id.toString(),
        name: user.name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
    };
};
exports.verifyUserCredentials = verifyUserCredentials;
