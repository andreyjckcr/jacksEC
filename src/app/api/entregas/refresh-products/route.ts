import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const historialCompras = await prisma.historial_compras_ec.findMany({
      include: {
        productos_comprados: {
          include: { productos_ec: true },
        },
        usuarios_ecommerce: {
          select: { nombre: true },
        },
      },
    });

    let pedidosInsertados = 0;

    for (const compra of historialCompras) {
      // Validar si YA existe en pedidos_ec por id_factura
      const pedidoExistente = await prisma.pedidos_ec.findFirst({
        where: { id_factura: compra.id },
      });

      if (pedidoExistente) {
        console.log(
          `Pedido con id_factura ${compra.id} ya existe. Omitiendo...`
        );
        continue;
      }

      // 🚫 Evitar insertar pedidos que no tienen factura
      const facturaExiste = await prisma.facturacion_ec.findUnique({
        where: { id: compra.id },
      });

      if (!facturaExiste) {
        console.log(
          `Factura no encontrada para id_factura ${compra.id}. Pedido omitido.`
        );
        continue;
      }

      const productosTexto = compra.productos_comprados
        .map(
          (prod) => `${prod.productos_ec.NomArticulo} x${prod.cantidad}`
        )
        .join(", ");

      await prisma.pedidos_ec.create({
        data: {
          id_usuario: compra.id_usuario,
          id_factura: facturaExiste.id,
          productos: productosTexto,
          monto: compra.total,
          estado: compra.estado,
          email_status: "Sin notificar",
        },
      });

      pedidosInsertados++;
    }

    return NextResponse.json({
      message: `Pedidos insertados: ${pedidosInsertados}`,
    });
  } catch (error) {
    console.error("❌ Error al refrescar pedidos:", error);
    return NextResponse.json(
      { error: "Error al refrescar pedidos" },
      { status: 500 }
    );
  }
}
