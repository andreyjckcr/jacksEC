"use client";

import { useEffect, useState } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
  stock: number;
}

interface CartItem extends Product {
  cantidad: number;
}

export default function DespachoPage() {
  const [codigoEmpleado, setCodigoEmpleado] = useState("");
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const LIMITE_SEMANAL = 12000;

  const [products, setProducts] = useState<Product[]>([]);
  const [pedido, setPedido] = useState<CartItem[]>([]);

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

  // ✅ Buscar usuario por código de empleado
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
    } catch (error: any) {
      setCustomer(null);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Agregar producto al pedido
  const handleAddToPedido = (product: Product) => {
    setPedido((prevPedido) => {
      const existingProduct = prevPedido.find((item) => item.Id === product.Id);

      if (existingProduct) {
        return prevPedido.map((item) =>
          item.Id === product.Id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      } else {
        return [...prevPedido, { ...product, cantidad: 1 }];
      }
    });

    toast.success(`${product.NomArticulo} agregado al pedido`);
  };

  // ✅ Aumentar cantidad
  const handleIncreaseQuantity = (Id: number) => {
    setPedido((prevPedido) =>
      prevPedido.map((item) =>
        item.Id === Id ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  };

  // ✅ Disminuir cantidad
  const handleDecreaseQuantity = (Id: number) => {
    setPedido((prevPedido) =>
      prevPedido
        .map((item) =>
          item.Id === Id ? { ...item, cantidad: item.cantidad - 1 } : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  // ✅ Eliminar producto del pedido
  const handleRemoveFromPedido = (Id: number) => {
    setPedido((prevPedido) => prevPedido.filter((item) => item.Id !== Id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">📦 Despacho de Pedidos</h1>

      {/* 🔹 Buscar usuario */}
      <div className="bg-white p-4 shadow-md rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">👤 Buscar Usuario</h2>
        <div className="flex space-x-4">
          <Input
            type="text"
            placeholder="Código de empleado"
            value={codigoEmpleado}
            onChange={(e) => setCodigoEmpleado(e.target.value)}
          />
          <Button onClick={handleSearchUser} disabled={loading} className="bg-blue-600 text-white px-4 py-2">
            {loading ? "Buscando..." : "Buscar"}
          </Button>
        </div>

        {customer && (
          <div className="mt-4 p-4 border rounded-md bg-gray-50">
            <p><strong>Nombre:</strong> {customer.nombre}</p>
            <p><strong>Correo:</strong> {customer.correo || "No registrado"}</p>
            <p><strong>Cédula:</strong> {customer.cedula}</p>
            <p className={`font-bold ${customer.totalGastado >= LIMITE_SEMANAL ? "text-red-600" : "text-blue-600"}`}>
              <strong>Total gastado esta semana:</strong> ₡{customer.totalGastado.toLocaleString()} / ₡{LIMITE_SEMANAL.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* 🔹 Tabla de productos */}
      <div className="bg-white p-4 shadow-md rounded-lg mt-6">
        <h2 className="text-xl font-bold mb-4">🛍️ Productos Disponibles</h2>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Producto</th>
              <th className="border border-gray-300 px-4 py-2">Precio</th>
              <th className="border border-gray-300 px-4 py-2">Stock</th>
              <th className="border border-gray-300 px-4 py-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.Id} className="border-b">
                <td className="border px-4 py-2">{product.NomArticulo}</td>
                <td className="border px-4 py-2">₡{Number(product.Precio).toFixed(2)}</td>
                <td className="border px-4 py-2">{product.stock}</td>
                <td className="border px-4 py-2">
                  <Button onClick={() => handleAddToPedido(product)} className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700">
                    Agregar al Pedido
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🛒 Resumen del Pedido */}
      <div className="bg-white p-4 shadow-md rounded-lg mt-6">
        <h2 className="text-xl font-bold mb-4">📋 Resumen del Pedido</h2>

        {pedido.length === 0 ? (
            <p className="text-gray-500">No hay productos en el pedido.</p>
        ) : (
            <table className="w-full border-collapse border border-gray-300">
            <thead>
                <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Producto</th>
                <th className="border border-gray-300 px-4 py-2">Cantidad</th>
                <th className="border border-gray-300 px-4 py-2">Total</th>
                <th className="border border-gray-300 px-4 py-2">Acción</th>
                </tr>
            </thead>
            <tbody>
                {pedido.map((item) => (
                <tr key={item.Id} className="border-b">
                    <td className="border px-4 py-2">{item.NomArticulo}</td>
                    <td className="border px-4 py-2 flex items-center justify-center space-x-2">
                    {/* 🔽 Botón para reducir cantidad */}
                    <button
                        onClick={() => handleDecreaseQuantity(item.Id)}
                        className="px-2 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        disabled={item.cantidad <= 1} // ❌ No permite bajar de 1
                    >
                        -
                    </button>

                    <span className="mx-2 font-semibold">{item.cantidad}</span>

                    {/* 🔼 Botón para aumentar cantidad */}
                    <button
                        onClick={() => handleIncreaseQuantity(item.Id)}
                        className="px-2 py-1 border rounded bg-gray-200 hover:bg-gray-300"
                    >
                        +
                    </button>
                    </td>

                    {/* 💰 Mostrar total por producto */}
                    <td className="border px-4 py-2">₡{(item.Precio * item.cantidad).toFixed(2)}</td>

                    {/* ❌ Botón para eliminar producto del pedido */}
                    <td className="border px-4 py-2 text-center">
                    <button
                        onClick={() => handleRemoveFromPedido(item.Id)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                    >
                        🗑️
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
        </div>

      {/* 📌 Botón para procesar compra */}
      <div className="mt-6 flex justify-end">
        <Button
          onClick={() => {
            if (!customer) {
              toast.error("Debes buscar y seleccionar un usuario antes de continuar.");
              return;
            }

            if (pedido.length === 0) {
              toast.error("No hay productos en el pedido.");
              return;
            }

            localStorage.setItem("pedido_despacho", JSON.stringify(pedido));
            localStorage.setItem("codigo_empleado_despacho", customer.codigo_empleado);

            router.push("/despacho/checkout");
          }}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Procesar Compra
        </Button>
      </div>
    </div>
  );
}
