import { runMigrations } from "../migrations"
import { testConnection, closePool } from "../lib/postgres"

const runDatabaseMigrations = async () => {
  try {
    console.log("Testing PostgreSQL connection...")
    const connected = await testConnection()

    if (!connected) {
      throw new Error("Failed to connect to PostgreSQL")
    }

    console.log("Running database migrations...")
    await runMigrations()

    console.log("Database migrations completed successfully!")
  } catch (error) {
    console.error("Error running migrations:", error)
    process.exit(1)
  } finally {
    await closePool()
    process.exit(0)
  }
}

runDatabaseMigrations()

