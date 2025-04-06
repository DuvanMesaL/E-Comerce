import express, { type Request, type Response } from "express"
import { addToCart, removeFromCart, getUserCart, type CartItemInput } from "../services/cart.service"
import { getUserByEmail } from "../services/user.service"

const router = express.Router()

// Add item to cart
router.post("/items", async (req: Request, res: Response) => {
  try {
    const cartItemInput: CartItemInput = req.body
    const cart = await addToCart(cartItemInput)

    res.status(200).json({
      success: true,
      data: cart,
    })
  } catch (error) {
    console.error("Error adding item to cart:", error)

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

// Remove item from cart
router.delete("/items/:productId", async (req: Request, res: Response) => {
  try {
    const { productId } = req.params
    const { userId, email } = req.body

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      })
    }

    // Get user email if not provided
    let userEmail = email
    if (!userEmail) {
      const user = await getUserByEmail(userEmail)
      if (user) {
        userEmail = user.email
      } else {
        userEmail = "user@example.com" // Fallback
      }
    }

    const cart = await removeFromCart(userId, productId, userEmail)

    res.status(200).json({
      success: true,
      data: cart,
    })
  } catch (error) {
    console.error("Error removing item from cart:", error)

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

// Get user's cart
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const cart = await getUserCart(userId)

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: "Cart not found",
      })
    }

    res.status(200).json({
      success: true,
      data: cart,
    })
  } catch (error) {
    console.error("Error getting cart:", error)

    res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
})

export default router

