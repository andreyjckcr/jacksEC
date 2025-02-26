"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "../../../../components/ui/button";
import { Navbar } from "../../../components/Navbar";
import { toast } from "react-hot-toast";
import { useCartStore } from "../../cartStore/cartStore";

interface Product {
  Id: number;
  NomArticulo: string;
  Precio: number;
  image_url?: string | null;
  categorias?: string;
  Embalaje?: string | null; // ✅ Se reemplaza stock por Embalaje
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState<number>(1);
  const increaseCartCount = useCartStore.getState().increaseCartCount;

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) throw new Error("Error al obtener el producto");
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("❌ Error al obtener el producto:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!session) {
      toast.error("Debes iniciar sesión para agregar productos al carrito.");
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_producto: product?.Id,
          cantidad: quantity,
        }),
      });

      if (!response.ok) throw new Error("No se pudo agregar al carrito");

      increaseCartCount(quantity);
      toast.success("Producto agregado al carrito 🛒");
    } catch (error) {
      toast.error("Error al agregar producto");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!product) return <p>Producto no encontrado.</p>;

  function handleGoBack() {
    router.back();
  }

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <Image
              src={product.image_url || "/fallback-image.jpg"}
              alt={product.NomArticulo}
              width={400}
              height={400}
              className="rounded-lg object-cover mx-auto shadow-md"
            />
            <div className="p-6 bg-gray-50 rounded-lg shadow-md">
              <h1 className="text-3xl font-bold mb-4 text-gray-900">{product.NomArticulo}</h1>
              <p className="text-lg text-gray-700 mb-4">
                Categoría: <span className="font-semibold">{product.categorias || "Sin Categoría"}</span>
              </p>

              {/* ✅ Agregamos la leyenda I.V.I. al lado del precio */}
              <p className="text-xl font-semibold text-blue-600 mb-4">
                ₡{typeof product.Precio === "number" ? product.Precio.toFixed(2) : "0.00"}{" "}
                <span className="text-sm ml-1 text-gray-500">(I.V.I)</span>
              </p>

              {/* ✅ Mostramos Embalaje en lugar de stock */}
              <p className="text-gray-600 mb-4">
                Unidades: <span className="font-semibold">{product.Embalaje ?? ""}</span>
              </p>

              {/* Sección para aumentar/disminuir la cantidad */}
              <div className="flex items-center space-x-4 mb-4">
                <Button
                  variant="outline"
                  className="w-10 h-10 flex items-center justify-center"
                  onClick={handleDecrease}
                >
                  -
                </Button>
                <span className="text-center w-8">{quantity}</span>
                <Button
                  variant="outline"
                  className="w-10 h-10 flex items-center justify-center"
                  onClick={handleIncrease}
                >
                  +
                </Button>
              </div>

              {/* Botones principales */}
              <div className="flex flex-col md:flex-row gap-4">
                <Button
                  onClick={handleGoBack}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-3 rounded-lg shadow-md transition-all w-full md:w-auto"
                  size="lg"
                >
                  ← Regresar
                </Button>
                <Button
                  onClick={handleAddToCart}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full md:w-auto"
                >
                  Agregar al Carrito
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
