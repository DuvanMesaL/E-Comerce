import { registerUser, loginUser, getUserByEmail } from "../user.service"
import { createUser, findUserByEmail, verifyUserCredentials } from "../../models/user.model"
import { publishEvent } from "../../lib/kafka"

// Mock the user model
jest.mock("../../models/user.model")
jest.mock("../../lib/kafka")

describe("User Service", () => {
  const mockUser = {
    id: "1",
    name: "Test",
    lastName: "User",
    email: "test@example.com",
    phone: "+1234567890",
  }

  const mockUserInput = {
    name: "Test",
    lastName: "User",
    email: "test@example.com",
    password: "password123",
    phone: "+1234567890",
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("registerUser", () => {
    it("should register a new user successfully", async () => {
      // Mock the createUser function
      ;(createUser as jest.Mock).mockResolvedValue(mockUser)
      ;(findUserByEmail as jest.Mock).mockResolvedValue(null)
      ;(publishEvent as jest.Mock).mockResolvedValue("event-id")

      const result = await registerUser(mockUserInput)

      expect(findUserByEmail).toHaveBeenCalledWith(mockUserInput.email)
      expect(createUser).toHaveBeenCalledWith(mockUserInput)
      expect(publishEvent).toHaveBeenCalledTimes(2) // User registration and welcome flow events
      expect(result).toEqual(mockUser)
    })

    it("should throw an error if user already exists", async () => {
      ;(findUserByEmail as jest.Mock).mockResolvedValue(mockUser)

      await expect(registerUser(mockUserInput)).rejects.toThrow("User with this email already exists")
      expect(createUser).not.toHaveBeenCalled()
      expect(publishEvent).not.toHaveBeenCalled()
    })
  })

  describe("loginUser", () => {
    it("should login a user successfully", async () => {
      ;(verifyUserCredentials as jest.Mock).mockResolvedValue(mockUser)

      const result = await loginUser({
        email: mockUserInput.email,
        password: mockUserInput.password,
      })

      expect(verifyUserCredentials).toHaveBeenCalledWith(mockUserInput.email, mockUserInput.password)
      expect(result).toEqual(mockUser)
    })

    it("should throw an error if credentials are invalid", async () => {
      ;(verifyUserCredentials as jest.Mock).mockResolvedValue(null)

      await expect(
        loginUser({
          email: mockUserInput.email,
          password: "wrongpassword",
        }),
      ).rejects.toThrow("Invalid email or password")
    })
  })

  describe("getUserByEmail", () => {
    it("should return a user by email", async () => {
      ;(findUserByEmail as jest.Mock).mockResolvedValue(mockUser)

      const result = await getUserByEmail(mockUserInput.email)

      expect(findUserByEmail).toHaveBeenCalledWith(mockUserInput.email)
      expect(result).toEqual(mockUser)
    })

    it("should return null if user not found", async () => {
      ;(findUserByEmail as jest.Mock).mockResolvedValue(null)

      const result = await getUserByEmail("nonexistent@example.com")

      expect(findUserByEmail).toHaveBeenCalledWith("nonexistent@example.com")
      expect(result).toBeNull()
    })
  })
})

