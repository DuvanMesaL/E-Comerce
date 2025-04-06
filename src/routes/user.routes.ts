import express, { type Request, type Response } from "express"
import { registerUser, loginUser, type UserRegistrationInput, type UserLoginInput } from "../services/user.service"

const router = express.Router()

// Register a new user
router.post("/register", async (req: Request, res: Response) => {
  try {
    const userData: UserRegistrationInput = req.body
    const user = await registerUser(userData)

    res.status(201).json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Error registering user:", error)

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

// Login user
router.post("/login", async (req: Request, res: Response) => {
  try {
    const loginData: UserLoginInput = req.body
    const user = await loginUser(loginData)

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Error logging in user:", error)

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

export default router

