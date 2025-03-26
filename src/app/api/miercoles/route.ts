import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("❌ Usuario no autorizado.");
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    console.log(`🔍 Buscando pedidos para usuario ID: ${session.user.id}`);

    const pedidosPendientes = await prisma.historial_compras_ec.findMany({
        where: {
    id_usuario: Number(session.user.id),
    estado: { in: ["Pedido realizado", "Pedido en proceso"] },
  },
  orderBy: { fecha_hora: "desc" },
  include: {
    productos_comprados: {
      include: {
        productos_ec: {
          select: {
            NomArticulo: true,
            Precio: true,
            image_url: true,
          },
        },
      },
    },
  },
});

    console.log(`✅ Pedidos encontrados para ID ${session.user.id}:`, pedidosPendientes);

    if (!pedidosPendientes.length) {
      return NextResponse.json({ pedidos: [] }, { status: 200 });
    }

    // ✅ Formatear la respuesta
    interface Producto {
      NomArticulo: string;
      Precio: number;
      image_url: string | null;
    }

    interface ProductoDetalle {
      id_producto: number;
      cantidad: number;
      productos_ec: Producto;
    }

    interface Pedido {
      id: number;
      transaction_id: string;
      total: number;
      fecha_hora: Date;
      estado: string;
      productos: ProductoDetalle[];
    }

    const pedidosFormat: Pedido[] = pedidosPendientes.map((pedido: any): Pedido => ({
      id: pedido.id,
      transaction_id: pedido.invoice || "Sin Factura",
      total: Number(pedido.total) || 0,
      fecha_hora: pedido.fecha_hora || new Date(),
      estado: pedido.estado,
      productos: pedido.productos_comprados?.map((p: any): ProductoDetalle => ({
        id_producto: p.id_producto,
        cantidad: p.cantidad,
        productos_ec: {
          NomArticulo: p.productos_ec?.NomArticulo || "Producto Desconocido",
          Precio: p.productos_ec?.Precio || 0,
          image_url: p.productos_ec?.image_url || null,
        },
      })) || [],
    }));

    return NextResponse.json({ pedidos: pedidosFormat }, { status: 200 });

  } catch (error) {
    console.error("❌ Error obteniendo pedidos del miércoles:", error);
    return NextResponse.json(
      { error: "Error al obtener los pedidos", detalle: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
