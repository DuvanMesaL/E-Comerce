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
    const event = JSON.parse(messageValue)
    console.log(`Processing cart removal event: ${event.eventId}`)

    // Extract data
    const { userId, productId, userEmail, productName } = event.payload

    // Create notification for cart abandonment
    const notificationPayload = {
      to: userEmail,
      subject: "¿Olvidaste algo en tu carrito?",
      content: `
        <h1>Artículo eliminado de tu carrito</h1>
        <p>Hola,</p>
        <p>Vimos que eliminaste "${productName}" de tu carrito.</p>
        <p>¿Necesitas ayuda para encontrar algo más? Estamos aquí para ayudarte.</p>
        <p>Vuelve a visitar nuestra tienda para ver más productos.</p>
      `,
    }

    // Publish notification event
    await publishEvent(config.topics.notification, "CartRemovalService", notificationPayload, {
      userId,
      productId,
      status: "CART_REMOVAL_NOTIFICATION_SENT",
    })

    console.log(`Cart removal notification sent for user: ${userEmail}`)
  } catch (error) {
    console.error("Error processing cart removal event:", error)
  }
}

// Initialize cart removal consumer
export const initCartRemovalConsumer = async (): Promise<Consumer> => {
  const consumer = await createConsumer("cart-removal-group")

  await subscribeToTopic(consumer, config.topics.cartRemovals, processCartRemoval)

  return consumer
}

