"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../../components/ui/button";
import toast from "react-hot-toast";
import Image from "next/image";

interface PedidoItem {
  id_producto: number;
  cantidad: number;
  productos_ec: {
    NomArticulo: string;
    Precio: number;
    image_url?: string | null;
  };
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
  const [loadingPedido, setLoadingPedido] = useState(true);

  // ✅ Recuperar código empleado desde localStorage
  useEffect(() => {
    const storedCodigoEmpleado = localStorage.getItem("codigo_empleado_despacho");

    if (storedCodigoEmpleado) {
      setCodigoEmpleado(storedCodigoEmpleado);
    }
  }, []);

  // ✅ Obtener datos del empleado y su carrito
  useEffect(() => {
    async function fetchData() {
      if (!codigoEmpleado) return;

      setLoadingEmpleado(true);
      setLoadingPedido(true);

      try {
        // 🔹 Datos del empleado
        const empleadoResponse = await fetch(`/api/despacho/user?codigo=${codigoEmpleado}`);
        const empleadoData = await empleadoResponse.json();

        if (!empleadoResponse.ok) {
          throw new Error("Empleado no encontrado");
        }
        setEmpleadoDatos(empleadoData);

        // 🔹 Carrito del empleado
        const cartResponse = await fetch(`/api/despacho/cart?codigoEmpleado=${codigoEmpleado}`);
        const cartData = await cartResponse.json();

        if (!cartResponse.ok) {
          throw new Error("Error al obtener carrito");
        }
        setPedido(cartData);

        // 🔹 Calcular total
        const nuevoTotal = cartData.reduce(
          (acc: number, item: PedidoItem) =>
            acc + item.cantidad * (item.productos_ec.Precio || 0),
          0
        );
        setTotal(nuevoTotal);
      } catch (error) {
        console.error("❌ Error cargando datos del empleado o carrito:", error);
        toast.error("Error al cargar los datos");
      } finally {
        setLoadingEmpleado(false);
        setLoadingPedido(false);
      }
    }

    fetchData();
  }, [codigoEmpleado]);

  const handleCheckout = async () => {
    setIsProcessing(true);
  
    const pedidoAEnviar = pedido.map((item) => ({
      Id: item.id_producto,
      cantidad: item.cantidad,
    }));
  
    try {
      const response = await fetch("/api/despacho/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigoEmpleado, pedido: pedidoAEnviar, total }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Detalle del error en checkout:", errorData);
        throw new Error(errorData.error || "Error al procesar el pedido");
      }
  
      const data = await response.json();
  
      toast.success("Pedido procesado con éxito ✅");
      localStorage.removeItem("pedido_despacho");
      localStorage.removeItem("codigo_empleado_despacho");
  
      // 📥 Descargar PDF automáticamente
      const link = document.createElement("a");
      link.href = data.pdfBase64;
      link.download = `Factura_${data.transaction_id}.pdf`;
      link.click();
  
      // Redirigir a /despacho/checkout/success con query params
      router.push(
        `/despacho/checkout/success?nombre=${empleadoDatos?.nombre}&codigo=${codigoEmpleado}&correo=${empleadoDatos?.correo}`
      );
    } catch (error) {
      console.error("❌ Error al procesar el pedido:", error);
      toast.error("❌ Error al procesar el pedido");
      setIsProcessing(false);
    }
  };  

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">📦 Confirmar Pedido</h1>

          {loadingEmpleado || loadingPedido ? (
            <p className="text-center text-gray-600">Cargando datos del empleado y pedido...</p>
          ) : !empleadoDatos ? (
            <p className="text-center text-red-600">No se encontraron datos del empleado.</p>
          ) : (
            <>
              {/* 🔹 Datos del Empleado */}
              <div className="bg-gray-50 rounded-lg shadow-md p-4 mb-6">
                <h2 className="text-lg font-semibold mb-2">👤 Datos del Empleado</h2>
                <p>
                  <strong>Nombre:</strong> {empleadoDatos.nombre}
                </p>
                <p>
                  <strong>Correo:</strong> {empleadoDatos.correo}
                </p>
                <p>
                  <strong>Cédula:</strong> {empleadoDatos.cedula}
                </p>
                <p
                  className={
                    empleadoDatos.totalGastado >= 12000 ? "text-red-500" : "text-blue-600"
                  }
                >
                  <strong>Total gastado esta semana:</strong> ₡
                  {empleadoDatos.totalGastado.toLocaleString()} / ₡12,000
                </p>
              </div>

              {/* 🔹 Resumen de la Compra */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {pedido.map((item) => (
                    <div key={item.id_producto} className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <Image
                          src={item.productos_ec.image_url || "/fallback-image.jpg"}
                          alt={item.productos_ec.NomArticulo}
                          width={60}
                          height={60}
                          className="rounded-md object-cover"
                        />
                        <div>
                          <p className="font-medium">{item.productos_ec.NomArticulo}</p>
                          <p className="text-sm text-gray-500">
                            Cantidad: {item.cantidad}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium text-blue-600">
                        ₡{(item.cantidad * item.productos_ec.Precio).toLocaleString()}
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

              {/* 🔹 Botones */}
              <div className="flex justify-between">
                <Button onClick={handleGoBack} className="bg-gray-300">
                  ← Regresar
                </Button>
                <Button
                  onClick={handleCheckout}
                  className="bg-green-600"
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
