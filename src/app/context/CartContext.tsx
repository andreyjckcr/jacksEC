"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Product } from "../data/productsMockData"

interface CartItem extends Product {
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, quantity: number) => CartItem
  removeFromCart: (productId: string) => Product | undefined
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addToCart = (product: Product, quantity: number) => {
    let addedItem: CartItem
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.nombre === product.nombre)
      if (existingItem) {
        addedItem = { ...existingItem, quantity: existingItem.quantity + quantity }
        return prevItems.map((item) => (item.nombre === product.nombre ? addedItem : item))
      }
      addedItem = { ...product, quantity }
      return [...prevItems, addedItem]
    })
    return addedItem
  }

  const removeFromCart = (productId: string) => {
    const removedItem = items.find((item) => item.nombre === productId)
    setItems((prevItems) => prevItems.filter((item) => item.nombre !== productId))
    return removedItem
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.nombre === productId ? { ...item, quantity: Math.max(0, quantity) } : item)),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const itemPrice = item.precioConDescuento || item.precio_aproximado_CRC
      return total + itemPrice * item.quantity
    }, 0)
  }

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

