import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const pedidos = await prisma.historial_compras_ec.findMany({
      include: {
        usuarios_ecommerce: {
          select: {
            nombre: true,
            codigo_empleado: true,
          },
        },
        productos_comprados: {
          include: {
            productos_ec: {
              select: { NomArticulo: true },
            },
          },
        },
      },
      orderBy: { fecha_hora: "desc" },
    });

    const pedidosAdaptados = pedidos.map((pedido) => ({
      id: pedido.id,
      id_usuario: pedido.usuarios_ecommerce.codigo_empleado,
      nombre: pedido.usuarios_ecommerce.nombre,
      fecha: pedido.fecha_hora?.toLocaleString(),
      estado: pedido.estado,
      id_factura: pedido.transaction_id,
      productos: pedido.productos_comprados
        .map((p) => `${p.productos_ec?.NomArticulo} (${p.cantidad} u.)`)
        .join(", "),
    }));

    return NextResponse.json(pedidosAdaptados, { status: 200 });
  } catch (error) {
    console.error("❌ Error obteniendo pedidos:", error);
    return NextResponse.json({ error: "Error obteniendo pedidos" }, { status: 500 });
  }
}
