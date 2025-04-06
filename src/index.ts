import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import swaggerUi from "swagger-ui-express"
import swaggerJsdoc from "swagger-jsdoc"
import config from "./config"
import { initMongoDB } from "./lib/event-store"
import { initProducer } from "./lib/kafka"
import { verifyEmailConfig } from "./lib/email"
import { testConnection as testPostgresConnection } from "./lib/postgres"
import { runMigrations } from "./migrations"
import { initWelcomeFlowConsumer } from "./consumers/welcome-flow.consumer"
import { initNotificationConsumer } from "./consumers/notification.consumer"
import { initCartRemovalConsumer } from "./consumers/cart-removal.consumer"
import { initInvoiceProcessingConsumer } from "./consumers/invoice-processing.consumer"

// Import routes
import userRoutes from "./routes/user.routes"
import productRoutes from "./routes/product.routes"
import cartRoutes from "./routes/cart.routes"
import orderRoutes from "./routes/order.routes"
import eventsRoutes from "./routes/events.routes"
// Import the health routes
import healthRoutes from "./routes/health.routes"

// Initialize Express app
const app = express()

// Middleware
app.use(cors())
app.use(helmet())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
        url: `http://localhost:${config.port}`,
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
}

const swaggerDocs = swaggerJsdoc(swaggerOptions)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// Routes
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/events", eventsRoutes)
// Add this with the other routes
app.use("/api/health", healthRoutes)

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" })
})

// Initialize services
const initServices = async () => {
  try {
    // Test PostgreSQL connection
    const postgresConnected = await testPostgresConnection()
    if (!postgresConnected) {
      throw new Error("Failed to connect to PostgreSQL")
    }

    // Run database migrations
    await runMigrations()
    console.log("Database migrations completed")

    // Initialize MongoDB for event store
    await initMongoDB()
    console.log("MongoDB initialized for event store")

    // Initialize Kafka producer
    await initProducer()

    // Verify email configuration
    await verifyEmailConfig()

    // Initialize Kafka consumers
    await initWelcomeFlowConsumer()
    await initNotificationConsumer()
    await initCartRemovalConsumer()
    await initInvoiceProcessingConsumer()

    console.log("All services initialized successfully")
  } catch (error) {
    console.error("Error initializing services:", error)
    process.exit(1)
  }
}

// Start server
const startServer = async () => {
  try {
    await initServices()

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`)
      console.log(`API documentation available at http://localhost:${config.port}/api-docs`)
    })
  } catch (error) {
    console.error("Error starting server:", error)
    process.exit(1)
  }
}

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error)
  process.exit(1)
})

// Start the server
startServer()

