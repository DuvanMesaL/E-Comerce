import express, { type Request, type Response } from "express"
import { createNewOrder, getOrder, getUserOrders, type OrderCreationInput } from "../services/order.service"

const router = express.Router()

// Create a new order
router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, email } = req.body
    const orderData: OrderCreationInput = { userId }

    const order = await createNewOrder(orderData, email)

    res.status(201).json({
      success: true,
      data: order,
    })
  } catch (error) {
    console.error("Error creating order:", error)

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

// Get order by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const order = await getOrder(id)

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      })
    }

    res.status(200).json({
      success: true,
      data: order,
    })
  } catch (error) {
    console.error("Error getting order:", error)

    res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
})

// Get user's orders
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const orders = await getUserOrders(userId)

    res.status(200).json({
      success: true,
      data: orders,
    })
  } catch (error) {
    console.error("Error getting user orders:", error)

    res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
})

export default router

