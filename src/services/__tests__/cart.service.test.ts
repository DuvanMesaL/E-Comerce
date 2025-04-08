import { addToCart, removeFromCart, getUserCart, emptyCart } from "../cart.service"
import { addItemToCart, removeItemFromCart, getCartByUserId, clearCart } from "../../models/cart.model"
import { getProductById } from "../../models/product.model"
import { publishEvent } from "../../lib/kafka"

// Mock the cart and product models
jest.mock("../../models/cart.model")
jest.mock("../../models/product.model")
jest.mock("../../lib/kafka")

describe("Cart Service", () => {
  const mockProduct = {
    id: "1",
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

  const mockCartItemInput = {
    userId: "1",
    productId: "1",
    quantity: 2,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("addToCart", () => {
    it("should add an item to cart successfully", async () => {
      ;(getProductById as jest.Mock).mockResolvedValue(mockProduct)
      ;(addItemToCart as jest.Mock).mockResolvedValue(mockCart)
      ;(publishEvent as jest.Mock).mockResolvedValue("event-id")

      const result = await addToCart(mockCartItemInput)

      expect(getProductById).toHaveBeenCalledWith(mockCartItemInput.productId)
      expect(addItemToCart).toHaveBeenCalledWith(
        mockCartItemInput.userId,
        expect.objectContaining({
          productId: mockCartItemInput.productId,
          quantity: mockCartItemInput.quantity,
          price: mockProduct.price,
          name: mockProduct.name,
        }),
      )
      expect(publishEvent).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockCart)
    })

    it("should throw an error if product not found", async () => {
      ;(getProductById as jest.Mock).mockResolvedValue(null)

      await expect(addToCart(mockCartItemInput)).rejects.toThrow("Product not found")
      expect(addItemToCart).not.toHaveBeenCalled()
      expect(publishEvent).not.toHaveBeenCalled()
    })

    it("should throw an error if not enough stock", async () => {
      const lowStockProduct = { ...mockProduct, stock: 1 }
      ;(getProductById as jest.Mock).mockResolvedValue(lowStockProduct)

      await expect(addToCart({ ...mockCartItemInput, quantity: 2 })).rejects.toThrow("Not enough stock available")
      expect(addItemToCart).not.toHaveBeenCalled()
      expect(publishEvent).not.toHaveBeenCalled()
    })
  })

  describe("removeFromCart", () => {
    it("should remove an item from cart successfully", async () => {
      ;(getProductById as jest.Mock).mockResolvedValue(mockProduct)
      ;(removeItemFromCart as jest.Mock).mockResolvedValue(mockCart)
      ;(publishEvent as jest.Mock).mockResolvedValue("event-id")

      const result = await removeFromCart("1", "1", "test@example.com")

      expect(getProductById).toHaveBeenCalledWith("1")
      expect(removeItemFromCart).toHaveBeenCalledWith("1", "1")
      expect(publishEvent).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockCart)
    })

    it("should throw an error if product not found", async () => {
      ;(getProductById as jest.Mock).mockResolvedValue(null)

      await expect(removeFromCart("1", "1", "test@example.com")).rejects.toThrow("Product not found")
      expect(removeItemFromCart).not.toHaveBeenCalled()
      expect(publishEvent).not.toHaveBeenCalled()
    })

    it("should throw an error if cart not found", async () => {
      ;(getProductById as jest.Mock).mockResolvedValue(mockProduct)
      ;(removeItemFromCart as jest.Mock).mockResolvedValue(null)

      await expect(removeFromCart("1", "1", "test@example.com")).rejects.toThrow("Cart not found")
      expect(publishEvent).not.toHaveBeenCalled()
    })
  })

  describe("getUserCart", () => {
    it("should return user cart", async () => {
      ;(getCartByUserId as jest.Mock).mockResolvedValue(mockCart)

      const result = await getUserCart("1")

      expect(getCartByUserId).toHaveBeenCalledWith("1")
      expect(result).toEqual(mockCart)
    })

    it("should return null if cart not found", async () => {
      ;(getCartByUserId as jest.Mock).mockResolvedValue(null)

      const result = await getUserCart("999")

      expect(getCartByUserId).toHaveBeenCalledWith("999")
      expect(result).toBeNull()
    })
  })

  describe("emptyCart", () => {
    it("should clear user cart successfully", async () => {
      ;(clearCart as jest.Mock).mockResolvedValue(true)

      const result = await emptyCart("1")

      expect(clearCart).toHaveBeenCalledWith("1")
      expect(result).toBe(true)
    })

    it("should return false if clearing cart fails", async () => {
      ;(clearCart as jest.Mock).mockResolvedValue(false)

      const result = await emptyCart("999")

      expect(clearCart).toHaveBeenCalledWith("999")
      expect(result).toBe(false)
    })
  })
})

