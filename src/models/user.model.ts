import { query } from "../lib/postgres"
import { z } from "zod"
import bcrypt from "bcrypt"

// User schema validation with Zod
export const UserSchema = z.object({
  name: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
})

export type User = z.infer<typeof UserSchema>

// User without sensitive data
export type UserResponse = Omit<User, "password"> & { id: string }

// Create a new user
export const createUser = async (userData: Omit<User, "createdAt" | "updatedAt">): Promise<UserResponse> => {
  // Validate user data
  const validatedData = UserSchema.parse(userData)

  // Hash password
  const hashedPassword = await bcrypt.hash(validatedData.password, 10)

  // Insert user with hashed password
  const result = await query(
    `INSERT INTO users (name, last_name, email, password, phone)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, last_name, email, phone, created_at, updated_at`,
    [validatedData.name, validatedData.lastName, validatedData.email, hashedPassword, validatedData.phone || null],
  )

  const user = result.rows[0]

  // Return user without password
  return {
    id: user.id.toString(),
    name: user.name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone,
  }
}

// Find user by email
export const findUserByEmail = async (email: string): Promise<UserResponse | null> => {
  const result = await query(
    `SELECT id, name, last_name, email, phone, created_at, updated_at
     FROM users
     WHERE email = $1`,
    [email],
  )

  if (result.rows.length === 0) {
    return null
  }

  const user = result.rows[0]

  return {
    id: user.id.toString(),
    name: user.name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone,
  }
}

// Verify user credentials
export const verifyUserCredentials = async (email: string, password: string): Promise<UserResponse | null> => {
  const result = await query(
    `SELECT id, name, last_name, email, phone, password
     FROM users
     WHERE email = $1`,
    [email],
  )

  if (result.rows.length === 0) {
    return null
  }

  const user = result.rows[0]

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return null
  }

  // Return user without password
  return {
    id: user.id.toString(),
    name: user.name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone,
  }
}

