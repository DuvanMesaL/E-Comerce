import express, { type Request, type Response } from "express"
import { createNewProduct, getProducts, getProduct, type ProductCreationInput } from "../services/product.service"

const router = express.Router()

// Create a new product
router.post("/", async (req: Request, res: Response) => {
  try {
    const productData: ProductCreationInput = req.body
    const product = await createNewProduct(productData)

    res.status(201).json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error("Error creating product:", error)

    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        error: error.message,
      })
    } else {
      res.status(500).json({
        success: false,
        error: "Internal server error",
      })
    }
  }
})

// Get all products
router.get("/", async (_req: Request, res: Response) => {
  try {
    const products = await getProducts()

    res.status(200).json({
      success: true,
      data: products,
    })
  } catch (error) {
    console.error("Error getting products:", error)

    res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
})

// Get product by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const product = await getProduct(id)

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      })
    }

    res.status(200).json({
      success: true,
      data: product,
    })
  } catch (error) {
    console.error("Error getting product:", error)

    res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
})

export default router

