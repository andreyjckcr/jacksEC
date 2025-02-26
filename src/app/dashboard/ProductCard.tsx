"use client";

import Image from "next/image";
import { Button } from "../../../components/ui/button";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCartStore } from "../cartStore/cartStore";
 
interface Product {
  Id: number;
  CodArticulo: string;
  NomArticulo: string;
  Precio: number;
  PrecioImpuesto: number;
  image_url?: string | null;
  CodCabys: string;
  stock: number;
  categorias?: string;
  UnidadCaja?: number | null;
  Peso?: string | null;
  Embalaje?: string | null;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const increaseCartCount = useCartStore.getState().increaseCartCount; // 👈 Obtenemos la función para aumentar el contador

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!session) {
      toast.error("Debes iniciar sesión para agregar productos al carrito.");
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_producto: product.Id,
          cantidad: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar al carrito");
      }

      // ✅ Actualizamos el contador en tiempo real
      increaseCartCount(1);

      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-blue-500 p-4`}
          >
            <div className="flex-shrink-0">
              <Image
                src={product.image_url || "/fallback-image.jpg"}
                alt={product.NomArticulo}
                width={50}
                height={50}
                className="h-12 w-12 rounded-md object-cover"
              />
            </div>
            <div className="flex-1 ml-4">
              <p className="text-sm font-medium text-gray-900">✅ Producto agregado al carrito</p>
              <p className="text-sm text-gray-500">{product.NomArticulo}</p>
              <Link
                href="/cart"
                className="mt-2 text-sm text-blue-600 underline hover:text-blue-800 font-medium"
              >
                Ir al carrito
              </Link>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        ),
        { duration: 2500 }
      );
    } catch (error) {
      toast.error("No se pudo agregar al carrito");
    }
  };

  const handleCardClick = () => {
    router.push(`/product/${product.Id}`);
  };

  const priceToShow = Number(product.Precio) || 0;

  return (
    <div
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer 
                  flex flex-col h-[380px] md:h-[360px] lg:h-[400px]" // Fijamos alturas uniformes
        onClick={handleCardClick}
        >
        {/* Imagen */}
        <div className="relative h-48 w-full flex-shrink-0">
          <Image
            src={product.image_url || "/fallback-image.jpg"}
            alt={product.NomArticulo}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Contenedor del contenido */}
        <div className="p-4 flex flex-col flex-grow justify-between">
          {/* Título del Producto */}
          <h3 className="text-lg font-semibold mb-2 truncate w-full max-w-[180px]">
            {product.NomArticulo.length > 25
              ? product.NomArticulo.substring(0, 25) + "..."
              : product.NomArticulo}
          </h3>

          {/* Categoría */}
          {product.categorias && (
            <p className="text-gray-600 mb-2 text-sm">Categoría: {product.categorias}</p>
          )}

          {/* Unidades (Embalaje) */}
          <p className="text-gray-600 mb-2 text-sm">Unidades: {product.Embalaje ?? ""}</p>

          {/* Contenedor de precio y botón, asegurando que el botón siempre esté al fondo */}
          <div className="mt-auto">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">
                ₡{priceToShow.toFixed(0)}{" "}
                <span className="text-sm ml-1 text-gray-500">(I.V.I)</span>
              </span>
              <Button
                onClick={handleAddToCart}
                className="bg-gradient-to-br from-[#1B3668] to-[#2a4d8f] text-white 
                          hover:from-[#2a4d8f] hover:to-[#1B3668] focus:ring-2 focus:ring-[#1B3668] 
                          focus:outline-none py-3 px-5 w-full"
              >
                Agregar al Carrito
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
}
