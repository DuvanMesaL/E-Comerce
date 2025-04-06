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

  // Check if user already exists

  // Create user

  // Publish user registration event
  await publishEvent(
  )

  // Publish welcome flow event
  await publishEvent(
  )

  return user
}

// Login user
export const loginUser = async (loginData: UserLoginInput): Promise<UserResponse> => {
  // Validate login data

  // Verify credentials

  return user
}

// Get user by email
export const getUserByEmail = async (email: string): Promise<UserResponse | null> => {
  return findUserByEmail(email)
}

