import type { Consumer, EachMessagePayload } from "kafkajs"
import { createConsumer, subscribeToTopic } from "../lib/kafka"
import config from "../config"
import { sendEmail } from "../lib/email"

// Process notification events
const processNotification = async (messagePayload: EachMessagePayload): Promise<void> => {
  const { message } = messagePayload
  const messageValue = message.value?.toString()

  if (!messageValue) {
    console.error("Empty message received in notification consumer")
    return
  }

  try {
    const event = JSON.parse(messageValue)
    console.log(`Processing notification event: ${event.eventId}`)

    // Extract email data
    const { to, subject, content } = event.payload

    // Send email
    await sendEmail({
      to,
      subject,
      content,
    })

    console.log(`Notification sent to: ${to}`)
  } catch (error) {
    console.error("Error processing notification event:", error)
  }
}

// Initialize notification consumer
export const initNotificationConsumer = async (): Promise<Consumer> => {
  const consumer = await createConsumer("notification-group")

  await subscribeToTopic(consumer, config.topics.notification, processNotification)

  return consumer
}

