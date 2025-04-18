"use client"

import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"
import { API_URL } from "../config/constants"
import toast from "react-hot-toast"

const CheckoutPage = () => {
  const { cart, clearCart } = useContext(CartContext)
  const { user, isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isAuthenticated || !user) {
    navigate("/login")
    return null
  }

  if (!cart || cart.items.length === 0) {
    navigate("/cart")
    return null
  }

  const handleCheckout = async () => {
    setIsProcessing(true)

    try {
      const response = await axios.post(`${API_URL}/orders`, {
        userId: user.id,
        email: user.email,
      })

      const orderId = response.data.data.id

      // Clear cart after successful order
      await clearCart()

      toast.success("Order placed successfully!")
      navigate(`/orders/${orderId}`)
    } catch (error) {
      console.error("Error placing order:", error)
      toast.error("Failed to place order. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-primary-300">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="glass border border-primary-700/30 rounded-lg overflow-hidden p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-primary-300">Shipping Information</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">First Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-dark-400 border border-primary-700/30 rounded-md text-white"
                  value={user.name}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Last Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-dark-400 border border-primary-700/30 rounded-md text-white"
                  value={user.lastName}
                  readOnly
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-white/80 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 bg-dark-400 border border-primary-700/30 rounded-md text-white"
                value={user.email}
                readOnly
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-white/80 mb-1">Address</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-dark-400 border border-primary-700/30 rounded-md text-white"
                placeholder="123 Main St"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">City</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-dark-400 border border-primary-700/30 rounded-md text-white" 
                  placeholder="City" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Postal Code</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-dark-400 border border-primary-700/30 rounded-md text-white" 
                  placeholder="12345" 
                />
              </div>
            </div>
          </div>

          <div className="glass border border-primary-700/30 rounded-lg overflow-hidden p-6">
            <h2 className="text-xl font-semibold mb-4 text-primary-300">Payment Information</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-white/80 mb-1">Card Number</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-dark-400 border border-primary-700/30 rounded-md text-white"
                placeholder="**** **** **** ****"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Expiration Date</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-dark-400 border border-primary-700/30 rounded-md text-white" 
                  placeholder="MM/YY" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">CVV</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-dark-400 border border-primary-700/30 rounded-md text-white" 
                  placeholder="123" 
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="glass border border-primary-700/30 rounded-lg overflow-hidden p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-primary-300">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex justify-between">
                  <div>
                    <p className="font-medium text-white">{item.name || "Product"}</p>
                    <p className="text-sm text-white/50">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-accent-400">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-primary-700/30 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-white/70">Subtotal:</span>
                <span className="text-white">${cart.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Shipping:</span>
                <span className="text-white">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Tax (10%):</span>
                <span className="text-white">${(cart.totalAmount * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-primary-700/30">
                <span className="text-white">Total:</span>
                <span className="text-accent-400">${(cart.totalAmount + cart.totalAmount * 0.1).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => navigate("/cart")}
              className="bg-dark-300 hover:bg-dark-200 text-white/80 px-6 py-3 rounded-lg transition-colors"
            >
              Back to Cart
            </button>
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className={`${
                isProcessing ? "bg-primary-400" : "bg-primary-600 hover:bg-primary-700"
              } text-white px-6 py-3 rounded-lg flex items-center transition-colors`}
            >
              {isProcessing ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
