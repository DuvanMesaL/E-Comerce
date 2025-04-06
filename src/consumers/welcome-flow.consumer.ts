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
    const event = JSON.parse(messageValue)
    console.log(`Processing welcome flow event: ${event.eventId}`)

    // Get user details
    const user = await findUserByEmail(event.payload.email)

    if (!user) {
      console.error(`User not found for email: ${event.payload.email}`)
      return
    }

    // Create notification event
    const notificationPayload = {
      to: user.email,
      subject: `¡Bienvenido a nuestra plataforma, ${user.name}!`,
      content: `
        <h1>Bienvenido a nuestro e-commerce</h1>
        <p>Hola ${user.name},</p>
        <p>Gracias por registrarte en nuestra plataforma. Estamos emocionados de tenerte con nosotros.</p>
        <p>Ahora puedes explorar nuestro catálogo y comenzar a comprar.</p>
        <p>¡Disfruta de tu experiencia de compra!</p>
      `,
    }

    // Publish notification event
    await publishEvent(config.topics.notification, "WelcomeFlowService", notificationPayload, {
      userId: user.id,
      status: "WELCOME_EMAIL_SENT",
    })

    console.log(`Welcome flow processed for user: ${user.email}`)
  } catch (error) {
    console.error("Error processing welcome flow event:", error)
  }
}

// Initialize welcome flow consumer
export const initWelcomeFlowConsumer = async (): Promise<Consumer> => {
  const consumer = await createConsumer("welcome-flow-group")

  await subscribeToTopic(consumer, config.topics.welcomeFlow, processWelcomeFlow)

  return consumer
}

