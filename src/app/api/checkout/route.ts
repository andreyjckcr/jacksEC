import { NextRequest, NextResponse } from "next/server";
import { sendConfirmationEmail } from "../../../../lib/emailService";
import { generateInvoicePDF } from "../../../../lib/generateInvoice";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { prisma } from "../../../../lib/prisma";
import { Buffer } from "buffer";
import { toZonedTime } from "date-fns-tz";
import { addDays, startOfDay } from "date-fns";

{/* const today = new Date();
while (today.getUTCDay() !== 3) {
  today.setUTCDate(today.getUTCDate() + 1);
} // 💡 Fuerza que sea miércoles sin cambiar la fecha del sistema */}

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

    // 📌 Obtener la fecha y hora en Costa Rica (UTC-6)
    const timeZone = "America/Costa_Rica";
    const ahoraUTC = new Date();
    const ahora = toZonedTime(ahoraUTC, timeZone);
    const diaSemana = ahora.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

    // 🚨 Restricción de días de compra (Solo Jueves a Martes)
    if (diaSemana === 3) { // Miércoles (día 3)
      return NextResponse.json(
        { error: "Los miércoles no se pueden realizar compras. Día exclusivo de alisto." },
        { status: 403 }
      );
    }

    // 📌 Calcular inicio de la semana (Jueves a Martes)
    let inicioSemana = startOfDay(ahora);
    if (diaSemana >= 4) { // Si es Jueves (4) o más, el inicio de semana es el Jueves actual
      inicioSemana = startOfDay(addDays(ahora, - (diaSemana - 4)));
    } else { // Si es Domingo (0) a Martes (2), el inicio de semana es el Jueves pasado
      inicioSemana = startOfDay(addDays(ahora, - (diaSemana + 3)));
    }

    // 🚨 Verificar si el usuario ya tiene un pedido en estado "Pedido Realizado" o "Pedido en proceso"
    const pedidosPendientes = await prisma.historial_compras_ec.findFirst({
      where: {
        id_usuario: userId,
        estado: { in: ["Pedido realizado", "Pedido en proceso"] },
        fecha_hora: { gte: inicioSemana },
      },
    });

    if (pedidosPendientes) {
      return NextResponse.json(
        { error: "Ya tienes una compra en proceso. Debes esperar a que se complete antes de hacer otra." },
        { status: 403 }
      );
    }

    // 📌 Verificar límite de ₡12,000 en la semana
    const totalGastado = await prisma.historial_compras_ec.aggregate({
      where: {
        id_usuario: userId,
        fecha_hora: { gte: inicioSemana },
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

    // ✅ Generar PDF de factura
    const pdfBase64 = await generateInvoicePDF(
      transaction_id,
      cartItems,
      total,
      user.nombre,
      userId,
      userAgent,
      "Online",
      ahora
    );

    const pdfBuffer = Buffer.from(pdfBase64.replace(/^data:application\/pdf;base64,/, ""), "base64");

    // 📌 Registrar nueva compra
    const nuevaCompra = await prisma.historial_compras_ec.create({
      data: {
        id_usuario: userId,
        transaction_id,
        fecha_hora: ahora,
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

    // 📌 Registrar en facturación
    await prisma.facturacion_ec.create({
      data: {
        id_pedido: nuevaCompra.id,
        total,
        fecha: nuevaCompra.fecha_hora,
        estado: "Pedido realizado",
        transaction_id,
      },
    });

    // 🛒 Vaciar carrito
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

    return NextResponse.json({ transaction_id }, { status: 200 });
  } catch (error) {
    console.error("❌ Error en /api/checkout:", error);
    return NextResponse.json(
      { error: "Error al procesar la compra", detalle: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

