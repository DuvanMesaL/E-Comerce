"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
dotenv.config();
exports.default = {
    port: process.env.PORT || 3000,
    mongodb: {
        uri: process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce",
    },
    postgres: {
        host: process.env.POSTGRES_HOST || "localhost",
        port: Number.parseInt(process.env.POSTGRES_PORT || "5432", 10),
        user: process.env.POSTGRES_USER || "postgres",
        password: process.env.POSTGRES_PASSWORD || "postgres",
        database: process.env.POSTGRES_DB || "ecommerce",
    },
    kafka: {
        clientId: "ecommerce-service",
        brokers: ((_a = process.env.KAFKA_BROKERS) === null || _a === void 0 ? void 0 : _a.split(",")) || ["localhost:9092"],
    },
    email: {
        host: process.env.EMAIL_HOST || "smtp.ethereal.email",
        port: Number.parseInt(process.env.EMAIL_PORT || "587", 10),
        auth: {
            user: process.env.EMAIL_USER || "",
            pass: process.env.EMAIL_PASS || "",
        },
    },
    topics: {
        userRegistration: "user-registration",
        welcomeFlow: "welcome-flow",
        notification: "notification-topic",
        cartUpdates: "cart-updates",
        cartRemovals: "cart-removals",
        orderCreated: "order-created",
        invoiceProcessing: "invoice-processing",
    },
};
