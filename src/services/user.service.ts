import { z } from "zod"
import { createUser, findUserByEmail, verifyUserCredentials, type UserResponse } from "../models/user.model"
import { publishEvent } from "../lib/kafka"
import config from "../config"

// User registration input schema
export const UserRegistrationSchema = z.object({
  name: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
})

export type UserRegistrationInput = z.infer<typeof UserRegistrationSchema>

// User login input schema
export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type UserLoginInput = z.infer<typeof UserLoginSchema>

// Register a new user
export const registerUser = async (userData: UserRegistrationInput): Promise<UserResponse> => {
  // Validate user data
  const validatedData = UserRegistrationSchema.parse(userData)

  // Check if user already exists
  const existingUser = await findUserByEmail(validatedData.email)

  if (existingUser) {
    throw new Error("User with this email already exists")
  }

  // Create user
  const user = await createUser(validatedData)

  // Publish user registration event
  await publishEvent(
    config.topics.userRegistration,
    "UserService",
    {
      name: user.name,
      email: user.email,
    },
    {
      userId: user.id,
      status: "REGISTERED",
    },
  )

  // Publish welcome flow event
  await publishEvent(
    config.topics.welcomeFlow,
    "UserService",
    {
      name: user.name,
      email: user.email,
    },
    {
      userId: user.id,
      status: "WELCOME_FLOW_INITIATED",
    },
  )

  return user
}

// Login user
export const loginUser = async (loginData: UserLoginInput): Promise<UserResponse> => {
  // Validate login data
  const validatedData = UserLoginSchema.parse(loginData)

  // Verify credentials
  const user = await verifyUserCredentials(validatedData.email, validatedData.password)

  if (!user) {
    throw new Error("Invalid email or password")
  }

  return user
}

// Get user by email
export const getUserByEmail = async (email: string): Promise<UserResponse | null> => {
  return findUserByEmail(email)
}

