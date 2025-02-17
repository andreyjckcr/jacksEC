"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../../../components/ui/button";
import { toast } from "react-hot-toast";
import { Trash2, Plus, Minus } from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "../../app/cartStore/cartStore";

export default function CartPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const { setCartCount, decreaseCartCount, increaseCartCount } = useCartStore();

  const [showConfirmClearCart, setShowConfirmClearCart] = useState(false);

  interface CartItem {
    id_producto: number;
    cantidad: number;
    productos_ec: {
      NomArticulo: string;
      Precio: number;
      image_url: string;
    };
  }

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const response = await fetch("/api/cart");
      if (!response.ok) throw new Error("Error al obtener el carrito");
      const data = await response.json();
      setCartItems(data);

      // ✅ Actualizar el contador global con el total de cantidades del carrito
      const totalCantidad = data.reduce((sum: number, item: CartItem) => sum + item.cantidad, 0);
      setCartCount(totalCantidad);
    } catch (error) {
      console.error("❌ Error al obtener el carrito:", error);
      toast.error("Error al cargar el carrito");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [session]);

  const handleRemoveFromCart = async (id_producto: number, cantidad: number) => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_producto }),
      });

      if (!response.ok) throw new Error("No se pudo eliminar el producto");

      // Actualizamos el estado local del carrito eliminando el producto
      setCartItems((prev) => prev.filter((item) => item.id_producto !== id_producto));

      // ✅ Disminuir el contador global directamente
      decreaseCartCount(cantidad);

      toast.success("Producto eliminado del carrito");
    } catch (error) {
      console.error("❌ Error al eliminar producto:", error);
      toast.error("Error al eliminar producto");
    }
  };

  const handleUpdateQuantity = async (id_producto: number, nuevaCantidad: number) => {
    const itemActual = cartItems.find((item) => item.id_producto === id_producto);
    if (!itemActual) return;

    const diferencia = nuevaCantidad - itemActual.cantidad; // Ejemplo: antes 3 -> ahora 5 => diferencia: +2

    try {
      if (nuevaCantidad < 1) {
        toast.error("La cantidad no puede ser menor a 1");
        return;
      }

      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_producto, cantidad: nuevaCantidad }),
      });

      if (!response.ok) throw new Error("No se pudo actualizar la cantidad");

      // Actualizamos el estado local del carrito
      setCartItems((prev) =>
        prev.map((item) =>
          item.id_producto === id_producto ? { ...item, cantidad: nuevaCantidad } : item
        )
      );

      // ✅ Ajustamos el contador global en función del cambio (+ o -)
      if (diferencia > 0) {
        increaseCartCount(diferencia);
      } else {
        decreaseCartCount(Math.abs(diferencia));
      }

      toast.success("Cantidad actualizada correctamente");
    } catch (error) {
      console.error("❌ Error al actualizar la cantidad:", error);
      toast.error("Error al actualizar la cantidad");
    }
  };

  const handleClearCart = async () => {
    try {
      const response = await fetch("/api/cart", { method: "DELETE" });
      if (!response.ok) throw new Error("Error al vaciar el carrito");

      setCartItems([]);
      setCartCount(0); // ✅ Reiniciamos el contador global

      toast.success("Carrito vaciado");
      setShowConfirmClearCart(false);
    } catch (error) {
      toast.error("Error al vaciar el carrito");
    }
  };

  if (!session) return <p className="text-center text-red-600">Debes iniciar sesión para ver tu carrito.</p>;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🛒 Tu Carrito</h1>
          <Button
            onClick={() => router.back()}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg"
          >
            ← Regresar
          </Button>
        </div>

        {loading ? (
          <p className="text-center">Cargando carrito...</p>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Image
              src="/logoJacks.png"
              alt="Jack's Logo"
              width={250}
              height={150}
              className="opacity-60 mb-6"
            />
            <h2 className="text-2xl font-semibold text-gray-600 mb-4 text-center">Tu carrito está vacío</h2>
            <p className="text-gray-500 mb-8 text-center max-w-md">
              Explora nuestro catálogo y selecciona los productos que deseas comprar para agregarlos a tu carrito.
            </p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-[#1B3668] hover:bg-[#2a4d8f] text-white px-6 py-3 rounded-lg"
            >
              Ver productos
            </Button>
          </div>
        ) : (
          <div className="max-h-[500px] overflow-y-auto space-y-4 bg-white rounded-lg shadow-md p-4">
            {cartItems.map((item) => (
              <div key={item.id_producto} className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-4">
                  <Image
                    src={item.productos_ec.image_url || "/fallback-image.jpg"}
                    alt={item.productos_ec.NomArticulo}
                    width={80}
                    height={80}
                    className="rounded-md"
                  />
                  <div>
                    <h3 className="font-bold">{item.productos_ec.NomArticulo}</h3>
                    <p className="text-gray-500">₡{Number(item.productos_ec.Precio || 0).toFixed(2)}</p>
                  </div>
                </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex items-center justify-center w-8 h-8 p-0"
                      onClick={() => handleUpdateQuantity(item.id_producto, item.cantidad - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-center w-8">{item.cantidad}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex items-center justify-center w-8 h-8 p-0"
                      onClick={() => handleUpdateQuantity(item.id_producto, item.cantidad + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="flex items-center justify-center w-8 h-8 p-0 text-red-500 hover:text-red-600"
                      onClick={() => handleRemoveFromCart(item.id_producto, item.cantidad)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
            ))}
            <div className="flex justify-between items-center mt-4">
              <Button
                onClick={() => setShowConfirmClearCart(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg"
              >
                Vaciar carrito
              </Button>
              <span className="text-xl font-bold text-gray-700">
                Total: ₡{cartItems.reduce((acc, item) => acc + item.cantidad * item.productos_ec.Precio, 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {cartItems.length > 0 && (
          <Button
            className="w-full md:w-auto bg-[#1B3668] hover:bg-[#2a4d8f] text-white px-6 py-3 mt-4 rounded-lg"
            size="lg"
            onClick={() => router.push("/checkout")}
          >
            Proceder a la compra
          </Button>
        )}
      </div>

      {/* 🔥 Diálogo de confirmación centrado */}
      {showConfirmClearCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
            <h3 className="text-lg font-bold mb-4 text-red-600">¿Vaciar el carrito?</h3>
            <p className="text-gray-600">Esta acción no se puede deshacer.</p>
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setShowConfirmClearCart(false)}>
                Cancelar
              </Button>
              <Button onClick={handleClearCart} className="bg-red-500 hover:bg-red-600 text-white">
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
