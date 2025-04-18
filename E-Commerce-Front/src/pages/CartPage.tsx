"use client"

import { useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { AuthContext } from "../context/AuthContext"

const CartPage = () => {
  const { cart, isLoading, removeFromCart } = useContext(CartContext)
  const { isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-12 glass border border-primary-700/30 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-primary-300">Your Cart is Empty</h2>
        <p className="text-white/70 mb-6">Looks like you haven't added any products to your cart yet.</p>
        <Link to="/products" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-primary-300">Your Cart</h1>

      <div className="glass border border-primary-700/30 rounded-lg overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-primary-700/30">
            <thead className="bg-dark-400">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider"
                >
                  Quantity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-700/30">
              {cart.items.map((item) => (
                <tr key={item.productId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-dark-300 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-primary-400"
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
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{item.name || "Product"}</div>
                        <div className="text-sm text-white/50">ID: {item.productId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white/80">${item.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white/80">{item.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-accent-400">${(item.price * item.quantity).toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => removeFromCart(item.productId)} className="text-primary-400 hover:text-primary-300 transition-colors">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass border border-primary-700/30 rounded-lg overflow-hidden p-6 mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-white/70">Subtotal:</span>
          <span className="font-medium text-white">${cart.totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-white/70">Shipping:</span>
          <span className="font-medium text-white">$0.00</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-white/70">Tax:</span>
          <span className="font-medium text-white">${(cart.totalAmount * 0.1).toFixed(2)}</span>
        </div>
        <div className="border-t border-primary-700/30 my-4"></div>
        <div className="flex justify-between">
          <span className="text-lg font-bold text-white">Total:</span>
          <span className="text-lg font-bold text-accent-400">
            ${(cart.totalAmount + cart.totalAmount * 0.1).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex justify-between">
        <Link to="/products" className="bg-dark-300 hover:bg-dark-200 text-white/80 px-6 py-3 rounded-lg transition-colors">
          Continue Shopping
        </Link>
        <Link to="/checkout" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
}

export default CartPage
