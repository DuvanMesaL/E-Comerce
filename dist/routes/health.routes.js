"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postgres_1 = require("../lib/postgres");
const event_store_1 = require("../lib/event-store");
const config_1 = __importDefault(require("../config"));
const router = express_1.default.Router();
router.get("/", async (_req, res) => {
    try {
        // Basic environment variables check
        const envCheck = {
            postgres: {
                host: config_1.default.postgres.host,
                port: config_1.default.postgres.port,
                database: config_1.default.postgres.database,
                user: config_1.default.postgres.user ? "✓ Set" : "✗ Missing",
                password: config_1.default.postgres.password ? "✓ Set" : "✗ Missing",
            },
            mongodb: {
                uri: config_1.default.mongodb.uri ? "✓ Set" : "✗ Missing",
            },
            kafka: {
                brokers: config_1.default.kafka.brokers,
            },
            email: {
                host: config_1.default.email.host,
                port: config_1.default.email.port,
                auth: {
                    user: config_1.default.email.auth.user ? "✓ Set" : "✗ Missing",
                    pass: config_1.default.email.auth.pass ? "✓ Set" : "✗ Missing",
                },
            },
        };
        // Test PostgreSQL connection
        let postgresStatus = "Not tested";
        try {
            const connected = await (0, postgres_1.testConnection)();
            postgresStatus = connected ? "Connected" : "Failed to connect";
        }
        catch (error) {
            postgresStatus = `Error: ${error.message}`;
        }
        // Test MongoDB connection
        let mongoStatus = "Not tested";
        try {
            await (0, event_store_1.initMongoDB)();
            mongoStatus = "Connected";
            await (0, event_store_1.closeMongoDB)();
        }
        catch (error) {
            mongoStatus = `Error: ${error.message}`;
        }
        res.status(200).json({
            status: "ok",
            environment: process.env.NODE_ENV || "development",
            port: config_1.default.port,
            connections: {
                postgres: postgresStatus,
                mongodb: mongoStatus,
            },
            config: envCheck,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
});
exports.default = router;
