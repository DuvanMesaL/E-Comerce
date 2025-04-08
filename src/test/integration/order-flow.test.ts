import { registerUser } from "../../services/user.service"
import { createNewProduct } from "../../services/product.service"
import { addToCart } from "../../services/cart.service"
import { createNewOrder } from "../../services/order.service"
import { publishEvent } from "../../lib/kafka"
import { describe, beforeEach, it, expect, jest } from "@jest/globals"

// Mock services and Kafka
jest.mock("../../models/user.model")
jest.mock("../../models/product.model")
jest.mock("../../models/cart.model")
jest.mock("../../models/order.model")
jest.mock("../../lib/kafka")
jest.mock("../../lib/event-store")

describe("Order Flow Integration", () => {
  // Mock data
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

  const mockProduct = {
    id: "1",
    name: "Test Product",
    description: "This is a test product",
    price: 99.99,
    category: "Test",
    stock: 10,
  }

  const mockProductInput = {
    name: "Test Product",
    description: "This is a test product",
    price: 99.99,
    category: "Test",
    stock: 10,
  }

  const mockCartItem = {
    productId: "1",
    quantity: 2,
    price: 99.99,
    name: "Test Product",
  }

  const mockCart = {
    id: "1",
    userId: "1",
    items: [mockCartItem],
    totalItems: 2,
    totalAmount: 199.98,
    updatedAt: new Date(),
  }

  const mockOrder = {
    id: "1",
    userId: "1",
    items: [mockCartItem],
    totalItems: 2,
    totalAmount: 199.98,
    status: "CREATED",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock service implementations
    require("../../models/user.model").createUser.mockResolvedValue(mockUser)
    require("../../models/user.model").findUserByEmail.mockResolvedValue(null)

    require("../../models/product.model").createProduct.mockResolvedValue(mockProduct)
    require("../../models/product.model").getProductById.mockResolvedValue(mockProduct)

    require("../../models/cart.model").addItemToCart.mockResolvedValue(mockCart)
    require("../../models/cart.model").getCartByUserId.mockResolvedValue(mockCart)
    require("../../models/cart.model").clearCart.mockResolvedValue(true)

    require("../../models/order.model").createOrder.mockResolvedValue(mockOrder)

    // ✅ Corrección aquí: tipado correcto para evitar errores TS
    ;(publishEvent as jest.MockedFunction<typeof publishEvent>).mockResolvedValue("event-id")
  })

  it("should complete the full order flow successfully", async () => {
    // 1. Register a user
    const user = await registerUser(mockUserInput)
    expect(user).toEqual(mockUser)
    expect(publishEvent).toHaveBeenCalledWith(
      expect.any(String),
      "UserService",
      expect.objectContaining({
        name: mockUser.name,
        email: mockUser.email,
      }),
      expect.any(Object),
    )

    // 2. Create a product
    const product = await createNewProduct(mockProductInput)
    expect(product).toEqual(mockProduct)
    expect(publishEvent).toHaveBeenCalledWith(
      expect.any(String),
      "ProductService",
      expect.objectContaining({
        productId: mockProduct.id,
        name: mockProduct.name,
      }),
      expect.any(Object),
    )

    // 3. Add product to cart
    const cart = await addToCart({
      userId: user.id,
      productId: product.id,
      quantity: 2,
    })
    expect(cart).toEqual(mockCart)
    expect(publishEvent).toHaveBeenCalledWith(
      expect.any(String),
      "CartService",
      expect.objectContaining({
        userId: user.id,
        productId: product.id,
      }),
      expect.any(Object),
    )

    // 4. Create an order
    const order = await createNewOrder({ userId: user.id }, user.email)
    expect(order).toEqual(mockOrder)
    expect(publishEvent).toHaveBeenCalledWith(
      expect.any(String),
      "OrderService",
      expect.objectContaining({
        orderId: order.id,
        userId: user.id,
      }),
      expect.any(Object),
    )

    // Verify all events were published
    expect(publishEvent).toHaveBeenCalledTimes(5)
  })
})
