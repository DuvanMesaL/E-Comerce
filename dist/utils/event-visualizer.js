"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportEventsAsJson = exports.generateEventVisualization = void 0;
const event_store_1 = require("../lib/event-store");
// Generate a visualization of events
const generateEventVisualization = async () => {
    const events = await (0, event_store_1.getAllEvents)();
    // Group events by topic
    const eventsByTopic = {};
    events.forEach((event) => {
        if (!eventsByTopic[event.topic]) {
            eventsByTopic[event.topic] = [];
        }
        eventsByTopic[event.topic].push(event);
    });
    // Generate visualization
    let visualization = "# Event Flow Visualization\n\n";
    // Add mermaid diagram
    visualization += "```mermaid\ngraph TD;\n";
    // Add nodes for each topic
    Object.keys(eventsByTopic).forEach((topic) => {
        visualization += `  ${topic}["${topic} (${eventsByTopic[topic].length} events)"]\n`;
    });
    // Add connections between topics based on source-topic relationships
    const connections = new Set();
    events.forEach((event) => {
        const source = event.source;
        const topic = event.topic;
        // Create a unique connection identifier
        const connection = `${source}->${topic}`;
        if (!connections.has(connection)) {
            connections.add(connection);
            visualization += `  ${source}["${source}"] --> ${topic}\n`;
        }
    });
    visualization += "```\n\n";
    // Add event details
    visualization += "## Event Details\n\n";
    Object.keys(eventsByTopic).forEach((topic) => {
        visualization += `### ${topic}\n\n`;
        eventsByTopic[topic].forEach((event) => {
            visualization += `#### Event ID: ${event.eventId}\n`;
            visualization += `- Timestamp: ${event.timestamp}\n`;
            visualization += `- Source: ${event.source}\n`;
            visualization += `- Payload: \`${JSON.stringify(event.payload)}\`\n`;
            visualization += `- Snapshot: \`${JSON.stringify(event.snapshot)}\`\n\n`;
        });
    });
    return visualization;
};
exports.generateEventVisualization = generateEventVisualization;
// Export event data as JSON
const exportEventsAsJson = async () => {
    const events = await (0, event_store_1.getAllEvents)();
    return JSON.stringify(events, null, 2);
};
exports.exportEventsAsJson = exportEventsAsJson;
