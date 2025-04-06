import { getAllEvents } from "../lib/event-store"

// Generate a visualization of events
export const generateEventVisualization = async (): Promise<string> => {
  const events = await getAllEvents()

  // Group events by topic
  const eventsByTopic: Record<string, any[]> = {}

  events.forEach((event) => {
    if (!eventsByTopic[event.topic]) {
      eventsByTopic[event.topic] = []
    }

    eventsByTopic[event.topic].push(event)
  })

  // Generate visualization
  let visualization = "# Event Flow Visualization\n\n"

  // Add mermaid diagram
  visualization += "```mermaid\ngraph TD;\n"

  // Add nodes for each topic
  Object.keys(eventsByTopic).forEach((topic) => {
    visualization += `  ${topic}["${topic} (${eventsByTopic[topic].length} events)"]\n`
  })

  // Add connections between topics based on source-topic relationships
  const connections: Set<string> = new Set()

  events.forEach((event) => {
    const source = event.source
    const topic = event.topic

    // Create a unique connection identifier
    const connection = `${source}->${topic}`

    if (!connections.has(connection)) {
      connections.add(connection)
      visualization += `  ${source}["${source}"] --> ${topic}\n`
    }
  })

  visualization += "```\n\n"

  // Add event details
  visualization += "## Event Details\n\n"

  Object.keys(eventsByTopic).forEach((topic) => {
    visualization += `### ${topic}\n\n`

    eventsByTopic[topic].forEach((event) => {
      visualization += `#### Event ID: ${event.eventId}\n`
      visualization += `- Timestamp: ${event.timestamp}\n`
      visualization += `- Source: ${event.source}\n`
      visualization += `- Payload: \`${JSON.stringify(event.payload)}\`\n`
      visualization += `- Snapshot: \`${JSON.stringify(event.snapshot)}\`\n\n`
    })
  })

  return visualization
}

// Export event data as JSON
export const exportEventsAsJson = async (): Promise<string> => {
  const events = await getAllEvents()
  return JSON.stringify(events, null, 2)
}

