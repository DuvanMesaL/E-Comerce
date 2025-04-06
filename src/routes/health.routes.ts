import express, { type Request, type Response } from "express"
import { testConnection as testPostgresConnection } from "../lib/postgres"
import { initMongoDB, closeMongoDB } from "../lib/event-store"
import config from "../config"

const router = express.Router()

router.get("/", async (_req: Request, res: Response) => {
  try {
    // Basic environment variables check
    const envCheck = {
      postgres: {
        host: config.postgres.host,
        port: config.postgres.port,
        database: config.postgres.database,
        user: config.postgres.user ? "✓ Set" : "✗ Missing",
        password: config.postgres.password ? "✓ Set" : "✗ Missing",
      },
      mongodb: {
        uri: config.mongodb.uri ? "✓ Set" : "✗ Missing",
      },
      kafka: {
        brokers: config.kafka.brokers,
      },
      email: {
        host: config.email.host,
        port: config.email.port,
        auth: {
          user: config.email.auth.user ? "✓ Set" : "✗ Missing",
          pass: config.email.auth.pass ? "✓ Set" : "✗ Missing",
        },
      },
    }

    // Test PostgreSQL connection
    let postgresStatus = "Not tested"
    try {
      const connected = await testPostgresConnection()
      postgresStatus = connected ? "Connected" : "Failed to connect"
    } catch (error) {
      postgresStatus = `Error: ${(error as Error).message}`
    }

    // Test MongoDB connection
    let mongoStatus = "Not tested"
    try {
      await initMongoDB()
      mongoStatus = "Connected"
      await closeMongoDB()
    } catch (error) {
      mongoStatus = `Error: ${(error as Error).message}`
    }

    res.status(200).json({
      status: "ok",
      environment: process.env.NODE_ENV || "development",
      port: config.port,
      connections: {
        postgres: postgresStatus,
        mongodb: mongoStatus,
      },
      config: envCheck,
    })
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: (error as Error).message,
    })
  }
})

export default router

