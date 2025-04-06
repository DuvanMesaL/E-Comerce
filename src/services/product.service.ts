import { z } from "zod"
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductStock,
  type ProductResponse,
} from "../models/product.model"
import { publishEvent } from "../lib/kafka"

// Product creation input schema
export const ProductCreationSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().positive(),
  category: z.string().min(2).max(50),
  stock: z.number().int().nonnegative().default(0),
})

export type ProductCreationInput = z.infer<typeof ProductCreationSchema>

// Create a new product
export const createNewProduct = async (productData: ProductCreationInput): Promise<ProductResponse> => {
  // Validate product data

  // Create product

  // Publish product created event
  await publishEvent(
  )

  return product
}

// Get all products
export const getProducts = async (): Promise<ProductResponse[]> => {
  return getAllProducts()
}

// Get product by ID
export const getProduct = async (id: string): Promise<ProductResponse | null> => {
  return getProductById(id)
}

// Update product stock
export const updateStock = async (id: string, quantity: number): Promise<boolean> => {
  return updateProductStock(id, quantity)
}

