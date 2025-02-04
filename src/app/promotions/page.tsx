"use client"

import { Navbar } from "../dashboard/Navbar"
import { ProductCard } from "../dashboard/ProductCard"
import { products } from "../data/productsMockData"

export default function PromotionsPage() {
  const promotions = products.filter((product) => product.descuento)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Promociones</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((product) => (
            <ProductCard key={product.nombre} product={product} />
          ))}
        </div>
      </main>
    </div>
  )
}

