"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Navbar } from "../../components/Navbar";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";

interface CartItem {
  id_producto: number;
  cantidad: number;
  productos_ec: {
    NomArticulo: string;
    Precio: number;
    image_url?: string | null;
  };
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bloqueoCompra, setBloqueoCompra] = useState(false);
  const [bloqueoMotivo, setBloqueoMotivo] = useState("");

  // ✅ Obtener carrito desde la API
  useEffect(() => {
    if (!session) return;

    async function fetchCart() {
      try {
        const response = await fetch("/api/cart");
        if (!response.ok) throw new Error("Error al obtener el carrito");

        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error("❌ Error al obtener el carrito:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, [session]);

  // ✅ Validar restricciones de compra
  useEffect(() => {
    async function checkPurchaseRestrictions() {
      try {
        const response = await fetch("/api/checkout/restrictions");
        const result = await response.json();

        if (!response.ok) {
          setBloqueoCompra(true);
          setBloqueoMotivo(result.error || "No puedes realizar la compra en este momento.");
        }
      } catch (error) {
        console.error("❌ Error al verificar restricciones de compra:", error);
      }
    }

    checkPurchaseRestrictions();
  }, []);

  const getTotalPrice = () => {
    return cartItems.reduce((acc, item) => acc + item.cantidad * (item.productos_ec.Precio || 0), 0);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems,
          total: getTotalPrice(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "No se pudo procesar la compra");
      }

      const { transaction_id } = result;

      // 🔽 Descargar usando el transaction_id generado
      const downloadUrl = `/api/invoices/${transaction_id}`;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `Factura_${transaction_id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Compra realizada con éxito ✅", { duration: 3000, position: "top-center" });

      // 🔹 Limpiar carrito y redirigir
      setCartItems([]);
      router.push("/checkout/success");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al procesar la compra ❌";
      toast.error(errorMessage);
      setIsProcessing(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Confirmar Compra</h1>

          {loading ? (
            <p className="text-center text-gray-600">Cargando carrito...</p>
          ) : bloqueoCompra ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
              <p className="font-semibold">⚠️ No puedes comprar en este momento:</p>
              <p>{bloqueoMotivo}</p>
            </div>
          ) : cartItems.length === 0 ? (
            <p className="text-center text-red-600">Tu carrito está vacío.</p>
          ) : (
            <>
              {/* 🔹 Resumen de la Compra */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Resumen de la Compra</h2>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id_producto} className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <Image
                          src={item.productos_ec.image_url || "/fallback-image.jpg"}
                          alt={item.productos_ec.NomArticulo}
                          width={60}
                          height={60}
                          className="rounded-md"
                        />
                        <div>
                          <p className="font-medium">{item.productos_ec.NomArticulo}</p>
                          <p className="text-sm text-gray-500">Cantidad: {item.cantidad}</p>
                        </div>
                      </div>
                      <p className="font-medium text-blue-600">
                        ₡{(item.productos_ec.Precio * item.cantidad).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* 🔹 Total de la Compra */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total</span>
                    <span>₡{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* 🔹 Método de Pago */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Método de Pago</h2>
                <p className="text-gray-600">
                  El monto será deducido de su planilla en el siguiente período de pago.
                </p>
              </div>

              {/* 🔹 Botones de Acción */}
              <div className="flex justify-between">
                {/* Botón de regresar */}
                <Button
                  onClick={handleGoBack}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-3 rounded-lg shadow-md transition-all"
                  size="lg"
                >
                  ← Regresar
                </Button>

                {/* Botón de confirmar compra */}
                <Button
                  onClick={handleCheckout}
                  className="bg-gradient-to-br from-[#1B3668] via-[#1B3668] to-[#2a4d8f] text-white px-6 py-3 rounded-lg shadow-md transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                  disabled={isProcessing || bloqueoCompra}
                >
                  {isProcessing ? "Procesando..." : "Confirmar Compra"}
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
