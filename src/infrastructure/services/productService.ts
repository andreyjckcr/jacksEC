import type { Product } from "@/domain/models/Product"

// Datos de ejemplo
const products: Product[] = [
  {
    id: "1",
    name: "Hamburguesa Clásica",
    price: 5.99,
    description: "Deliciosa hamburguesa con carne, queso, lechuga y tomate",
    imageUrl: "/placeholder.svg?height=200&width=200",
    isNew: false,
    isPromotion: true,
  },
  {
    id: "2",
    name: "Papas Fritas",
    price: 2.99,
    description: "Crujientes papas fritas doradas",
    imageUrl: "/placeholder.svg?height=200&width=200",
    isNew: true,
    isPromotion: false,
  },
  {
    id: "3",
    name: "Refresco",
    price: 1.99,
    description: "Refrescante bebida gaseosa",
    imageUrl: "/placeholder.svg?height=200&width=200",
    isNew: false,
    isPromotion: false,
  },
]

export const productService = {
  async getProducts(): Promise<Product[]> {
    return products
  },

  async getProductById(id: string): Promise<Product | undefined> {
    return products.find((p) => p.id === id)
  },

  async getNewProducts(): Promise<Product[]> {
    return products.filter((p) => p.isNew)
  },

  async getPromotions(): Promise<Product[]> {
    return products.filter((p) => p.isPromotion)
  },
}

