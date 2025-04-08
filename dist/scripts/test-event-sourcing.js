"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const event_store_1 = require("../lib/event-store");
const kafka_1 = require("../lib/kafka");
const config_1 = __importDefault(require("../config"));
// Test event sourcing
const testEventSourcing = async () => {
    try {
        console.log("Starting event sourcing test...");
        // Initialize connections
        await (0, event_store_1.initMongoDB)();
        await (0, kafka_1.initProducer)();
        // Publish test events
        console.log("Publishing test events...");
        // User registration event
        await (0, kafka_1.publishEvent)(config_1.default.topics.userRegistration, "TestService", {
            name: "Test User",
            email: "test@example.com",
        }, {
            userId: "test_user_123",
            status: "REGISTERED",
        });
        // Welcome flow event
        await (0, kafka_1.publishEvent)(config_1.default.topics.welcomeFlow, "TestService", {
            name: "Test User",
            email: "test@example.com",
        }, {
            userId: "test_user_123",
            status: "WELCOME_FLOW_INITIATED",
        });
        // Notification event
        await (0, kafka_1.publishEvent)(config_1.default.topics.notification, "TestService", {
            to: "test@example.com",
            subject: "Test Notification",
            content: "This is a test notification",
        }, {
            userId: "test_user_123",
            status: "NOTIFICATION_SENT",
        });
        // Cart update event
        await (0, kafka_1.publishEvent)(config_1.default.topics.cartUpdates, "TestService", {
            userId: "test_user_123",
            productId: "test_product_456",
            quantity: 2,
        }, {
            cartId: "test_cart_789",
            totalItems: 2,
            updatedAt: new Date().toISOString(),
        });
        // Cart removal event
        await (0, kafka_1.publishEvent)(config_1.default.topics.cartRemovals, "TestService", {
            userId: "test_user_123",
            productId: "test_product_456",
            userEmail: "test@example.com",
            productName: "Test Product",
        }, {
            removedProduct: {
                id: "test_product_456",
                name: "Test Product",
                price: 99.99,
            },
        });
        // Order created event
        await (0, kafka_1.publishEvent)(config_1.default.topics.orderCreated, "TestService", {
            orderId: "test_order_123",
            userId: "test_user_123",
            totalAmount: 99.99,
        }, {
            orderId: "test_order_123",
            status: "CREATED",
            items: 1,
        });
        // Invoice processing event
        await (0, kafka_1.publishEvent)(config_1.default.topics.invoiceProcessing, "TestService", {
            orderId: "test_order_123",
            userId: "test_user_123",
            userEmail: "test@example.com",
        }, {
            orderId: "test_order_123",
            status: "INVOICE_REQUESTED",
        });
        // Get all events
        const events = await (0, event_store_1.getAllEvents)();
        console.log(`Total events stored: ${events.length}`);
        console.log("Event sourcing test completed successfully!");
    }
    catch (error) {
        console.error("Error in event sourcing test:", error);
    }
    finally {
        // Close connections
        await (0, kafka_1.disconnectKafka)();
        await (0, event_store_1.closeMongoDB)();
        process.exit(0);
    }
};
// Run test
testEventSourcing();
