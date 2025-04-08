"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const config_1 = __importDefault(require("./config"));
const event_store_1 = require("./lib/event-store");
const kafka_1 = require("./lib/kafka");
const email_1 = require("./lib/email");
const postgres_1 = require("./lib/postgres");
const migrations_1 = require("./migrations");
const welcome_flow_consumer_1 = require("./consumers/welcome-flow.consumer");
const notification_consumer_1 = require("./consumers/notification.consumer");
const cart_removal_consumer_1 = require("./consumers/cart-removal.consumer");
const invoice_processing_consumer_1 = require("./consumers/invoice-processing.consumer");
// Import routes
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const events_routes_1 = __importDefault(require("./routes/events.routes"));
// Import the health routes
const health_routes_1 = __importDefault(require("./routes/health.routes"));
// Initialize Express app
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "E-Commerce API with Event-Driven Architecture",
            version: "1.0.0",
            description: "API documentation for E-Commerce with Kafka and Event Sourcing",
        },
        servers: [
            {
                url: `http://localhost:${config_1.default.port}`,
                description: "Development server",
            },
        ],
    },
    apis: ["./src/routes/*.ts"],
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
// Routes
app.use("/api/users", user_routes_1.default);
app.use("/api/products", product_routes_1.default);
app.use("/api/cart", cart_routes_1.default);
app.use("/api/orders", order_routes_1.default);
app.use("/api/events", events_routes_1.default);
// Add this with the other routes
app.use("/api/health", health_routes_1.default);
// Health check endpoint
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
});
// Initialize services
const initServices = async () => {
    try {
        // Test PostgreSQL connection
        const postgresConnected = await (0, postgres_1.testConnection)();
        if (!postgresConnected) {
            throw new Error("Failed to connect to PostgreSQL");
        }
        // Run database migrations
        await (0, migrations_1.runMigrations)();
        console.log("Database migrations completed");
        // Initialize MongoDB for event store
        await (0, event_store_1.initMongoDB)();
        console.log("MongoDB initialized for event store");
        // Initialize Kafka producer
        await (0, kafka_1.initProducer)();
        // Verify email configuration
        await (0, email_1.verifyEmailConfig)();
        // Initialize Kafka consumers
        await (0, welcome_flow_consumer_1.initWelcomeFlowConsumer)();
        await (0, notification_consumer_1.initNotificationConsumer)();
        await (0, cart_removal_consumer_1.initCartRemovalConsumer)();
        await (0, invoice_processing_consumer_1.initInvoiceProcessingConsumer)();
        console.log("All services initialized successfully");
    }
    catch (error) {
        console.error("Error initializing services:", error);
        process.exit(1);
    }
};
// Start server
const startServer = async () => {
    try {
        await initServices();
        app.listen(config_1.default.port, () => {
            console.log(`Server running on port ${config_1.default.port}`);
            console.log(`API documentation available at http://localhost:${config_1.default.port}/api-docs`);
        });
    }
    catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
};
// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
    console.error("Uncaught exception:", error);
    process.exit(1);
});
// Start the server
startServer();
