import { z } from "zod"
import { createOrder, getOrderById, getOrdersByUserId, type OrderResponse } from "../models/order.model"
import { getUserCart, emptyCart } from "./cart.service"
import { updateStock } from "./product.service"
import { publishEvent } from "../lib/kafka"
import config from "../config"

// Order creation input schema
export const OrderCreationSchema = z.object({
  userId: z.string(),
})

export type OrderCreationInput = z.infer<typeof OrderCreationSchema>

// Create a new order
export const createNewOrder = async (orderData: OrderCreationInput, userEmail: string): Promise<OrderResponse> => {
  // Validate input
  const validatedData = OrderCreationSchema.parse(orderData)

  // Get user's cart
  const cart = await getUserCart(validatedData.userId)

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty")
  }

  // Create order
  const order = await createOrder(validatedData.userId, cart.items)

  // Update product stock
  for (const item of cart.items) {
    await updateStock(item.productId, item.quantity)
  }

  // Clear cart
  await emptyCart(validatedData.userId)

  // Publish order created event
  await publishEvent(
    config.topics.orderCreated,
    "OrderService",
    {
      orderId: order.id,
      userId: order.userId,
      totalAmount: order.totalAmount,
    },
    {
      orderId: order.id,
      status: "CREATED",
      items: order.items.length,
    },
  )

  // Publish invoice processing event
  await publishEvent(
    config.topics.invoiceProcessing,
    "OrderService",
    {
      orderId: order.id,
      userId: order.userId,
      userEmail,
    },
    {
      orderId: order.id,
      status: "INVOICE_REQUESTED",
    },
  )

  return order
}

// Get order by ID
export const getOrder = async (id: string): Promise<OrderResponse | null> => {
  return getOrderById(id)
}

// Get user's orders
export const getUserOrders = async (userId: string): Promise<OrderResponse[]> => {
  return getOrdersByUserId(userId)
}

