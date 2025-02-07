"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../../components/ui/button";
import toast from "react-hot-toast";
import Image from "next/image";

export default function DespachoCheckout() {
  const router = useRouter();
  const [pedido, setPedido] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [codigoEmpleado, setCodigoEmpleado] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const storedPedido = localStorage.getItem("pedido_despacho");
    const storedCodigoEmpleado = localStorage.getItem("codigo_empleado_despacho");

    if (storedPedido && storedCodigoEmpleado) {
      setPedido(JSON.parse(storedPedido));
      setCodigoEmpleado(storedCodigoEmpleado);
      setTotal(JSON.parse(storedPedido).reduce((acc: number, item: any) => acc + item.Precio * item.cantidad, 0));
    }
  }, []);

  const handleCheckout = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch("/api/despacho/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigoEmpleado, pedido, total }),
      });

      if (!response.ok) throw new Error("Error al procesar la compra");

      toast.success("Pedido procesado con éxito ✅");
      localStorage.removeItem("pedido_despacho");
      localStorage.removeItem("codigo_empleado_despacho");
      router.push("/despacho/success");
    } catch (error) {
      toast.error("❌ Error al procesar la compra");
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">📦 Confirmar Pedido</h1>
      <div className="bg-white p-6 shadow-md rounded-lg">
        {pedido.map((item) => (
          <div key={item.Id} className="flex items-center space-x-4 mb-4">
            <Image src={item.image_url || "/fallback-image.jpg"} alt={item.NomArticulo} width={80} height={80} className="rounded-md" />
            <div>
              <p className="font-semibold">{item.NomArticulo}</p>
              <p className="text-blue-600">₡{(item.Precio * item.cantidad).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={handleCheckout} disabled={isProcessing} className="bg-green-600 text-white w-full mt-6">
        {isProcessing ? "Procesando..." : "Finalizar Compra"}
      </Button>
    </div>
  );
}
