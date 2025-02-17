"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../../components/ui/button";
import toast from "react-hot-toast";
import Image from "next/image";
import { Navbar } from "../../../components/Navbar";

interface PedidoItem {
  Id: number;
  NomArticulo: string;
  Precio: number;
  cantidad: number;
  image_url?: string | null;
}

interface EmpleadoDatos {
  nombre: string;
  correo: string;
  cedula: string;
  totalGastado: number;
}

export default function DespachoCheckout() {
  const router = useRouter();
  const [pedido, setPedido] = useState<PedidoItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [codigoEmpleado, setCodigoEmpleado] = useState<string | null>(null);
  const [empleadoDatos, setEmpleadoDatos] = useState<EmpleadoDatos | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingEmpleado, setLoadingEmpleado] = useState(true);

  useEffect(() => {
    const storedPedido = localStorage.getItem("pedido_despacho");
    const storedCodigoEmpleado = localStorage.getItem("codigo_empleado_despacho");

    if (storedPedido && storedCodigoEmpleado) {
      const parsedPedido = JSON.parse(storedPedido);
      setPedido(parsedPedido);
      setCodigoEmpleado(storedCodigoEmpleado);
      setTotal(parsedPedido.reduce((acc: number, item: PedidoItem) => acc + item.Precio * item.cantidad, 0));
    }
  }, []);

  useEffect(() => {
    if (codigoEmpleado) {
      const fetchEmpleadoDatos = async () => {
        try {
          const response = await fetch(`/api/despacho/user?codigo=${codigoEmpleado}`);
          if (!response.ok) throw new Error("Empleado no encontrado");

          const data = await response.json();
          setEmpleadoDatos(data);
        } catch (error) {
          console.error("❌ Error obteniendo datos del empleado:", error);
          toast.error("No se encontraron datos del empleado.");
        } finally {
          setLoadingEmpleado(false);
        }
      }

      fetchEmpleadoDatos();
    }
  }, [codigoEmpleado]);

  const handleCheckout = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch("/api/despacho/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigoEmpleado, pedido, total }),
      });

      if (!response.ok) throw new Error("Error al procesar el pedido");

      toast.success("Pedido procesado con éxito ✅");
      localStorage.removeItem("pedido_despacho");
      localStorage.removeItem("codigo_empleado_despacho");
      router.push("/despacho/success");
    } catch (error) {
      toast.error("❌ Error al procesar el pedido");
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
          <h1 className="text-3xl font-bold mb-8">📦 Confirmar Pedido</h1>

          {loadingEmpleado ? (
            <p className="text-center text-gray-600">Cargando datos del empleado...</p>
          ) : !empleadoDatos ? (
            <p className="text-center text-red-600">No se encontraron datos del empleado.</p>
          ) : (
            <>
              {/* 🔹 Datos del Empleado */}
              <div className="bg-gray-50 rounded-lg shadow-md p-4 mb-6">
                <h2 className="text-lg font-semibold mb-2">👤 Datos del Empleado</h2>
                <p><strong>Nombre:</strong> {empleadoDatos.nombre}</p>
                <p><strong>Correo:</strong> {empleadoDatos.correo}</p>
                <p><strong>Cédula:</strong> {empleadoDatos.cedula}</p>
                <p className={empleadoDatos.totalGastado >= 12000 ? "text-red-500" : "text-blue-600"}>
                  <strong>Total gastado esta semana:</strong> ₡{empleadoDatos.totalGastado.toLocaleString()} / ₡12,000
                </p>
              </div>

              {/* 🔹 Resumen de la Compra */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {pedido.map((item) => (
                    <div key={item.Id} className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <Image
                          src={item.image_url || "/fallback-image.jpg"}
                          alt={item.NomArticulo}
                          width={60}
                          height={60}
                          className="rounded-md"
                        />
                        <div>
                          <p className="font-medium">{item.NomArticulo}</p>
                          <p className="text-sm text-gray-500">Cantidad: {item.cantidad}</p>
                        </div>
                      </div>
                      <p className="font-medium text-blue-600">
                        ₡{(item.Precio * item.cantidad).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* 🔹 Total */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total</span>
                    <span>₡{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* 🔹 Método de Pago */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Método de Pago</h2>
                <p className="text-gray-600">El monto será deducido de la planilla del empleado.</p>
              </div>

              {/* 🔹 Botones */}
              <div className="flex justify-between">
                <Button
                  onClick={handleGoBack}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-3 rounded-lg shadow-md transition-all"
                  size="lg"
                >
                  ← Regresar
                </Button>

                <Button
                  onClick={handleCheckout}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md transition-all hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Procesando..." : "Finalizar Pedido"}
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
