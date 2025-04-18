"use client"

import { createContext, useState, useEffect, useContext, type ReactNode } from "react"
import axios from "axios"
import { API_URL } from "../config/constants"
import { AuthContext } from "./AuthContext"
import toast from "react-hot-toast"

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
}

interface Cart {
  id: string
  userId: string
  items: CartItem[]
  totalItems: number
  totalAmount: number
}

interface CartContextType {
  cart: Cart | null
  isLoading: boolean
  addToCart: (productId: string, quantity: number, price: number, name: string) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
  fetchCart: () => Promise<void>
}

export const CartContext = createContext<CartContextType>({
  cart: null,
  isLoading: false,
  addToCart: async () => {},
  removeFromCart: async () => {},
  clearCart: async () => {},
  fetchCart: async () => {},
})

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      setCart(null)
    }
  }, [user])

  const fetchCart = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const response = await axios.get(`${API_URL}/cart/${user.id}`)
      setCart(response.data.data)
    } catch (error) {
      console.error("Error fetching cart:", error)
      // If cart doesn't exist yet, that's okay
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = async (productId: string, quantity: number, price: number, name: string) => {
    if (!user) {
      toast.error("Please login to add items to cart")
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post(`${API_URL}/cart/items`, {
        userId: user.id,
        productId,
        quantity,
        price,
        name,
      })

      setCart(response.data.data)
      toast.success("Item added to cart")
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add item to cart")
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (productId: string) => {
    if (!user || !cart) return

    setIsLoading(true)
    try {
      const response = await axios.delete(`${API_URL}/cart/items/${productId}`, {
        data: {
          userId: user.id,
          email: user.email,
        },
      })

      setCart(response.data.data)
      toast.success("Item removed from cart")
    } catch (error) {
      console.error("Error removing from cart:", error)
      toast.error("Failed to remove item from cart")
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async () => {
    if (!user) return

    setCart(null)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
