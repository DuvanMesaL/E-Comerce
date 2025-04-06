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

  // Get user's cart

  // Create order

  // Update product stock

  // Clear cart

  // Publish order created event
  await publishEvent(
  )

  // Publish invoice processing event
  await publishEvent(
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

