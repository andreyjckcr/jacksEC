import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { generateInvoicePDF } from "../../../../../lib/generateInvoice";

export async function GET(
  req: NextRequest,
  { params }: { params: { transaction_id: string } }
) {
  try {
    const compra = await prisma.historial_compras_ec.findUnique({
      where: { transaction_id: params.transaction_id },
      include: {
        productos_comprados: {
          include: { productos_ec: true },
        },
        usuarios_ecommerce: true,
      },
    });

    if (!compra) {
      console.error("❌ Compra no encontrada con transaction_id:", params.transaction_id);
      return NextResponse.json({ error: "Compra no encontrada" }, { status: 404 });
    }

    const cartItems = compra.productos_comprados.map((item) => ({
      cantidad: item.cantidad,
      productos_ec: {
        NomArticulo: item.productos_ec?.NomArticulo || "Producto desconocido",
        Precio: item.productos_ec?.Precio || 0,
      },
    }));

    const pdfUrl = await generateInvoicePDF(
      compra.transaction_id,
      cartItems,
      Number(compra.total),
      compra.usuarios_ecommerce.nombre,
      compra.id_usuario,
      compra.device || "Unknown",
      compra.location || "Unknown",
      compra.fecha_hora
    );     

    return NextResponse.json({ pdfUrl }, { status: 200 });
  } catch (error) {
    console.error("❌ Error regenerando factura:", error);
    return NextResponse.json({ error: "Error regenerando factura" }, { status: 500 });
  }
}
