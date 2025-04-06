import { z } from "zod"
import { addItemToCart, removeItemFromCart, getCartByUserId, clearCart, type CartResponse } from "../models/cart.model"
import { getProductById } from "../models/product.model"
import { publishEvent } from "../lib/kafka"
import config from "../config"

// Cart item input schema
export const CartItemInputSchema = z.object({
  userId: z.string(),
  productId: z.string(),
  quantity: z.number().int().positive(),
})

export type CartItemInput = z.infer<typeof CartItemInputSchema>

// Add item to cart
export const addToCart = async (cartItemInput: CartItemInput): Promise<CartResponse> => {
  // Validate input

  // Get product details

  // Check if product has enough stock

  // Add item to cart

  // Publish cart update event

  return cart
}

// Remove item from cart
export const removeFromCart = async (
  userId: string,
  productId: string,
  userEmail: string,
): Promise<CartResponse | null> => {
  // Get product details for notification

  // Remove item from cart


  // Publish cart removal event
  await publishEvent(
    
  )

  return cart
}

// Get user's cart
export const getUserCart = async (userId: string): Promise<CartResponse | null> => {
  return getCartByUserId(userId)
}

// Clear user's cart
export const emptyCart = async (userId: string): Promise<boolean> => {
  return clearCart(userId)
}

