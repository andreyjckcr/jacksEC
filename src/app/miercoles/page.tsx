"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "../../../components/ui/button";
import { signOut as nextAuthSignOut } from "next-auth/react";

interface Order {
  id: number;
  transaction_id: string;
  total: number;
  fecha_hora: string;
  estado: string;
  productos: {
    id_producto: number;
    cantidad: number;
    productos_ec: {
      NomArticulo: string;
      Precio: number;
      image_url?: string | null;
    };
  }[];
}

// Cerrar Sesión
  function handleLogout(router: ReturnType<typeof useRouter>) {
        nextAuthSignOut({ redirect: false }).then(() => {
        router.push("/");
      });
    }

export default function MiercolesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;

    async function fetchOrder() {
      try {
        const response = await fetch("/api/miercoles");
        if (!response.ok) throw new Error("Error al obtener el pedido");

        const data = await response.json();
        if (data.pedidos.length > 0) {
          setOrder(data.pedidos[0]); // Solo se muestra el pedido más reciente
        }
      } catch (error) {
        console.error("❌ Error al obtener el pedido:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [session]);

  return (
    <div className="min-h-screen flex">
      {/* Sección Izquierda: Mensaje */}
      {/* Sección Izquierda: Mensaje */}
      <div className="w-1/3 bg-[#e6f0ff] flex flex-col items-center justify-center p-8 shadow-lg">
        <Image
          src="/logoJacks.png"
          alt="Jack's Logo"
          width={200}
          height={100}
          priority
          className="mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-800 text-center">¡Ups, hoy es miércoles!</h1>
        <p className="text-gray-700 text-center mt-4">
          Este día se están alistando todos los pedidos y no podrás realizar ninguna compra. Te invitamos a volver mañana
          jueves a primera hora para realizar tu pedido.
        </p> <br />
        <button
            onClick={() => handleLogout(router)}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Cerrar sesión
          </button>
      </div>

      {/* Sección Derecha: Pedido en proceso */}
      <div className="w-2/3 p-8">
        {loading ? (
          <p className="text-center text-gray-600">Cargando pedido...</p>
        ) : order ? (
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Pedido en proceso</h2>
            <p>¡Este es el pedido que se está preparando en este momento!</p> <br />
            <p><strong>ID de transacción:</strong> {order.transaction_id}</p>
            <p><strong>Fecha:</strong> {new Date(order.fecha_hora).toLocaleString()}</p>
            <p><strong>Total:</strong> ₡{order.total.toFixed(2)}</p>

            {/* Productos */}
            <div className="mt-4 space-y-4 max-h-[300px] overflow-y-auto">
              {order.productos.map((item) => (
                <div key={item.id_producto} className="flex items-center space-x-4 border-b pb-2">
                  <Image
                    src={item.productos_ec.image_url || "/fallback-image.jpg"}
                    alt={item.productos_ec.NomArticulo}
                    width={50}
                    height={50}
                    className="rounded-md"
                  />
                  <div>
                    <p className="font-medium">{item.productos_ec.NomArticulo}</p>
                    <p className="text-gray-600">Cantidad: {item.cantidad}</p>
                    <p className="text-blue-600">₡{(item.productos_ec.Precio * item.cantidad).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Botón para descargar factura */}
            <div className="mt-6">
              <Button
                onClick={() => window.open(`/api/invoices/${order.transaction_id}`, "_blank")}
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg"
              >
                Descargar Factura
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Image
              src="/logoJacks.png"
              alt="Jack's Logo"
              width={250}
              height={125}
              className="opacity-20"
            />
            <h2 className="text-xl font-semibold text-gray-700 mt-4">¡Que triste! No realizaste pedidos esta semana.</h2>
            <p className="text-gray-500 mt-2">
              Si crees que esto es un error, contacta con soporte y evaluaremos tu caso.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
