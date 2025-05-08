import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { generateInvoicePDF } from "../../../../../lib/generateInvoice";
import { Buffer } from "buffer";

export async function GET(
  req: NextRequest,
  { params }: { params: { transaction_id: string } }
) {
  try {
    const transactionId = params.transaction_id;

    const compra = await prisma.historial_compras_ec.findUnique({
      where: { transaction_id: transactionId },
      include: {
        productos_comprados: {
          include: { productos_ec: true },
        },
        usuarios_ecommerce: true,
      },
    });

    if (!compra) {
      return NextResponse.json({ error: "Compra no encontrada" }, { status: 404 });
    }

    const cartItems = compra.productos_comprados.map((item) => ({
      cantidad: item.cantidad,
      productos_ec: {
        NomArticulo: item.productos_ec?.NomArticulo || "Producto desconocido",
        Precio: item.productos_ec?.Precio || 0,
      },
    }));

    const pdfBase64 = await generateInvoicePDF(
      compra.transaction_id,
      cartItems,
      Number(compra.total),
      compra.usuarios_ecommerce.nombre,
      compra.id_usuario,
      compra.device || "Desconocido",
      compra.location || "Desconocido",
      compra.fecha_hora ?? new Date()
    );

    const pdfBuffer = Buffer.from(pdfBase64.replace(/^data:application\/pdf;base64,/, ""), "base64");

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=Factura_${transactionId}.pdf`,
      },
    });
  } catch (error) {
    console.error("❌ Error regenerando factura:", error);
    return NextResponse.json({ error: "Error regenerando factura" }, { status: 500 });
  }
}
