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

  const downloadInvoice = async (facturaUrl: string, transactionId: string) => {
    if (!facturaUrl) {
      toast.error("Factura no disponible.");
      return;
    }
  
    try {
      // 📌 Verificar si el archivo realmente existe antes de descargar
      const response = await fetch(facturaUrl, { method: "HEAD" });
      if (!response.ok) {
        toast.error("Factura no encontrada.");
        return;
      }
  
      // 📂 Descargar la factura PDF
      const link = document.createElement("a");
      link.href = facturaUrl;
      link.download = `Factura_${transactionId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      toast.success("Descargando factura...");
    } catch (error) {
      console.error("❌ Error descargando la factura:", error);
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
                  </tr>
                </thead>
                <tbody>
                    {purchaseHistory.map((purchase) => (
                      <tr key={purchase.transaction_id} className="border-t">
                        <td className="px-4 py-2 text-center">{purchase.transaction_id}</td>

                        {/* ✅ Nueva Columna: Lista de Productos Comprados */}
                        <td className="px-4 py-2 text-center">
                          {purchase.productos && purchase.productos.length > 0 ? (
                            <ul>
                              {purchase.productos.map((p, index) => (
                                <li key={index}>{p.nombre} (x{p.cantidad})</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500">Sin productos</p>
                          )}
                        </td>

                        <td className="px-4 py-2 text-center">{new Date(purchase.fecha_hora).toLocaleString()}</td>
                        <td className="px-4 py-2 text-center">₡{purchase.total.toLocaleString()}</td>

                        {/* ✅ Botón de Descargar Factura */}
                        <td className="px-4 py-2 text-center">
                          <button
                            onClick={() => downloadInvoice(purchase.factura_url, purchase.transaction_id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                          >
                            Descargar PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}