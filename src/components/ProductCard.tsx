"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "@/app/context/CartContext"
import { toast } from "react-hot-toast"
import Link from "next/link"
import type { Product } from "@/app/data/productsMockData"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product, 1)
    toast.success(
      <div>
        Producto agregado al carrito
        <Link href="/cart" className="ml-2 underline">
          Ir al carrito
        </Link>
      </div>,
      { duration: 3000 },
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-200 ease-in-out">
      <div className="relative h-48 w-full">
        <Image
          src={product.imageUrl || "/placeholder.svg"}
          alt={product.nombre}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.nombre}</h3>
        {product.descripcion && <p className="text-gray-600 mb-4 text-sm">{product.descripcion}</p>}
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">₡{product.precio_aproximado_CRC}</span>
          <Button onClick={handleAddToCart}>Agregar al Carrito</Button>
        </div>
      </div>
    </div>
  )
}

