import { createNewOrder, getOrder, getUserOrders } from "../order.service"
import { createOrder, getOrderById, getOrdersByUserId } from "../../models/order.model"
import { getUserCart, emptyCart } from "../cart.service"
import { updateStock } from "../product.service"
import { publishEvent } from "../../lib/kafka"

// Mock the order model and services
jest.mock("../../models/order.model")
jest.mock("../cart.service")
jest.mock("../product.service")
jest.mock("../../lib/kafka")

describe("Order Service", () => {
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

  const mockOrderInput = {
    userId: "1",
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("createNewOrder", () => {
    it("should create a new order successfully", async () => {
      ;(getUserCart as jest.Mock).mockResolvedValue(mockCart)
      ;(createOrder as jest.Mock).mockResolvedValue(mockOrder)
      ;(updateStock as jest.Mock).mockResolvedValue(true)
      ;(emptyCart as jest.Mock).mockResolvedValue(true)
      ;(publishEvent as jest.Mock).mockResolvedValue("event-id")

      const result = await createNewOrder(mockOrderInput, "test@example.com")

      expect(getUserCart).toHaveBeenCalledWith(mockOrderInput.userId)
      expect(createOrder).toHaveBeenCalledWith(mockOrderInput.userId, mockCart.items)
      expect(updateStock).toHaveBeenCalledTimes(1)
      expect(emptyCart).toHaveBeenCalledWith(mockOrderInput.userId)
      expect(publishEvent).toHaveBeenCalledTimes(2) // Order created and invoice processing events
      expect(result).toEqual(mockOrder)
    })

    it("should throw an error if cart is empty", async () => {
      ;(getUserCart as jest.Mock).mockResolvedValue(null)

      await expect(createNewOrder(mockOrderInput, "test@example.com")).rejects.toThrow("Cart is empty")
      expect(createOrder).not.toHaveBeenCalled()
      expect(updateStock).not.toHaveBeenCalled()
      expect(emptyCart).not.toHaveBeenCalled()
      expect(publishEvent).not.toHaveBeenCalled()
    })

    it("should throw an error if cart has no items", async () => {
      ;(getUserCart as jest.Mock).mockResolvedValue({ ...mockCart, items: [] })

      await expect(createNewOrder(mockOrderInput, "test@example.com")).rejects.toThrow("Cart is empty")
      expect(createOrder).not.toHaveBeenCalled()
      expect(updateStock).not.toHaveBeenCalled()
      expect(emptyCart).not.toHaveBeenCalled()
      expect(publishEvent).not.toHaveBeenCalled()
    })
  })

  describe("getOrder", () => {
    it("should return an order by ID", async () => {
      ;(getOrderById as jest.Mock).mockResolvedValue(mockOrder)

      const result = await getOrder("1")

      expect(getOrderById).toHaveBeenCalledWith("1")
      expect(result).toEqual(mockOrder)
    })

    it("should return null if order not found", async () => {
      ;(getOrderById as jest.Mock).mockResolvedValue(null)

      const result = await getOrder("999")

      expect(getOrderById).toHaveBeenCalledWith("999")
      expect(result).toBeNull()
    })
  })

  describe("getUserOrders", () => {
    it("should return user orders", async () => {
      ;(getOrdersByUserId as jest.Mock).mockResolvedValue([mockOrder])

      const result = await getUserOrders("1")

      expect(getOrdersByUserId).toHaveBeenCalledWith("1")
      expect(result).toEqual([mockOrder])
    })

    it("should return empty array if no orders found", async () => {
      ;(getOrdersByUserId as jest.Mock).mockResolvedValue([])

      const result = await getUserOrders("999")

      expect(getOrdersByUserId).toHaveBeenCalledWith("999")
      expect(result).toEqual([])
    })
  })
})

