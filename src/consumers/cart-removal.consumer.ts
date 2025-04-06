import type { Consumer, EachMessagePayload } from "kafkajs"
import { createConsumer, publishEvent, subscribeToTopic } from "../lib/kafka"
import config from "../config"

// Process cart removal events
const processCartRemoval = async (messagePayload: EachMessagePayload): Promise<void> => {
  const { message } = messagePayload
  const messageValue = message.value?.toString()

  if (!messageValue) {
    console.error("Empty message received in cart removal consumer")
    return
  }

  try {

    // Extract data

    // Create notification for cart abandonment

    // Publish notification event

  } catch (error) {
    console.error("Error processing cart removal event:", error)
  }
}

// Initialize cart removal consumer
export const initCartRemovalConsumer = async (): Promise<Consumer> => {
  const consumer = await createConsumer("cart-removal-group")

  return consumer
}

