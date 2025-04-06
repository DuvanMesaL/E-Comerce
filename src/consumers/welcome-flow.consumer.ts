import type { Consumer, EachMessagePayload } from "kafkajs"
import { createConsumer, publishEvent, subscribeToTopic } from "../lib/kafka"
import config from "../config"
import { findUserByEmail } from "../models/user.model"

// Process welcome flow events
const processWelcomeFlow = async (messagePayload: EachMessagePayload): Promise<void> => {
  const { message } = messagePayload
  const messageValue = message.value?.toString()

  if (!messageValue) {
    console.error("Empty message received in welcome flow consumer")
    return
  }

  try {

    // Get user details

    // Create notification event

    // Publish notification event

  } catch (error) {
    console.error("Error processing welcome flow event:", error)
  }
}

// Initialize welcome flow consumer
export const initWelcomeFlowConsumer = async (): Promise<Consumer> => {
  const consumer = await createConsumer("welcome-flow-group")

  return consumer
}

