"use client";

import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";

export default function ExportarDatos() {
  const [datos, setDatos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Función para cargar datos desde el endpoint (GET)
  async function handleCargarDatos() {
    setLoading(true);
    setError("");
    setMensaje("");

    try {
      const response = await fetch("/api/export-data");
      if (!response.ok) throw new Error("Error al cargar datos");
      const json = await response.json();
      setDatos(json.data || []);
      setMensaje("Datos cargados correctamente");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  // Al montar, cargamos los datos automáticamente
  useEffect(() => {
    handleCargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Función para exportar (hace POST a /api/export-data)
  async function handleExportar() {
    setMensaje("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/export-data", { method: "POST" });
      if (!res.ok) throw new Error("Error al exportar datos");
      const json = await res.json();
      setMensaje(json.message || "Datos exportados correctamente");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Exportar Datos</h2>
      {loading && <p>Cargando datos...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {mensaje && <p className="text-green-500">{mensaje}</p>}

      {/* Botón para cargar datos manualmente (GET) */}
      <div className="flex gap-4 mb-4">
        <Button
          onClick={handleCargarDatos}
          className="flex-1 bg-gradient-to-br from-[#1B3668] via-[#1B3668] to-[#2a4d8f] text-white p-2"
          disabled={loading}
        >
          Cargar Datos
        </Button>

        <Button
          onClick={handleExportar}
          className="flex-1 bg-gradient-to-br from-[#1B3668] via-[#1B3668] to-[#2a4d8f] text-white p-2"
          disabled={loading}
        >
          Exportar
        </Button>
      </div>
      
      {/* Tabla con los datos */}
      {!loading && !error && datos.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Código Empleado</th>
                <th className="p-2">Cod. Producto</th>
                <th className="p-2">Cantidad</th>
                <th className="p-2">Fecha Pedido</th>
                <th className="p-2">Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2">{item.codigoEmpleado}</td>
                  <td className="p-2">{item.codigoProducto}</td>
                  <td className="p-2">{item.cantidad}</td>
                  <td className="p-2">
                    {new Date(item.fechaPedido).toLocaleString()}
                  </td>
                  <td className="p-2">{item.transactionId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
