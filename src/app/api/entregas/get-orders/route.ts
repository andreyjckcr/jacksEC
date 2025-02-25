import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const pedidos = await prisma.pedidos_ec.findMany({
      include: {
        usuarios_ecommerce: {
          select: { nombre: true, codigo_empleado: true },
        },
        facturacion_ec: {
          select: {
            transaction_id: true,
          },
        },
      },
    });

    const pedidosConDetalles = pedidos.map((pedido) => ({
      id: pedido.id,
      id_usuario: pedido.id_usuario,
      nombre: pedido.usuarios_ecommerce.nombre,
      codigo_empleado: pedido.usuarios_ecommerce.codigo_empleado,
      fecha: pedido.fecha,
      estado: pedido.estado,
      id_factura: pedido.id_factura,
      productos: pedido.productos,
      monto: Number(pedido.monto) || 0,
      email_status: pedido.email_status,
      transaction_id: pedido.facturacion_ec?.transaction_id || "N/A",
    }));

    return new NextResponse(JSON.stringify(pedidosConDetalles), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    console.error("❌ Error obteniendo pedidos:", error);
    return NextResponse.json(
      { error: "Error al obtener los pedidos" },
      { status: 500 }
    );
  }
}
