import { runMigrations } from "../index"
import { query } from "../../lib/postgres"
import fs from "fs"
import path from "path"

// Mock PostgreSQL and fs
jest.mock("../../lib/postgres")
jest.mock("fs")
jest.mock("path")

describe("Database Migrations", () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock fs.readdirSync to return migration files
    ;(fs.readdirSync as jest.Mock).mockReturnValue(["001_create_users_table.sql", "002_create_products_table.sql"])

    // Mock fs.readFileSync to return SQL content
    ;(fs.readFileSync as jest.Mock).mockReturnValue("CREATE TABLE test_table (id SERIAL PRIMARY KEY);")

    // Mock path.join to return a path
    ;(path.join as jest.Mock).mockReturnValue("/path/to/migrations")

    // Mock query responses
    ;(query as jest.Mock).mockImplementation((sql, params) => {
      if (sql.includes("CREATE TABLE IF NOT EXISTS migrations")) {
        return Promise.resolve({ rows: [] })
      }

      if (sql === "SELECT name FROM migrations ORDER BY id ASC") {
        return Promise.resolve({ rows: [] }) // No migrations applied yet
      }

      if (sql === "BEGIN") {
        return Promise.resolve({ rows: [] })
      }

      if (sql === "COMMIT") {
        return Promise.resolve({ rows: [] })
      }

      if (sql === "ROLLBACK") {
        return Promise.resolve({ rows: [] })
      }

      if (sql.includes("INSERT INTO migrations")) {
        return Promise.resolve({ rows: [{ id: 1, name: params[0] }] })
      }

      return Promise.resolve({ rows: [] })
    })
  })

  it("should run migrations successfully", async () => {
    await runMigrations()

    // Check if migrations table was created
    expect(query).toHaveBeenCalledWith(expect.stringContaining("CREATE TABLE IF NOT EXISTS migrations"))

    // Check if applied migrations were queried
    expect(query).toHaveBeenCalledWith("SELECT name FROM migrations ORDER BY id ASC")

    // Check if each migration was applied
    expect(query).toHaveBeenCalledWith("BEGIN")
    expect(query).toHaveBeenCalledWith("CREATE TABLE test_table (id SERIAL PRIMARY KEY);")
    expect(query).toHaveBeenCalledWith("INSERT INTO migrations (name) VALUES ($1)", ["001_create_users_table.sql"])
    expect(query).toHaveBeenCalledWith("COMMIT")

    // Should be called twice for two migrations
    expect(query).toHaveBeenCalledTimes(10)
  })

  it("should skip already applied migrations", async () => {
    // Mock that one migration is already applied
    ;(query as jest.Mock).mockImplementation((sql) => {
      if (sql === "SELECT name FROM migrations ORDER BY id ASC") {
        return Promise.resolve({ rows: [{ name: "001_create_users_table.sql" }] })
      }

      return Promise.resolve({ rows: [] })
    })

    await runMigrations()

    // Should only apply the second migration
    expect(query).toHaveBeenCalledWith("BEGIN")
    expect(query).toHaveBeenCalledWith("CREATE TABLE test_table (id SERIAL PRIMARY KEY);")
    expect(query).toHaveBeenCalledWith("INSERT INTO migrations (name) VALUES ($1)", ["002_create_products_table.sql"])
    expect(query).toHaveBeenCalledWith("COMMIT")
  })

  it("should rollback transaction if migration fails", async () => {
    // Mock a migration failure
    ;(query as jest.Mock).mockImplementation((sql) => {
      if (sql === "CREATE TABLE test_table (id SERIAL PRIMARY KEY);") {
        return Promise.reject(new Error("Migration failed"))
      }

      return Promise.resolve({ rows: [] })
    })

    await expect(runMigrations()).rejects.toThrow("Migration failed")

    expect(query).toHaveBeenCalledWith("ROLLBACK")
  })
})

