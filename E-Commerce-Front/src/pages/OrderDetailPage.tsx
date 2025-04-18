"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config/constants"
import { AuthContext } from "../context/AuthContext"
import toast from "react-hot-toast"

interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  userId: string
  items: OrderItem[]
  totalItems: number
  totalAmount: number
  status: string
  createdAt: string
  updatedAt: string
}

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user, isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrder = async () => {
      if (!isAuthenticated || !user || !id) return

      try {
        const response = await axios.get(`${API_URL}/orders/${id}`)
        const orderData = response.data.data

        // Check if order belongs to current user
        if (orderData.userId !== user.id) {
          toast.error("You do not have permission to view this order")
          navigate("/orders")
          return
        }

        setOrder(orderData)
      } catch (error) {
        console.error("Error fetching order:", error)
        toast.error("Failed to load order details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [id, user, isAuthenticated, navigate])

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12 glass border border-primary-700/30 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-primary-300">Order Not Found</h2>
        <p className="text-white/70 mb-6">
          The order you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <button
          onClick={() => navigate("/orders")}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Back to Orders
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary-300">Order Details</h1>
        <button
          onClick={() => navigate("/orders")}
          className="bg-dark-300 hover:bg-dark-200 text-white/80 px-4 py-2 rounded transition-colors"
        >
          Back to Orders
        </button>
      </div>

      <div className="glass border border-primary-700/30 rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-primary-300">Order #{order.id.substring(0, 8)}</h2>
              <p className="text-white/50">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <span
              className={`mt-2 md:mt-0 px-4 py-1 rounded-full text-sm font-medium ${
                order.status === "COMPLETED"
                  ? "bg-green-900/50 text-green-400"
                  : order.status === "PROCESSING"
                    ? "bg-primary-900/50 text-primary-400"
                    : order.status === "CANCELLED"
                      ? "bg-red-900/50 text-red-400"
                      : "bg-yellow-900/50 text-yellow-400"
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className="border-t border-primary-700/30 pt-6">
            <h3 className="text-lg font-semibold mb-4 text-primary-300">Items</h3>

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
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-700/30">
                  {order.items.map((item) => (
                    <tr key={item.productId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{item.name || "Product"}</div>
                        <div className="text-sm text-white/50">ID: {item.productId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white/80">${item.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white/80">{item.quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-accent-400">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-primary-700/30 mt-6 pt-6">
            <h3 className="text-lg font-semibold mb-4 text-primary-300">Order Summary</h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/70">Subtotal:</span>
                <span className="text-white">${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Shipping:</span>
                <span className="text-white">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Tax (10%):</span>
                <span className="text-white">${(order.totalAmount * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-primary-700/30">
                <span className="text-white">Total:</span>
                <span className="text-accent-400">${(order.totalAmount + order.totalAmount * 0.1).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailPage
