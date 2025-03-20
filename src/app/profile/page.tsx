"use client";

import { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

interface User {
  id: number;
  codigo_empleado: string;
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  fecha_registro: string;
  estado: string;
  cedula: string;
  factura_url: string;
}

interface PurchaseHistory {
  transaction_id: string;
  invoice: string;
  fecha_hora: string;
  total: number;
  estado: string;
  factura_url: string;
  productos: { nombre: string; cantidad: number }[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) throw new Error("Error al obtener el perfil");
  
        const data = await response.json();
        console.log("🔍 [DEBUG] Historial de compras recibido en el frontend:", data.historialCompras); // <-- Añadir esto
        setUser(data.user);
        setPurchaseHistory(data.historialCompras);
      } catch (error) {
        console.error("❌ Error obteniendo el perfil:", error);
        toast.error("Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    }
  
    fetchProfile();
  }, []);  

  const handleCancelPedido = async (transactionId: string) => {
    if (!window.confirm("¿Estás seguro de que deseas cancelar este pedido? Esta acción no se puede deshacer.")) {
      return;
    }
  
    try {
      const response = await fetch("/api/pedidos/cancelar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transactionId }),
      });
  
      const data = await response.json();
      if (response.ok) {
        toast.success("Pedido cancelado con éxito.");
        
        // ✅ Actualizar el estado en la UI para reflejar que está cancelado
        setPurchaseHistory((prevHistory) =>
          prevHistory.map((purchase) =>
            purchase.transaction_id === transactionId
              ? { ...purchase, estado: "Cancelado" }
              : purchase
          )
        );
      } else {
        toast.error(data.error || "No se pudo cancelar el pedido.");
      }
    } catch (error) {
      toast.error("Error al cancelar el pedido.");
    }
  };

  function handleLogout() {
    signOut({ redirect: false }).then(() => {
      router.push("/login");
    });
  }
  

  if (loading) {
    return <p className="text-center text-gray-600">Cargando perfil...</p>;
  }

  if (!user) {
    return <p className="text-center text-red-600">Usuario no encontrado.</p>;
  }

  const downloadInvoice = async (transactionId: string) => {
    console.log("🔍 Iniciando descarga de factura con transactionId:", transactionId);
  
    const downloadUrl = `/api/invoices/${transactionId}`;
  
    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error("Factura no encontrada o error al regenerar.");
      }
  
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = url;
      link.download = `Factura_${transactionId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      URL.revokeObjectURL(url);
      toast.success("Factura descargada correctamente.");
    } catch (error) {
      console.error("❌ Error descargando factura:", error);
      toast.error("Error al descargar la factura.");
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Perfil de Usuario</h1>

        {/* 🔹 Datos del Usuario */}
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Información Personal</h2>
          <p className="text-gray-700"><strong>Nombre:</strong> {user.nombre}</p>
          <p className="text-gray-700"><strong>Código Empleado:</strong> {user.codigo_empleado}</p>
          <p className="text-gray-700"><strong>Correo:</strong> {user.correo}</p>
          <p className="text-gray-700"><strong>Teléfono:</strong> {user.telefono}</p>
          <p className="text-gray-700"><strong>Dirección:</strong> {user.direccion || "No especificada"}</p>
          <p className="text-gray-700"><strong>Estado:</strong> {user.estado}</p>
          <p className="text-gray-700"><strong>Cédula:</strong> {user.cedula}</p>
          <p className="text-gray-700"><strong>Fecha Registro:</strong> {new Date(user.fecha_registro).toLocaleDateString()}</p>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4">
            Cerrar sesión
          </button>
        </section>

        {/* 🔹 Historial de Compras */}
<section className="bg-white rounded-lg shadow p-6 mb-6">
  <h2 className="text-xl font-semibold mb-4">Historial de Compras</h2>
  {purchaseHistory.length === 0 ? (
    <p className="text-gray-500">No hay compras registradas.</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-center">ID Transacción</th>
            <th className="px-4 py-2 text-center">Productos</th>
            <th className="px-4 py-2 text-center">Fecha</th>
            <th className="px-4 py-2 text-center">Total</th>
            <th className="px-4 py-2 text-center">Descargar</th>
            <th className="px-4 py-2 text-center">Cancelar</th> {/* 🔹 Nueva columna */}
          </tr>
        </thead>
        <tbody>
          {purchaseHistory.map((purchase) => {
            const fechaPedido = new Date(purchase.fecha_hora);
            const hoy = new Date();
            const diaSemanaHoy = hoy.getDay(); // 0 = Domingo, 1 = Lunes, ..., 4 = Jueves
            let ultimoJueves = new Date();

            if (diaSemanaHoy >= 4) {
              // Si hoy es jueves o después, buscamos el jueves de esta semana
              ultimoJueves.setDate(hoy.getDate() - (diaSemanaHoy - 4));
            } else {
              // Si hoy es antes del jueves, buscamos el jueves de la semana pasada
              ultimoJueves.setDate(hoy.getDate() - (diaSemanaHoy + 3));
            }
            ultimoJueves.setHours(0, 0, 0, 0); // Asegurar que sea el inicio del día

            const esDeLaSemanaActual = fechaPedido >= ultimoJueves;
            const puedeCancelar = esDeLaSemanaActual && purchase.estado !== "Entregado";

            return (
              <tr key={purchase.transaction_id} className="border-t">
                <td className="px-4 py-2 text-center">{purchase.transaction_id}</td>
                <td className="px-4 py-2 text-center">
                  {purchase.productos && purchase.productos.length > 0 ? (
                    <ul>
                      {purchase.productos.map((p, index) => (
                        <li key={index}>{p.nombre} (x{p.cantidad})</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-red-500">⚠️ No hay productos</p>
                  )}
                </td>
                <td className="px-4 py-2 text-center">{fechaPedido.toLocaleString()}</td>
                <td className="px-4 py-2 text-center">₡{purchase.total.toLocaleString()}</td>

                {/* ✅ Botón de Descargar Factura */}
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => downloadInvoice(purchase.transaction_id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Descargar PDF
                  </button>
                </td>

                {/* 🔹 Botón de Cancelar Pedido */}
                <td className="px-4 py-2 text-center">
                {purchase.estado === "Cancelado" ? (
                <span className="px-4 py-2 bg-gray-400 text-white rounded-lg">
                Cancelado
                </span>
               ) : (
                  <button
                onClick={() => handleCancelPedido(purchase.transaction_id)}
                className={`px-4 py-2 rounded-lg transition ${
                   puedeCancelar ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-400 text-gray-700 cursor-not-allowed"
                    }`}
                       disabled={!puedeCancelar}
                         >
                           Cancelar
                            </button>
                       )}
                      </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )}
</section>
      </main>
    </div>
  );
}
