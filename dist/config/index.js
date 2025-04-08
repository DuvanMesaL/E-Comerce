"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
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
        brokers: process.env.KAFKA_BROKERS?.split(",") || ["localhost:9092"],
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
