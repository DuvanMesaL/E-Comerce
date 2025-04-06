import express, { type Request, type Response } from "express"
import { getAllEvents, getEventsBySource, getEventsByTopic } from "../lib/event-store"

const router = express.Router()

// Get all events
router.get("/", async (_req: Request, res: Response) => {
  try {
    const events = await getAllEvents()

    res.status(200).json({
      success: true,
      data: events,
    })
  } catch (error) {
    console.error("Error getting events:", error)

    res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
})

// Get events by source
router.get("/source/:source", async (req: Request, res: Response) => {
  try {
    const { source } = req.params
    const events = await getEventsBySource(source)

    res.status(200).json({
      success: true,
      data: events,
    })
  } catch (error) {
    console.error("Error getting events by source:", error)

    res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
})

// Get events by topic
router.get("/topic/:topic", async (req: Request, res: Response) => {
  try {
    const { topic } = req.params
    const events = await getEventsByTopic(topic)

    res.status(200).json({
      success: true,
      data: events,
    })
  } catch (error) {
    console.error("Error getting events by topic:", error)

    res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
})

export default router

