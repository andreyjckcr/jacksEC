"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<"inicio" | "agregarUsuario" | "administrarUsuarios">("inicio");

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !session.user || session.user.rol !== "administrador") {
      router.push("/");
    }
  }, [session, status, router]);

  function handleLogout() {
    signOut({ redirect: false }).then(() => {
      router.push("/");
    });
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
        <Button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
          Cerrar sesión
        </Button>
      </div>

      {/* Menú de opciones */}
      <div className="flex space-x-4 mb-6">
        {["inicio", "agregarUsuario", "administrarUsuarios"].map((section) => (
          <Button
            key={section}
            onClick={() => setActiveSection(section as typeof activeSection)}
            className={`px-4 py-2 rounded-md ${
              activeSection === section ? "bg-gradient-to-br from-[#1B3668] via-[#1B3668] to-[#2a4d8f] text-white" : "bg-gray-300 text-gray-800"
            }`}
          >
            {section === "inicio" ? "Inicio" : section === "agregarUsuario" ? "Agregar Usuario" : "Administrar Usuarios"}
          </Button>
        ))}
      </div>

      {/* Contenido dinámico */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {activeSection === "inicio" && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Bienvenido al panel de administración</h2>
            <Button
              onClick={() => router.push("/entregas")}
              className="bg-gradient-to-br from-[#1B3668] via-[#1B3668] to-[#2a4d8f] text-white rounded-md px-4 py-2"
            >
              Ir a Portal de Gestión de Ventas
            </Button>
          </div>
        )}
        {activeSection === "agregarUsuario" && <AgregarUsuario />}
        {activeSection === "administrarUsuarios" && <AdministrarUsuarios />}
      </div>
    </div>
  );
}

/* 🔹 Componente AgregarUsuario */
function AgregarUsuario() {
  const [formData, setFormData] = useState({
    cedula: "",
    codigoEmpleado: "",
    nombre: "",
    correo: "",
  });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al agregar usuario");

      setMensaje("✅ Usuario agregado correctamente");
      setFormData({ cedula: "", codigoEmpleado: "", nombre: "", correo: "" });
    } catch (error) {
      setMensaje(`❌ ${error instanceof Error ? error.message : "Error inesperado"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Agregar Usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["cedula", "codigoEmpleado", "nombre", "correo"].map((field) => (
          <input
            key={field}
            type={field === "correo" ? "email" : "text"}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[field as keyof typeof formData]}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        ))}
        <Button type="submit" className="w-full bg-gradient-to-br from-[#1B3668] via-[#1B3668] to-[#2a4d8f] text-white p-2" disabled={loading}>
          {loading ? "Agregando..." : "Agregar Usuario"}
        </Button>
      </form>
      {mensaje && <p className="mt-2 text-center">{mensaje}</p>}
    </div>
  );
}

/* 🔹 Componente AdministrarUsuarios */
function AdministrarUsuarios() {
  const [usuarios, setUsuarios] = useState<{ id: number; cedula: string; nombre: string; estado: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  async function fetchUsuarios() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin");
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("❌ Error obteniendo usuarios:", error);
    } finally {
      setLoading(false);
    }
  }

  async function cambiarEstado(id: number, nuevoEstado: string) {
    try {
      const response = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado: nuevoEstado }),
      });

      if (!response.ok) throw new Error("Error al cambiar estado");
      fetchUsuarios();
    } catch (error) {
      console.error("❌ Error al actualizar usuario:", error);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Administrar Usuarios</h2>
      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <div className="max-h-[400px] overflow-y-auto border border-gray-300 rounded">
          <table className="w-full border-collapse text-center">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="p-3">Cédula</th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-3">{user.cedula}</td>
                  <td className="p-3">{user.nombre}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-md text-white ${user.estado === "Activo" ? "bg-green-500" : "bg-red-500"}`}>
                      {user.estado}
                    </span>
                  </td>
                  <td className="p-3">
                    <Button
                      onClick={() => cambiarEstado(user.id, user.estado === "Activo" ? "Inactivo" : "Activo")}
                      className="bg-gradient-to-br from-[#1B3668] via-[#1B3668] to-[#2a4d8f] text-white px-4 py-1 rounded-md"
                    >
                      {user.estado === "Activo" ? "Desactivar" : "Activar"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
