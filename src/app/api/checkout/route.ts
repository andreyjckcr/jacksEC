import { NextRequest, NextResponse } from "next/server";
import { generateInvoicePDF } from "../../../../lib/generateInvoice";
import { sendConfirmationEmail } from "../../../../lib/emailService";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { cartItems, total } = await req.json();
    const transaction_id = `INV-${Math.random().toString(36).substr(2, 9)}`;
    const userId = Number(session.user.id);

    // Verificar que el usuario exista
    const user = await prisma.usuarios_ecommerce.findUnique({
      where: { id: userId },
      select: { nombre: true, correo: true },
    });
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Verificar el gasto semanal (últimos 7 días)
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
      return NextResponse.json({
        error: `No puedes realizar esta compra porque superarías el límite semanal de ₡12,000. Ya has gastado ₡${montoGastado.toFixed(2)}.`,
      }, { status: 400 });
    }

    // Generar la factura en Base64
    const pdfUrl = await generateInvoicePDF(
      transaction_id,
      cartItems,
      total,
      user.nombre,
      userId,
      "Desconocido",
      "Online"
    );

    // Crear registro de compra
    const nuevaCompra = await prisma.historial_compras_ec.create({
      data: {
        id_usuario: userId,
        transaction_id,
        fecha_hora: new Date(),
        device: "Desconocido",
        location: "Online",
        total,
        estado: "Pedido realizado",
        metodo_pago: "Deducción de Planilla",
        // Puedes eliminar esta clave si no deseas guardar nada del PDF
        invoice: transaction_id,
      },
    });

    // Registrar productos comprados
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

    // Vaciar carrito
    await prisma.carrito_ec.deleteMany({ where: { id_usuario: userId } });

    // Enviar correo con el PDF adjunto
    await sendConfirmationEmail(
      user.correo,
      user.nombre,
      transaction_id,
      total,
      // Convertir la URL base64 en Buffer en la función de email
      Buffer.from(pdfUrl.replace(/^data:application\/pdf;base64,/, ""), "base64")
    );

    return NextResponse.json({ transaction_id, pdfUrl }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al procesar la compra" }, { status: 500 });
  }
}
