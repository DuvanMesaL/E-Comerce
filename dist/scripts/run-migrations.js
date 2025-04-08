"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const migrations_1 = require("../migrations");
const postgres_1 = require("../lib/postgres");
const runDatabaseMigrations = async () => {
    try {
        console.log("Testing PostgreSQL connection...");
        const connected = await (0, postgres_1.testConnection)();
        if (!connected) {
            throw new Error("Failed to connect to PostgreSQL");
        }
        console.log("Running database migrations...");
        await (0, migrations_1.runMigrations)();
        console.log("Database migrations completed successfully!");
    }
    catch (error) {
        console.error("Error running migrations:", error);
        process.exit(1);
    }
    finally {
        await (0, postgres_1.closePool)();
        process.exit(0);
    }
};
runDatabaseMigrations();
