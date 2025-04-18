"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
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
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, isAuthenticated } = useContext(AuthContext)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !user) return

      try {
        const response = await axios.get(`${API_URL}/orders/user/${user.id}`)
        setOrders(response.data.data)
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast.error("Failed to load orders")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user, isAuthenticated])

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="text-center py-12 glass border border-primary-700/30 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-primary-300">Please Login</h2>
        <p className="text-white/70 mb-6">You need to be logged in to view your orders.</p>
        <Link to="/login" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors">
          Login
        </Link>
      </div>
    )
  }

  if (orders.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12 glass border border-primary-700/30 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-primary-300">No Orders Found</h2>
        <p className="text-white/70 mb-6">You haven't placed any orders yet.</p>
        <Link to="/products" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-primary-300">Your Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="glass border border-primary-700/30 rounded-lg overflow-hidden hover:shadow-neon-sm transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-primary-300">Order #{order.id.substring(0, 8)}</h2>
                  <p className="text-sm text-white/50">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
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

              <div className="border-t border-primary-700/30 pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/70">Items:</span>
                  <span className="text-white">{order.totalItems}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/70">Total:</span>
                  <span className="font-medium text-accent-400">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4">
                <Link to={`/orders/${order.id}`} className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                  View Order Details →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrdersPage
