"use client";

import { useEffect, useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signOut as nextAuthSignOut } from "next-auth/react";

interface CustomerData {
  nombre: string;
  correo: string;
  cedula: string;
  totalGastado: number;
  codigo_empleado: string;
}

interface Product {
  Id: number;
  NomArticulo: string;
  Precio: number;
  image_url?: string | null;
}

interface CartItem {
  id_producto: number;
  cantidad: number;
  productos_ec: {
    NomArticulo: string;
    Precio: number;
    image_url?: string | null;
  };
}

export default function DespachoPage() {
  const [codigoEmpleado, setCodigoEmpleado] = useState("");
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [pedido, setPedido] = useState<CartItem[]>([]);
  const router = useRouter();

  const LIMITE_SEMANAL = 12000;

  // ✅ Obtener productos desde la API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/despacho");
        if (!response.ok) throw new Error("Error al obtener productos");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("❌ Error al obtener productos:", error);
      }
    }

    fetchProducts();
  }, []);

  // ✅ Buscar usuario por código de empleado y traer su carrito
  const handleSearchUser = async () => {
    if (!codigoEmpleado) {
      toast.error("Ingrese un código de empleado");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/despacho/user?codigo=${codigoEmpleado}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Error al obtener usuario");
      }

      setCustomer(data);
      toast.success(`Usuario encontrado: ${data.nombre}`);

      // ✅ Traer el carrito del empleado
      const cartResponse = await fetch(`/api/despacho/cart?codigoEmpleado=${codigoEmpleado}`);
      const cartData = await cartResponse.json();

      if (cartResponse.ok) {
        setPedido(cartData);
      } else {
        console.warn("⚠️ Carrito vacío o error cargando el carrito.");
        setPedido([]);
      }

      // ✅ Guardar localmente el código del empleado para checkout
      localStorage.setItem("codigo_empleado_despacho", codigoEmpleado);
    } catch (error: any) {
      setCustomer(null);
      setPedido([]);
      toast.error(error.message || "Error buscando el empleado");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Agregar producto al carrito (BD)
  const handleAddToPedido = async (product: Product) => {
    if (!codigoEmpleado) {
      toast.error("Primero busque el empleado");
      return;
    }

    try {
      const response = await fetch("/api/despacho/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigoEmpleado,
          id_producto: product.Id,
          cantidad: 1,
        }),
      });

      if (!response.ok) throw new Error("Error al agregar al carrito");

      // Actualizar visualmente el pedido en el frontend
      setPedido((prevPedido) => {
        const existingProduct = prevPedido.find((item) => item.id_producto === product.Id);

        if (existingProduct) {
          return prevPedido.map((item) =>
            item.id_producto === product.Id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          );
        } else {
          return [
            ...prevPedido,
            {
              id_producto: product.Id,
              cantidad: 1,
              productos_ec: {
                NomArticulo: product.NomArticulo,
                Precio: product.Precio,
                image_url: product.image_url,
              },
            },
          ];
        }
      });

      toast.success(`${product.NomArticulo} agregado al pedido`);
    } catch (error) {
      console.error("❌ Error agregando al carrito:", error);
      toast.error("Error agregando al carrito");
    }
  };

  // ✅ Aumentar cantidad en BD
  const handleIncreaseQuantity = async (id_producto: number) => {
    const item = pedido.find((p) => p.id_producto === id_producto);
    if (!item) return;

    const nuevaCantidad = item.cantidad + 1;
    await handleUpdateQuantity(id_producto, nuevaCantidad);
  };

  // ✅ Disminuir cantidad en BD
  const handleDecreaseQuantity = async (id_producto: number) => {
    const item = pedido.find((p) => p.id_producto === id_producto);
    if (!item) return;

    const nuevaCantidad = item.cantidad - 1;
    if (nuevaCantidad < 1) {
      await handleRemoveFromPedido(id_producto);
    } else {
      await handleUpdateQuantity(id_producto, nuevaCantidad);
    }
  };

  // ✅ Actualizar cantidad en BD
  const handleUpdateQuantity = async (id_producto: number, cantidad: number) => {
    try {
      await fetch("/api/despacho/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigoEmpleado, id_producto, cantidad }),
      });

      setPedido((prevPedido) =>
        prevPedido.map((item) =>
          item.id_producto === id_producto ? { ...item, cantidad } : item
        )
      );
    } catch (error) {
      console.error("❌ Error actualizando cantidad:", error);
      toast.error("Error actualizando cantidad");
    }
  };

  // ✅ Eliminar producto en BD
  const handleRemoveFromPedido = async (id_producto: number) => {
    try {
      await fetch("/api/despacho/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigoEmpleado, id_producto }),
      });

      setPedido((prevPedido) => prevPedido.filter((item) => item.id_producto !== id_producto));
    } catch (error) {
      console.error("❌ Error eliminando producto:", error);
      toast.error("Error eliminando producto");
    }
  };

  // Cerrar Sesión
  function handleLogout() {
        nextAuthSignOut({ redirect: false }).then(() => {
        router.push("/");
      });
    }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📦 Despacho de Pedidos</h1>

        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Cerrar sesión
          </button>

         {/*} <Button
            onClick={() => router.push("/entregas")}
            className="bg-gradient-to-br from-[#1B3668] via-[#1B3668] to-[#2a4d8f] text-white rounded-md"
          >
            Ir a Portal de Gestión de Ventas
          </Button> */}

          <Button
            onClick={() => router.push("/entregas")}
            className="border px-4 py-2 text-center font-medium"
          >
            Ir a Portal de Gestión de Ventas
          </Button>
        </div>
      </div>
  
      {/* 🔹 Buscar usuario */}
      <div className="bg-white p-4 shadow-md rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">👤 Buscar Usuario</h2>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <Input
            type="text"
            placeholder="Código de empleado"
            value={codigoEmpleado}
            onChange={(e) => setCodigoEmpleado(e.target.value)}
          />
          <Button onClick={handleSearchUser} disabled={loading} className="bg-gradient-to-br from-[#1B3668] via-[#1B3668] to-[#2a4d8f] text-white px-4 py-2">
            {loading ? "Buscando..." : "Buscar"}
          </Button>
        </div>
  
        {customer && (
          <div className="mt-4 p-4 border rounded-md bg-gray-50">
            <p>
              <strong>Nombre:</strong> {customer.nombre}
            </p>
            <p>
              <strong>Correo:</strong> {customer.correo || "No registrado"}
            </p>
            <p>
              <strong>Cédula:</strong> {customer.cedula}
            </p>
            <p className={`font-bold ${customer.totalGastado >= LIMITE_SEMANAL ? "text-red-600" : "text-blue-600"}`}>
              <strong>Total gastado esta semana:</strong> ₡{customer.totalGastado.toLocaleString()} / ₡
              {LIMITE_SEMANAL.toLocaleString()}
            </p>
          </div>
        )}
      </div>
  
      {/* 🔹 Tabla de productos */}
      <div className="bg-white p-4 shadow-md rounded-lg mt-6">
        <h2 className="text-xl font-bold mb-4">🛍️ Productos Disponibles</h2>
        <div className="overflow-x-auto">
          <table className="min-w-max w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Imagen</th>
                <th className="border px-4 py-2">Producto</th>
                <th className="border px-4 py-2">Precio</th>
                <th className="border px-4 py-2">Acción</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.Id} className="border-b">
                  <td className="border px-4 py-2 flex justify-center">
                    <img
                      src={product.image_url || "/fallback-image.jpg"}
                      alt={product.NomArticulo}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  </td>
                  <td className="border px-4 py-2">{product.NomArticulo}</td>
                  <td className="border px-4 py-2">₡{Number(product.Precio).toFixed(2)}</td>
                  <td className="border px-4 py-2">
                    <Button
                      onClick={() => handleAddToPedido(product)}
                      className="bg-gradient-to-br from-[#1B3668] via-[#1B3668] to-[#2a4d8f] text-white"
                    >
                      Agregar al Pedido
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  
      {/* 🛒 Resumen del Pedido */}
      <div className="bg-white p-4 shadow-md rounded-lg mt-6">
        <h2 className="text-xl font-bold mb-4">📋 Resumen del Pedido</h2>

        {pedido.length === 0 ? (
          <p className="text-gray-500">No hay productos en el pedido.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Producto</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Cantidad</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Precio Total</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {pedido.map((item) => (
                  <tr key={item.id_producto} className="border-b">
                    {/* Producto */}
                    <td className="border px-4 py-2 flex items-center space-x-3">
                      <img
                        src={item.productos_ec.image_url || "/fallback-image.jpg"}
                        alt={item.productos_ec.NomArticulo}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <span>{item.productos_ec.NomArticulo}</span>
                    </td>

                    {/* Cantidad */}
                    <td className="border px-4 py-2">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleDecreaseQuantity(item.id_producto)}
                          className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                          disabled={item.cantidad <= 1}
                        >
                          -
                        </button>

                        <span className="w-8 text-center font-semibold">{item.cantidad}</span>

                        <button
                          onClick={() => handleIncreaseQuantity(item.id_producto)}
                          className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Precio total por cantidad */}
                    <td className="border px-4 py-2 text-center font-medium">
                      ₡{(item.productos_ec.Precio * item.cantidad).toLocaleString()}
                    </td>

                    {/* Acción (Eliminar) */}
                    <td className="border px-4 py-2 text-center">
                      <button
                        onClick={() => handleRemoveFromPedido(item.id_producto)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
  
      {/* 📌 Botón para procesar compra */}
      <div className="mt-6 flex justify-end">
        <Button
          onClick={() => router.push("/despacho/checkout")}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Procesar Compra
        </Button>
      </div>
    </div>
  );
}
