import * as dotenv from "dotenv"

dotenv.config()

export default {
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
}

