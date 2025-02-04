"use client"

import { Navbar } from "../dashboard/Navbar"
import { ProductCard } from "../dashboard/ProductCard"
import { products } from "../data/productsMockData"

export default function NewProductsPage() {
  const newProducts = products.filter((product) => product.isNew)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Novedades</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.nombre} product={product} />
          ))}
        </div>
      </main>
    </div>
  )
}

