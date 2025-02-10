import type { Product } from "../../domain/models/Product"
import { useCartStore } from "../../context/cartContext"
import { Button } from "./Button"
import Image from "next/image"
import Link from "next/link"
import type React from "react" // Added import for React

interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore()

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      <Image
        src={product.imageUrl || "/placeholder.svg"}
        alt={product.name}
        width={200}
        height={200}
        className="w-full"
      />
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2">{product.name}</h3>
        <p className="text-gray-700 text-base mb-2">{product.description}</p>
        <p className="text-gray-900 font-bold text-xl mb-2">${product.price.toFixed(2)}</p>
        <div className="flex justify-between items-center">
          <Link href={`/product/${product.id}`}>
            <Button variant="secondary">Ver Detalles</Button>
          </Link>
          <Button onClick={() => addItem(product, 1)}>Agregar al Carrito</Button>
        </div>
      </div>
    </div>
  )
}

