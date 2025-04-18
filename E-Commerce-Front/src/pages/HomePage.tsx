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

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`)
        // Get first 4 products as featured
        setFeaturedProducts(response.data.data.slice(0, 4))
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="glass border border-primary-700/30 rounded-xl mb-12 overflow-hidden transform transition-all duration-500 hover:shadow-lg hover:shadow-primary-900/20">
        <div className="bg-gradient-to-r from-primary-900/90 to-primary-700/80 text-white py-16 px-4 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary-300/10 blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-primary-400/10 blur-xl"></div>
            <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full bg-accent-400/5 blur-xl"></div>
          </div>

          <div className="container mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 neon-text">
              Welcome to Our E-Commerce Store
            </h1>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Discover amazing products at unbeatable prices with our curated selection of premium items
            </p>
            <Link
              to="/products"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold text-lg inline-block transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary-900/50"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary-300 relative">
          <span className="relative z-10">Featured Products</span>
          <span className="absolute inset-0 transform translate-y-1 translate-x-1 text-primary-900/30 z-0">
            Featured Products
          </span>
        </h2>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="glass-dark border border-primary-700/30 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-primary-900/30 transition-all duration-300 transform hover:-translate-y-2 card-hover"
              >
                <div className="bg-dark-400/50 h-48 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-900/0 to-primary-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-primary-400 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary-300"
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
                  <h3 className="text-lg font-semibold mb-2 text-primary-300">{product.name}</h3>
                  <p className="text-white/70 mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-accent-400 font-bold">${product.price.toFixed(2)}</span>
                    <Link
                      to={`/products/${product.id}`}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            to="/products"
            className="text-primary-400 hover:text-primary-300 font-semibold transition-colors inline-flex items-center group"
          >
            View All Products
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1 transform transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary-300 relative">
          <span className="relative z-10">Why Choose Us</span>
          <span className="absolute inset-0 transform translate-y-1 translate-x-1 text-primary-900/30 z-0">
            Why Choose Us
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-dark border border-primary-700/30 p-6 rounded-lg transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-primary-900/20">
            <div className="bg-gradient-to-br from-primary-900/50 to-primary-700/30 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-primary-300 text-center">Quality Products</h3>
            <p className="text-white/70 text-center">
              We ensure that all our products meet the highest quality standards with rigorous testing and verification.
            </p>
          </div>

          <div className="glass-dark border border-primary-700/30 p-6 rounded-lg transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-primary-900/20">
            <div className="bg-gradient-to-br from-primary-900/50 to-primary-700/30 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-primary-300 text-center">Best Prices</h3>
            <p className="text-white/70 text-center">
              We offer competitive prices on all our products with regular discounts and special offers.
            </p>
          </div>

          <div className="glass-dark border border-primary-700/30 p-6 rounded-lg transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-primary-900/20">
            <div className="bg-gradient-to-br from-primary-900/50 to-primary-700/30 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-primary-300 text-center">Fast Shipping</h3>
            <p className="text-white/70 text-center">
              We deliver your orders quickly and efficiently with real-time tracking and delivery updates.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
