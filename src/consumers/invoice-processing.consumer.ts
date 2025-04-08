import type { Consumer } from "kafkajs"
import type { EachMessagePayload } from "../lib/kafka"
import { createConsumer, publishEvent, subscribeToTopic } from "../lib/kafka"
import config from "../config"
import { getOrderById, updateOrderStatus, OrderStatus } from "../models/order.model"

// Process invoice events
const processInvoice = async (messagePayload: unknown): Promise<void> => {
  const { message } = messagePayload as {
    message: {
      key: Buffer | null
      value: Buffer | null
      headers?: Record<string, Buffer>
      offset: string
    }
  }
  
  const messageValue = message.value?.toString()

  if (!messageValue) {
    console.error("Empty message received in invoice processing consumer")
    return
  }

  try {
    const event = JSON.parse(messageValue)
    console.log(`Processing invoice event: ${event.eventId}`)

    // Extract order data
    const { orderId, userEmail } = event.payload

    // Get order details
    const order = await getOrderById(orderId)

    if (!order) {
      console.error(`Order not found: ${orderId}`)
      return
    }

    // Update order status
    await updateOrderStatus(orderId, OrderStatus.PROCESSING)

    // Generate invoice content
    const invoiceContent = `
      <h1>Factura #${orderId}</h1>
      <p>Fecha: ${new Date().toLocaleDateString()}</p>
      <h2>Detalles del pedido</h2>
      <table border="1" cellpadding="5" style="border-collapse: collapse;">
        <tr>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio unitario</th>
          <th>Total</th>
        </tr>
        ${order.items
          .map(
            (item) => `
          <tr>
            <td>${item.name || "Producto"}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `,
          )
          .join("")}
        <tr>
          <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
          <td><strong>$${order.totalAmount.toFixed(2)}</strong></td>
        </tr>
      </table>
      <p>Gracias por tu compra!</p>
    `

    // Create notification for invoice
    const notificationPayload = {
      to: userEmail,
      subject: `Factura #${orderId}`,
      content: invoiceContent,
    }

    // Publish notification event
    await publishEvent(config.topics.notification, "InvoiceService", notificationPayload, {
      orderId,
      status: "INVOICE_SENT",
    })

    console.log(`Invoice sent for order: ${orderId}`)
  } catch (error) {
    console.error("Error processing invoice event:", error)
  }
}

// Initialize invoice processing consumer
export const initInvoiceProcessingConsumer = async (): Promise<Consumer> => {
  const consumer = await createConsumer("invoice-processing-group")

  await subscribeToTopic(consumer, config.topics.invoiceProcessing, processInvoice)

  return consumer
}

