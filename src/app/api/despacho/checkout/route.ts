import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/authOptions";
import { prisma } from "../../../../../lib/prisma";
import { generateInvoicePDF } from "../../../../../lib/generateInvoice";
import { sendConfirmationEmail } from "../../../../../lib/emailService";
import { Buffer } from "buffer";
import { startOfWeek } from "date-fns";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { codigoEmpleado, pedido, total } = await req.json();

    if (!pedido || pedido.length === 0) {
      return NextResponse.json({ error: "El pedido no puede estar vacío." }, { status: 400 });
    }

    const totalNumber = Number(total);
    if (isNaN(totalNumber) || totalNumber <= 0) {
      return NextResponse.json({ error: "El total de la compra no es válido." }, { status: 400 });
    }

    const transaction_id = `INV-${Math.random().toString(36).substr(2, 9)}`;

    const user = await prisma.usuarios_ecommerce.findUnique({
      where: { codigo_empleado: codigoEmpleado },
      select: { id: true, nombre: true, correo: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });
    }

    const userId = user.id;

    const startOfWeekDate = startOfWeek(new Date(), { weekStartsOn: 1 });

    console.log("📅 Fecha de inicio de semana:", startOfWeekDate.toISOString());

    const totalGastado = await prisma.historial_compras_ec.aggregate({
      where: {
        id_usuario: userId,
        fecha_hora: { gte: startOfWeekDate },
        estado: { in: ["Pedido realizado", "Pedido en proceso"] },
      },
      _sum: { total: true },
    });

    const montoGastado = Number(totalGastado._sum.total) || 0;

    console.log("💸 Total gastado por el empleado esta semana:", montoGastado);
    console.log("🛒 Total del pedido actual:", totalNumber);
    console.log("➕ Suma total proyectada:", montoGastado + totalNumber);

    if (montoGastado + totalNumber > 12000) {
      return NextResponse.json({
        error: `El empleado supera el límite de ₡12,000. Ha gastado ₡${montoGastado.toFixed(2)} esta semana.`,
      }, { status: 400 });
    }

    // 📝 Registrar la compra en la BD
    const nuevaCompra = await prisma.historial_compras_ec.create({
      data: {
        id_usuario: userId,
        transaction_id,
        invoice: transaction_id,
        fecha_hora: new Date(),
        device: "Despachador",
        location: "En tienda",
        total: totalNumber,
        estado: "Pedido realizado",
        metodo_pago: "Deducción de Planilla",
      },
    });

    // 🛒 Guardar productos comprados y armar pedido con detalles
    const pedidoConDetalles = await Promise.all(
      pedido.map(async (item: { Id: number; cantidad: number }) => {
        const producto = await prisma.productos_ec.findUnique({
          where: { Id: item.Id },
          select: { NomArticulo: true, Precio: true },
        });

        if (!producto) {
          throw new Error(`Producto con Id ${item.Id} no encontrado`);
        }

        await prisma.productos_comprados.create({
          data: {
            id_historial: nuevaCompra.id,
            id_producto: item.Id,
            cantidad: item.cantidad,
          },
        });

        return {
          cantidad: item.cantidad,
          productos_ec: producto,
        };
      })
    );

    await prisma.facturacion_ec.create({
      data: {
        id_pedido: nuevaCompra.id,
        total: totalNumber,
        fecha: new Date(),
        estado: "Pedido realizado",
        transaction_id,
      },
    });
    

    // 🗑️ Limpiar carrito del empleado después de la compra
    await prisma.carrito_ec.deleteMany({
      where: { id_usuario: userId },
    });
    console.log(`🧹 Carrito del empleado ${codigoEmpleado} limpiado después de la compra`);


    // 📄 Generar factura PDF en Base64
    const pdfBase64 = await generateInvoicePDF(
      transaction_id,
      pedidoConDetalles,
      totalNumber,
      user.nombre,
      userId,
      "Despachador",
      "En tienda",
      new Date()
    );

    // 🗂️ Convertir PDF Base64 a Buffer
    const pdfBuffer = Buffer.from(pdfBase64.replace(/^data:application\/pdf;base64,/, ""), "base64");

    // 📧 Enviar correo con el PDF adjunto
    await sendConfirmationEmail(
      user.correo,
      user.nombre,
      transaction_id,
      totalNumber,
      pdfBuffer
    );

    return NextResponse.json({ transaction_id, pdfBase64 }, { status: 200 });
  } catch (error) {
    console.error("❌ Error en el checkout del despacho:", error);
    return NextResponse.json({ error: "Error al procesar la compra" }, { status: 500 });
  }
}
