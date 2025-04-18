"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config/constants"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`)
        setProducts(response.data.data)

        // Extract unique categories
        const uniqueCategories = [...new Set(response.data.data.map((product: Product) => product.category))] as string[]
        setCategories(uniqueCategories)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter products by category
  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((product) => product.category === selectedCategory)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-primary-300">Products</h1>

      {/* Category Filter */}
      <div className="mb-6 glass border border-primary-700/30 p-4 rounded-lg">
        <label className="block text-sm font-medium text-white/80 mb-2">Filter by Category:</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategory === "all" 
                ? "bg-primary-600 text-white" 
                : "bg-dark-300 text-white/70 hover:bg-dark-200"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category 
                  ? "bg-primary-600 text-white" 
                  : "bg-dark-300 text-white/70 hover:bg-dark-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="glass border border-primary-700/30 rounded-lg overflow-hidden hover:shadow-neon-sm transition-shadow"
            >
              <div className="bg-dark-400 h-48 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-primary-400"
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
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-primary-300">{product.name}</h3>
                  <span className="bg-primary-900/50 text-primary-300 text-xs px-2 py-1 rounded">{product.category}</span>
                </div>
                <p className="text-white/70 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-accent-400 font-bold">${product.price.toFixed(2)}</span>
                  <Link
                    to={`/products/${product.id}`}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredProducts.length === 0 && (
        <div className="text-center py-8 glass border border-primary-700/30 rounded-lg">
          <p className="text-white/70 text-lg">No products found in this category.</p>
        </div>
      )}
    </div>
  )
}

export default ProductsPage
