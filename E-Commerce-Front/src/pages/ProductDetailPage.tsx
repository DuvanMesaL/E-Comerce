"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config/constants"
import { CartContext } from "../context/CartContext"
import { AuthContext } from "../context/AuthContext"
import toast from "react-hot-toast"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useContext(CartContext)
  const { isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/products/${id}`)
        setProduct(response.data.data)
      } catch (error) {
        console.error("Error fetching product:", error)
        toast.error("Product not found")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart")
      navigate("/login")
      return
    }

    if (!product) return

    try {
      await addToCart(product.id, quantity, product.price, product.name)
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12 glass border border-primary-700/30 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-primary-300">Product Not Found</h2>
        <p className="text-white/70 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate("/products")}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Back to Products
        </button>
      </div>
    )
  }

  return (
    <div className="glass border border-primary-700/30 rounded-lg overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/2 bg-dark-400 h-64 md:h-auto flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-32 w-32 text-primary-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        <div className="md:w-1/2 p-6">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold mb-2 text-primary-300">{product.name}</h1>
            <span className="bg-primary-900/50 text-primary-300 text-sm px-3 py-1 rounded-full">{product.category}</span>
          </div>

          <p className="text-white/70 mb-6">{product.description}</p>

          <div className="mb-6">
            <span className="text-3xl font-bold text-accent-400">${product.price.toFixed(2)}</span>
            <span className="ml-2 text-sm text-white/50">{product.stock} in stock</span>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-white/80 mb-2">Quantity:</label>
            <div className="flex items-center">
              <button
                onClick={decrementQuantity}
                className="bg-dark-300 hover:bg-dark-200 text-white/80 px-3 py-1 rounded-l transition-colors"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="bg-dark-400 px-4 py-1 text-white/80">{quantity}</span>
              <button
                onClick={incrementQuantity}
                className="bg-dark-300 hover:bg-dark-200 text-white/80 px-3 py-1 rounded-r transition-colors"
                disabled={product.stock <= quantity}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              className={`bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex-grow transition-colors ${
                product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            <button
              onClick={() => navigate("/products")}
              className="bg-dark-300 hover:bg-dark-200 text-white/80 px-6 py-3 rounded-lg transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
