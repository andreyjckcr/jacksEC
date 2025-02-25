import { NextRequest, NextResponse } from "next/server";
import { sendConfirmationEmail } from "../../../../lib/emailService";
import { generateInvoicePDF } from "../../../../lib/generateInvoice";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { prisma } from "../../../../lib/prisma";
import { Buffer } from "buffer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { cartItems, total } = await req.json();
    const transaction_id = `INV-${Math.random().toString(36).substr(2, 9)}`;
    const userAgent = req.headers.get("user-agent") || "Desconocido";
    const userId = Number(session.user.id);

    const user = await prisma.usuarios_ecommerce.findUnique({
      where: { id: userId },
      select: { nombre: true, correo: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const totalGastado = await prisma.historial_compras_ec.aggregate({
      where: {
        id_usuario: userId,
        fecha_hora: { gte: startOfWeek },
        estado: { in: ["Pedido realizado", "Pedido en proceso"] },
      },
      _sum: { total: true },
    });

    const montoGastado = Number(totalGastado._sum.total) || 0;
    const totalCompra = Number(total) || 0;

    if (montoGastado + totalCompra > 12000) {
      return NextResponse.json(
        {
          error: `No puedes realizar esta compra porque superarías el límite semanal de ₡12,000. Ya has gastado ₡${montoGastado.toFixed(2)}.`,
        },
        { status: 400 }
      );
    }

    const pdfBase64 = await generateInvoicePDF(
      transaction_id,
      cartItems,
      total,
      user.nombre,
      userId,
      userAgent,
      "Online",
      new Date()
    );

    const pdfBuffer = Buffer.from(pdfBase64.replace(/^data:application\/pdf;base64,/, ""), "base64");

    const nuevaCompra = await prisma.historial_compras_ec.create({
      data: {
        id_usuario: userId,
        transaction_id,
        fecha_hora: new Date(),
        device: userAgent,
        location: "Online",
        total,
        estado: "Pedido realizado",
        metodo_pago: "Deducción de Planilla",
        invoice: transaction_id,
      },
    });    

    await Promise.all(
      cartItems.map(async (item: { id_producto: number; cantidad: number }) => {
        await prisma.productos_comprados.create({
          data: {
            id_historial: nuevaCompra.id,
            id_producto: item.id_producto,
            cantidad: item.cantidad,
          },
        });
      })
    );

    // Insertar en facturacion_ec
    await prisma.facturacion_ec.create({
      data: {
        id_pedido: nuevaCompra.id,
        total,
        fecha: nuevaCompra.fecha_hora,
        estado: "Pedido realizado",
        transaction_id,
      },
    });    

    // Vaciar carrito
    await prisma.carrito_ec.deleteMany({ where: { id_usuario: userId } });

    // 📧 Enviar correo con el PDF adjunto
    try {
      await sendConfirmationEmail(
        user.correo,
        user.nombre,
        transaction_id,
        total,
        pdfBuffer
      );
    } catch (error) {
      console.error("❌ Error enviando correo:", error);
    }

    // ✅ Al devolver el transaction_id, el frontend ya sabe cómo descargar el PDF automáticamente
    return NextResponse.json({ transaction_id }, { status: 200 });
  } catch (error) {
    console.error("❌ Error en /api/checkout:", error);
    return NextResponse.json(
      { error: "Error al procesar la compra", detalle: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
