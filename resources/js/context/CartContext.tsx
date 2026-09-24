import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../services/api.js'
import { useAuth } from './AuthContext.js'

interface CartContextType {
  itemCount: number
  refreshCartCount: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const [itemCount, setItemCount] = useState(0)

  const refreshCartCount = useCallback(async () => {
    if (!isAuthenticated || user?.role !== 'customer') {
      setItemCount(0)
      return
    }
    try {
      const cart = await api.customer.cart.get()
      setItemCount(cart.items.reduce((sum, item) => sum + item.quantity, 0))
    } catch {
      setItemCount(0)
    }
  }, [isAuthenticated, user?.role])

  useEffect(() => {
    refreshCartCount()
  }, [refreshCartCount])

  return (
    <CartContext.Provider value={{ itemCount, refreshCartCount }}>{children}</CartContext.Provider>
  )
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
