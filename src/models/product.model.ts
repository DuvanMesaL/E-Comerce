import { query } from "../lib/postgres"
import { z } from "zod"

// Product schema validation with Zod
export const ProductSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().positive(),
  category: z.string().min(2).max(50),
  stock: z.number().int().nonnegative().default(0),
})

export type Product = z.infer<typeof ProductSchema>
export type ProductResponse = Product & { id: string }

// Create a new product
export const createProduct = async (
  productData: Omit<Product, "createdAt" | "updatedAt">,
): Promise<ProductResponse> => {
  // Validate product data
  const validatedData = ProductSchema.parse(productData)

  // Insert product
  const result = await query(
    `INSERT INTO products (name, description, price, category, stock)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, description, price, category, stock, created_at, updated_at`,
    [validatedData.name, validatedData.description, validatedData.price, validatedData.category, validatedData.stock],
  )

  const product = result.rows[0]

  return {
    id: product.id.toString(),
    name: product.name,
    description: product.description,
    price: Number.parseFloat(product.price),
    category: product.category,
    stock: product.stock,
  }
}

// Get all products
export const getAllProducts = async (): Promise<ProductResponse[]> => {
  const result = await query(
    `SELECT id, name, description, price, category, stock
     FROM products
     ORDER BY name ASC`,
  )

  return result.rows.map((product: any) => ({
    id: product.id.toString(),
    name: product.name,
    description: product.description,
    price: Number.parseFloat(product.price),
    category: product.category,
    stock: product.stock,
  }))
}

// Get product by ID
export const getProductById = async (id: string): Promise<ProductResponse | null> => {
  try {
    const result = await query(
      `SELECT id, name, description, price, category, stock
       FROM products
       WHERE id = $1`,
      [id],
    )

    if (result.rows.length === 0) {
      return null
    }

    const product = result.rows[0]

    return {
      id: product.id.toString(),
      name: product.name,
      description: product.description,
      price: Number.parseFloat(product.price),
      category: product.category,
      stock: product.stock,
    }
  } catch (error) {
    console.error("Error getting product by ID:", error)
    return null
  }
}

// Update product stock
export const updateProductStock = async (id: string, quantity: number): Promise<boolean> => {
  try {
    const result = await query(
      `UPDATE products
       SET stock = stock - $1, updated_at = NOW()
       WHERE id = $2 AND stock >= $1
       RETURNING id`,
      [quantity, id],
    )

    return result.rows.length > 0
  } catch (error) {
    console.error("Error updating product stock:", error)
    return false
  }
}

