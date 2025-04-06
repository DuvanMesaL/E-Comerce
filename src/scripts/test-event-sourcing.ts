import { initMongoDB, closeMongoDB, getAllEvents } from "../lib/event-store"
import { initProducer, publishEvent, disconnectKafka } from "../lib/kafka"
import config from "../config"

// Test event sourcing
const testEventSourcing = async () => {
  try {
    console.log("Starting event sourcing test...")

    // Initialize connections
    await initMongoDB()
    await initProducer()

    // Publish test events
    console.log("Publishing test events...")

    // User registration event
    await publishEvent(
      config.topics.userRegistration,
      "TestService",
      {
        name: "Test User",
        email: "test@example.com",
      },
      {
        userId: "test_user_123",
        status: "REGISTERED",
      },
    )

    // Welcome flow event
    await publishEvent(
      config.topics.welcomeFlow,
      "TestService",
      {
        name: "Test User",
        email: "test@example.com",
      },
      {
        userId: "test_user_123",
        status: "WELCOME_FLOW_INITIATED",
      },
    )

    // Notification event
    await publishEvent(
      config.topics.notification,
      "TestService",
      {
        to: "test@example.com",
        subject: "Test Notification",
        content: "This is a test notification",
      },
      {
        userId: "test_user_123",
        status: "NOTIFICATION_SENT",
      },
    )

    // Cart update event
    await publishEvent(
      config.topics.cartUpdates,
      "TestService",
      {
        userId: "test_user_123",
        productId: "test_product_456",
        quantity: 2,
      },
      {
        cartId: "test_cart_789",
        totalItems: 2,
        updatedAt: new Date().toISOString(),
      },
    )

    // Cart removal event
    await publishEvent(
      config.topics.cartRemovals,
      "TestService",
      {
        userId: "test_user_123",
        productId: "test_product_456",
        userEmail: "test@example.com",
        productName: "Test Product",
      },
      {
        removedProduct: {
          id: "test_product_456",
          name: "Test Product",
          price: 99.99,
        },
      },
    )

    // Order created event
    await publishEvent(
      config.topics.orderCreated,
      "TestService",
      {
        orderId: "test_order_123",
        userId: "test_user_123",
        totalAmount: 99.99,
      },
      {
        orderId: "test_order_123",
        status: "CREATED",
        items: 1,
      },
    )

    // Invoice processing event
    await publishEvent(
      config.topics.invoiceProcessing,
      "TestService",
      {
        orderId: "test_order_123",
        userId: "test_user_123",
        userEmail: "test@example.com",
      },
      {
        orderId: "test_order_123",
        status: "INVOICE_REQUESTED",
      },
    )

    // Get all events
    const events = await getAllEvents()
    console.log(`Total events stored: ${events.length}`)

    console.log("Event sourcing test completed successfully!")
  } catch (error) {
    console.error("Error in event sourcing test:", error)
  } finally {
    // Close connections
    await disconnectKafka()
    await closeMongoDB()
    process.exit(0)
  }
}

// Run test
testEventSourcing()

