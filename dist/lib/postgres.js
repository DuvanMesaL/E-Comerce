"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closePool = exports.transaction = exports.query = exports.testConnection = void 0;
const pg_1 = require("pg");
const config_1 = __importDefault(require("../config"));
// Create a PostgreSQL connection pool
const pool = new pg_1.Pool({
    host: config_1.default.postgres.host,
    port: config_1.default.postgres.port,
    user: config_1.default.postgres.user,
    password: config_1.default.postgres.password,
    database: config_1.default.postgres.database,
});
// Test the database connection
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log("PostgreSQL connection successful");
        client.release();
        return true;
    }
    catch (error) {
        console.error("PostgreSQL connection error:", error);
        return false;
    }
};
exports.testConnection = testConnection;
// Execute a query
const query = async (text, params = []) => {
    try {
        const result = await pool.query(text, params);
        return result;
    }
    catch (error) {
        console.error("Query error:", error);
        throw error;
    }
};
exports.query = query;
// Execute a transaction
const transaction = async (callback) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const result = await callback(client);
        await client.query("COMMIT");
        return result;
    }
    catch (error) {
        await client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }
};
exports.transaction = transaction;
// Close the pool
const closePool = async () => {
    await pool.end();
    console.log("PostgreSQL connection pool closed");
};
exports.closePool = closePool;
exports.default = {
    query: exports.query,
    transaction: exports.transaction,
    testConnection: exports.testConnection,
    closePool: exports.closePool,
};
