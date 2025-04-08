import type { Consumer } from "kafkajs"
import type { EachMessagePayload } from "../lib/kafka"
import { createConsumer, publishEvent, subscribeToTopic } from "../lib/kafka"
import config from "../config"

// Este es el tipo real del objeto que KafkaJS pasa a `eachMessage`
type MessagePayload = {
  topic: string
  partition: number
  message: {
    key: Buffer | null
    value: Buffer | null
    headers?: Record<string, Buffer>
    offset: string
  }
}

const processCartRemoval = async (messagePayload: any): Promise<void> => {
  const { message } = messagePayload
  const messageValue = message.value?.toString()

  if (!messageValue) {
    console.error("Empty message received in cart removal consumer")
    return
  }

  try {
    const event = JSON.parse(messageValue)
    console.log(`Processing cart removal event: ${event.eventId}`)

    const { userId, productId, userEmail, productName } = event.payload

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

    await publishEvent(
      config.topics.notification,
      "CartRemovalService",
      notificationPayload,
      {
        userId,
        productId,
        status: "CART_REMOVAL_NOTIFICATION_SENT",
      }
    )

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
