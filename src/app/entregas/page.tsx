"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

type OrderStatus = "Pedido realizado" | "Pedido en proceso" | "Listo para entrega" | "Entregado";

interface Pedido {
  id: number;
  id_usuario: number;
  nombre: string;
  fecha: string;
  codigo_empleado?: string;
  estado: OrderStatus;
  id_factura: number;
  productos: string;
  monto: number;
  email_status: string;
  transaction_id: string;
}

export const dynamic = "force-dynamic";

export default function EntregasPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isAllowed, setIsAllowed] = useState(false);

  const [activeTab, setActiveTab] = useState<OrderStatus>("Pedido realizado");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loadingPedidoId, setLoadingPedidoId] = useState<number | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      const userRole = session?.user?.rol;
      if (userRole === "admin" || userRole === "despachante") {
        setIsAllowed(true);
      } else {
        toast.error("No tienes permisos para acceder a esta página.");
        router.push("/");
      }
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <p>Cargando sesión...</p>;
  }

  if (!isAllowed) {
    return null; // Oculta el contenido mientras redirige
  }

  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const factura = formData.get("factura") as string;
    const empleado = formData.get("empleado") as string;
    const codigoEmpleado = formData.get("codigoEmpleado") as string;
    const transactionId = formData.get("transactionId") as string;
    const fechaInicio = formData.get("fechaInicio") as string;
    const fechaFin = formData.get("fechaFin") as string;
    const precioMin = formData.get("precioMin") as string;
    const precioMax = formData.get("precioMax") as string;

    const minPrice = precioMin ? parseFloat(precioMin) : null;
    const maxPrice = precioMax ? parseFloat(precioMax) : null;

    const filtered = pedidos.filter((pedido) => {
      const cumpleFactura = !factura || pedido.id_factura?.toString().includes(factura);
      const cumpleEmpleado = !empleado || pedido.id_usuario.toString().includes(empleado);
      const cumpleCodigoEmpleado =
        !codigoEmpleado || pedido.codigo_empleado?.toLowerCase().includes(codigoEmpleado.toLowerCase());
      const cumpleTransaction = !transactionId || pedido.transaction_id.includes(transactionId);
      const cumpleFechaInicio = !fechaInicio || new Date(pedido.fecha) >= new Date(fechaInicio);
      const cumpleFechaFin = !fechaFin || new Date(pedido.fecha) <= new Date(fechaFin);

      const cumplePrecioMin = minPrice === null || pedido.monto >= minPrice;
      const cumplePrecioMax = maxPrice === null || pedido.monto <= maxPrice;

      return (
        cumpleFactura &&
        cumpleEmpleado &&
        cumpleCodigoEmpleado &&
        cumpleTransaction &&
        cumpleFechaInicio &&
        cumpleFechaFin &&
        cumplePrecioMin &&
        cumplePrecioMax
      );
    });

    setPedidos(filtered);
  };

  const fetchPedidos = async () => {
    try {
      const response = await fetch("/api/entregas/get-orders");
      if (!response.ok) throw new Error("Error al obtener pedidos");

      const data = await response.json();
      setPedidos(data);
      toast.success("Pedidos cargados correctamente 🚚");
    } catch (error) {
      console.error("❌ Error cargando pedidos:", error);
      toast.error("Error cargando pedidos");
    }
  };

  const handleRefreshPedidos = async () => {
    try {
      const res = await fetch("/api/entregas/refresh-products", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al refrescar pedidos");

      toast.success(data.message || "Pedidos actualizados correctamente");
      fetchPedidos();
    } catch (error) {
      toast.error("Error al refrescar pedidos");
      console.error("❌ Error al refrescar pedidos:", error);
    }
  };

  const handleChangeEstado = async (pedidoId: number, nuevoEstado: OrderStatus) => {
    setLoadingPedidoId(pedidoId);
    try {
      const res = await fetch("/api/entregas/change-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pedidoId, nuevoEstado }),
      });
  
      if (!res.ok) throw new Error("No se pudo actualizar el estado");
  
      const data = await res.json();
      toast.success("Estado actualizado correctamente");
  
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulación de carga 1 seg
      
      // **Asegurar que se actualice el frontend**
      fetchPedidos();  // Vuelve a obtener los pedidos desde la BD
  
    } catch (error) {
      console.error("❌ Error actualizando estado:", error);
      toast.error("Error al actualizar el estado");
    } finally {
      setLoadingPedidoId(null);
    }
  };  

  const pedidosFiltrados = pedidos.filter((pedido) => pedido.estado === activeTab);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-6">Gestión de Entregas</h1>
        <Button
          onClick={() => router.push("/despacho")}
          className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg"
        >
          Regresar a Despacho de Productos
        </Button>
      </div>

        <div className="flex justify-between items-center mb-4">
          <Button
            onClick={fetchPedidos}
            className="bg-gradient-to-br from-[#1B3668] via-[#1B3668] to-[#2a4d8f] text-white"
          >
            Cargar Pedidos
          </Button>
          <Button
            onClick={handleRefreshPedidos}
            className="bg-gradient-to-br from-[#1B3668] via-[#1B3668] to-[#2a4d8f] text-white"
          >
            Refrescar Pedidos
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Input id="factura" name="factura" placeholder="ID - Factura" />
            <Input id="codigoEmpleado" name="codigoEmpleado" placeholder="Código de Empleado" />
            <Input id="empleado" name="empleado" placeholder="ID - Empleado" />
            <Input id="transactionId" name="transactionId" placeholder="ID - Transacción" />
            <div>
                <Label htmlFor="precioMin">Precio Mínimo</Label>
                <Input type="number" id="precioMin" name="precioMin" min="0" placeholder="Mínimo ₡" />
              </div>

              <div>
                <Label htmlFor="precioMax">Precio Máximo</Label>
                <Input type="number" id="precioMax" name="precioMax" min="0" placeholder="Máximo ₡" />
              </div>
            <div>
              <Label htmlFor="fechaInicio">Fecha Inicio</Label>
              <Input type="date" id="fechaInicio" name="fechaInicio" />
            </div>
            <div>
              <Label htmlFor="fechaFin">Fecha Fin</Label>
              <Input type="date" id="fechaFin" name="fechaFin" />
            </div>

            <Button
              type="submit"
              className="bg-gradient-to-br from-[#1B3668] via-[#1B3668] to-[#2a4d8f] text-white col-span-full"
            >
              Aplicar Filtros
            </Button>
            <Button
              type="reset"
              variant="outline"
              className="border border-gray-300  bg-red-600 text-white flex-1 hover:bg-red-700"
              onClick={fetchPedidos}
            >
              Limpiar Filtros y Aplicar
            </Button>
          </form>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {["Pedido realizado", "Pedido en proceso", "Listo para entrega", "Entregado"].map((status) => (
            <Button
              key={status}
              onClick={() => setActiveTab(status as OrderStatus)}
              className={`bg-gradient-to-br ${
                activeTab === status
                  ? "from-[#1B3668] via-[#1B3668] to-[#2a4d8f] text-white"
                  : "bg-gray-200 text-black"
              } hover:opacity-80`}
            >
              {status}
            </Button>
          ))}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Factura</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>ID Transacción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pedidosFiltrados.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell>{pedido.id}</TableCell>
                <TableCell>{pedido.id_usuario}</TableCell>
                <TableCell>{pedido.nombre}</TableCell>
                <TableCell>{pedido.fecha}</TableCell>
                <TableCell>
                  <Select
                    disabled={loadingPedidoId === pedido.id}
                    onValueChange={(value) => handleChangeEstado(pedido.id, value as OrderStatus)}
                    defaultValue={pedido.estado}
                  >
                    <SelectTrigger className={`w-[180px] ${loadingPedidoId === pedido.id ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <SelectValue placeholder="Cambiar estado" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-300 rounded-lg shadow-md w-[240px]">
                      {["Pedido realizado", "Pedido en proceso", "Listo para entrega", "Entregado"].map((estado) => (
                        <SelectItem
                          key={estado}
                          value={estado}
                          className="hover:bg-[#1B3668] hover:text-white data-[state=checked]:bg-[#1B3668] data-[state=checked]:text-white px-5 py-2 cursor-pointer relative"
                        >
                          {estado}
                          {/* Esto oculta el check interno */}
                          <span className="absolute right-2 hidden">✔️</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {loadingPedidoId === pedido.id && (
                    <div className="mt-1 text-center">
                      <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-500 border-opacity-50"></span>
                    </div>
                  )}
                </TableCell>
                <TableCell>₡{pedido.monto ? Number(pedido.monto).toFixed(2) : "0.00"}</TableCell>
                <TableCell>{pedido.transaction_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  );
}
