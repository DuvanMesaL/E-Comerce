import { createNewProduct, getProducts, getProduct, updateStock } from "../product.service"
import { createProduct, getAllProducts, getProductById, updateProductStock } from "../../models/product.model"
import { publishEvent } from "../../lib/kafka"

// Mock the product model
jest.mock("../../models/product.model")
jest.mock("../../lib/kafka")

describe("Product Service", () => {
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

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("createNewProduct", () => {
    it("should create a new product successfully", async () => {
      ;(createProduct as jest.Mock).mockResolvedValue(mockProduct)
      ;(publishEvent as jest.Mock).mockResolvedValue("event-id")

      const result = await createNewProduct(mockProductInput)

      expect(createProduct).toHaveBeenCalledWith(mockProductInput)
      expect(publishEvent).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockProduct)
    })
  })

  describe("getProducts", () => {
    it("should return all products", async () => {
      ;(getAllProducts as jest.Mock).mockResolvedValue([mockProduct])

      const result = await getProducts()

      expect(getAllProducts).toHaveBeenCalled()
      expect(result).toEqual([mockProduct])
    })
  })

  describe("getProduct", () => {
    it("should return a product by ID", async () => {
      ;(getProductById as jest.Mock).mockResolvedValue(mockProduct)

      const result = await getProduct("1")

      expect(getProductById).toHaveBeenCalledWith("1")
      expect(result).toEqual(mockProduct)
    })

    it("should return null if product not found", async () => {
      ;(getProductById as jest.Mock).mockResolvedValue(null)

      const result = await getProduct("999")

      expect(getProductById).toHaveBeenCalledWith("999")
      expect(result).toBeNull()
    })
  })

  describe("updateStock", () => {
    it("should update product stock successfully", async () => {
      ;(updateProductStock as jest.Mock).mockResolvedValue(true)

      const result = await updateStock("1", 2)

      expect(updateProductStock).toHaveBeenCalledWith("1", 2)
      expect(result).toBe(true)
    })

    it("should return false if stock update fails", async () => {
      ;(updateProductStock as jest.Mock).mockResolvedValue(false)

      const result = await updateStock("1", 100)

      expect(updateProductStock).toHaveBeenCalledWith("1", 100)
      expect(result).toBe(false)
    })
  })
})

