"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeMongoDB = exports.getAllEvents = exports.getEventsByTopic = exports.getEventsBySource = exports.saveEvent = exports.initMongoDB = void 0;
const mongodb_1 = require("mongodb");
const config_1 = __importDefault(require("../config"));
let client = null;
let eventsCollection = null;
const initMongoDB = async () => {
    if (!client) {
        const uri = config_1.default.mongodb.uri; // 👈 forzamos el tipo
        client = new mongodb_1.MongoClient(uri);
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db();
        eventsCollection = db.collection("events"); // 👈 no usamos <Event>
        await eventsCollection.createIndex({ timestamp: 1 });
        await eventsCollection.createIndex({ source: 1 });
        await eventsCollection.createIndex({ topic: 1 });
        await eventsCollection.createIndex({ eventId: 1 }, { unique: true });
        console.log("MongoDB indexes created");
    }
};
exports.initMongoDB = initMongoDB;
const saveEvent = async (event) => {
    if (!eventsCollection) {
        await (0, exports.initMongoDB)();
    }
    await eventsCollection.insertOne(event);
    console.log(`Event saved to MongoDB: ${event.eventId}`);
};
exports.saveEvent = saveEvent;
const getEventsBySource = async (source) => {
    if (!eventsCollection) {
        await (0, exports.initMongoDB)();
    }
    return eventsCollection.find({ source }).sort({ timestamp: 1 }).toArray();
};
exports.getEventsBySource = getEventsBySource;
const getEventsByTopic = async (topic) => {
    if (!eventsCollection) {
        await (0, exports.initMongoDB)();
    }
    return eventsCollection.find({ topic }).sort({ timestamp: 1 }).toArray();
};
exports.getEventsByTopic = getEventsByTopic;
const getAllEvents = async () => {
    if (!eventsCollection) {
        await (0, exports.initMongoDB)();
    }
    return eventsCollection.find({}).sort({ timestamp: 1 }).toArray();
};
exports.getAllEvents = getAllEvents;
const closeMongoDB = async () => {
    if (client) {
        await client.close();
        client = null;
        eventsCollection = null;
        console.log("MongoDB connection closed");
    }
};
exports.closeMongoDB = closeMongoDB;
