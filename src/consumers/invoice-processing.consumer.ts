import type { Consumer, EachMessagePayload } from "kafkajs"
import { createConsumer, publishEvent, subscribeToTopic } from "../lib/kafka"
import config from "../config"
import { getOrderById, updateOrderStatus, OrderStatus } from "../models/order.model"

// Process invoice events
const processInvoice = async (messagePayload: EachMessagePayload): Promise<void> => {
  const { message } = messagePayload
  const messageValue = message.value?.toString()

  if (!messageValue) {
    console.error("Empty message received in invoice processing consumer")
    return
  }

  try {
    
    // Extract order data

    // Get order details

    // Update order status

    // Generate invoice content

    // Publish notification event
  } catch (error) {
    console.error("Error processing invoice event:", error)
  }
}

// Initialize invoice processing consumer
export const initInvoiceProcessingConsumer = async (): Promise<Consumer> => {
  const consumer = await createConsumer("invoice-processing-group")

  return consumer
}

