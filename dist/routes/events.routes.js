"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_store_1 = require("../lib/event-store");
const router = express_1.default.Router();
// Get all events
router.get("/", async (_req, res) => {
    try {
        const events = await (0, event_store_1.getAllEvents)();
        res.status(200).json({
            success: true,
            data: events,
        });
    }
    catch (error) {
        console.error("Error getting events:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
});
// Get events by source
router.get("/source/:source", async (req, res) => {
    try {
        const { source } = req.params;
        const events = await (0, event_store_1.getEventsBySource)(source);
        res.status(200).json({
            success: true,
            data: events,
        });
    }
    catch (error) {
        console.error("Error getting events by source:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
});
// Get events by topic
router.get("/topic/:topic", async (req, res) => {
    try {
        const { topic } = req.params;
        const events = await (0, event_store_1.getEventsByTopic)(topic);
        res.status(200).json({
            success: true,
            data: events,
        });
    }
    catch (error) {
        console.error("Error getting events by topic:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
});
exports.default = router;
