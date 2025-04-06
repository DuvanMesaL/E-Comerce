import { query } from "../lib/postgres"
import fs from "fs"
import path from "path"

// Create migrations table if it doesn't exist
const createMigrationsTable = async (): Promise<void> => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      applied_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `

  await query(createTableQuery)
  console.log("Migrations table created or already exists")
}

// Get applied migrations
const getAppliedMigrations = async (): Promise<string[]> => {
  const result = await query("SELECT name FROM migrations ORDER BY id ASC")
  return result.rows.map((row: any) => row.name)
}

// Apply a migration
const applyMigration = async (migrationName: string, migrationSql: string): Promise<void> => {
  try {
    // Start a transaction
    await query("BEGIN")

    // Execute the migration
    await query(migrationSql)

    // Record the migration
    await query("INSERT INTO migrations (name) VALUES ($1)", [migrationName])

    // Commit the transaction
    await query("COMMIT")

    console.log(`Migration applied: ${migrationName}`)
  } catch (error) {
    // Rollback the transaction
    await query("ROLLBACK")
    console.error(`Error applying migration ${migrationName}:`, error)
    throw error
  }
}

// Run migrations
export const runMigrations = async (): Promise<void> => {
  try {
    // Create migrations table if it doesn't exist
    await createMigrationsTable()

    // Get applied migrations
    const appliedMigrations = await getAppliedMigrations()

    // Get migration files
    const migrationsDir = path.join(__dirname, "sql")
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort() // Sort to ensure migrations are applied in order

    // Apply pending migrations
    for (const file of migrationFiles) {
      if (!appliedMigrations.includes(file)) {
        const migrationPath = path.join(migrationsDir, file)
        const migrationSql = fs.readFileSync(migrationPath, "utf8")

        await applyMigration(file, migrationSql)
      }
    }

    console.log("All migrations applied successfully")
  } catch (error) {
    console.error("Error running migrations:", error)
    throw error
  }
}

