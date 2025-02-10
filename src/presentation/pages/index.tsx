import { useState, useEffect } from "react"
import { Navbar } from "../../presentation/components/Navbar"
import { ProductCard } from "../../presentation/components/ProductCard"
import { productService } from "../../infrastructure/services/productService"
import type { Product } from "../../domain/models/Product"

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [promotions, setPromotions] = useState<Product[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const allProducts = await productService.getProducts()
      const newProds = await productService.getNewProducts()
      const promos = await productService.getPromotions()

      setProducts(allProducts)
      setNewProducts(newProds)
      setPromotions(promos)
    }

    fetchData()
  }, [])

  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Bienvenido a Jack's E-commerce</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Novedades</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Promociones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Todos los Productos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

