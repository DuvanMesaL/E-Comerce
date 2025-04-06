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
  const validatedData = CartItemInputSchema.parse(cartItemInput)

  // Get product details
  const product = await getProductById(validatedData.productId)

  if (!product) {
    throw new Error("Product not found")
  }

  // Check if product has enough stock
  if (product.stock < validatedData.quantity) {
    throw new Error("Not enough stock available")
  }

  // Add item to cart
  const cart = await addItemToCart(validatedData.userId, {
    productId: product.id,
    quantity: validatedData.quantity,
    price: product.price,
    name: product.name,
  })

  // Publish cart update event
  await publishEvent(
    config.topics.cartUpdates,
    "CartService",
    {
      userId: validatedData.userId,
      productId: product.id,
      quantity: validatedData.quantity,
    },
    {
      cartId: cart.id,
      totalItems: cart.totalItems,
      updatedAt: cart.updatedAt,
    },
  )

  return cart
}

// Remove item from cart
export const removeFromCart = async (
  userId: string,
  productId: string,
  userEmail: string,
): Promise<CartResponse | null> => {
  // Get product details for notification
  const product = await getProductById(productId)

  if (!product) {
    throw new Error("Product not found")
  }

  // Remove item from cart
  const cart = await removeItemFromCart(userId, productId)

  if (!cart) {
    throw new Error("Cart not found")
  }

  // Publish cart removal event
  await publishEvent(
    config.topics.cartRemovals,
    "CartService",
    {
      userId,
      productId,
      userEmail,
      productName: product.name,
    },
    {
      removedProduct: {
        id: product.id,
        name: product.name,
        price: product.price,
      },
    },
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

