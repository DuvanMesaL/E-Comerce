"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = void 0;
const postgres_1 = require("../lib/postgres");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Create migrations table if it doesn't exist
const createMigrationsTable = async () => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      applied_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;
    await (0, postgres_1.query)(createTableQuery);
    console.log("Migrations table created or already exists");
};
// Get applied migrations
const getAppliedMigrations = async () => {
    const result = await (0, postgres_1.query)("SELECT name FROM migrations ORDER BY id ASC");
    return result.rows.map((row) => row.name);
};
// Apply a migration
const applyMigration = async (migrationName, migrationSql) => {
    try {
        // Start a transaction
        await (0, postgres_1.query)("BEGIN");
        // Execute the migration
        await (0, postgres_1.query)(migrationSql);
        // Record the migration
        await (0, postgres_1.query)("INSERT INTO migrations (name) VALUES ($1)", [migrationName]);
        // Commit the transaction
        await (0, postgres_1.query)("COMMIT");
        console.log(`Migration applied: ${migrationName}`);
    }
    catch (error) {
        // Rollback the transaction
        await (0, postgres_1.query)("ROLLBACK");
        console.error(`Error applying migration ${migrationName}:`, error);
        throw error;
    }
};
// Run migrations
const runMigrations = async () => {
    try {
        // Create migrations table if it doesn't exist
        await createMigrationsTable();
        // Get applied migrations
        const appliedMigrations = await getAppliedMigrations();
        // Get migration files
        const migrationsDir = path_1.default.join(__dirname, "sql");
        const migrationFiles = fs_1.default
            .readdirSync(migrationsDir)
            .filter((file) => file.endsWith(".sql"))
            .sort(); // Sort to ensure migrations are applied in order
        // Apply pending migrations
        for (const file of migrationFiles) {
            if (!appliedMigrations.includes(file)) {
                const migrationPath = path_1.default.join(migrationsDir, file);
                const migrationSql = fs_1.default.readFileSync(migrationPath, "utf8");
                await applyMigration(file, migrationSql);
            }
        }
        console.log("All migrations applied successfully");
    }
    catch (error) {
        console.error("Error running migrations:", error);
        throw error;
    }
};
exports.runMigrations = runMigrations;
