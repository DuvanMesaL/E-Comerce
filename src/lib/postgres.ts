import { Pool } from "pg"
import config from "../config"

// Create a PostgreSQL connection pool
const pool = new Pool({
  host: config.postgres.host,
  port: config.postgres.port,
  user: config.postgres.user,
  password: config.postgres.password,
  database: config.postgres.database,
})

// Test the database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect()
    console.log("PostgreSQL connection successful")
    client.release()
    return true
  } catch (error) {
    console.error("PostgreSQL connection error:", error)
    return false
  }
}

// Execute a query
export const query = async (text: string, params: any[] = []): Promise<any> => {
  try {
    const result = await pool.query(text, params)
    return result
  } catch (error) {
    console.error("Query error:", error)
    throw error
  }
}

// Execute a transaction
export const transaction = async (callback: (client: any) => Promise<any>): Promise<any> => {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")
    const result = await callback(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

// Close the pool
export const closePool = async (): Promise<void> => {
  await pool.end()
  console.log("PostgreSQL connection pool closed")
}

export default {
  query,
  transaction,
  testConnection,
  closePool,
}

