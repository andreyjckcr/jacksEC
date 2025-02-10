import { create } from "zustand"
import type { Product } from "../domain/models/Product"

interface CartItem extends Product {
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (product, quantity) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id)
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
          ),
        }
      }
      return { items: [...state.items, { ...product, quantity }] }
    }),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === productId ? { ...item, quantity } : item)),
    })),
  clearCart: () => set({ items: [] }),
}))

