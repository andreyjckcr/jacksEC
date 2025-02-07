import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "../../../../../lib/prisma";
import { generateInvoicePDF } from "../../../../../lib/generateInvoice";
import nodemailer from "nodemailer";

// ✅ Configuración de Nodemailer para Outlook/Exchange
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    ciphers: "SSLv3",
  },
});

// ✅ Enviar correo de confirmación
async function sendConfirmationEmail(email: string, nombre: string, transactionId: string, pdfUrl: string, total: number) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Confirmación de compra - Jack's Ecommerce",
    html: `
      <h2>¡Gracias por tu compra, ${nombre}!</h2>
      <p>Tu pedido ha sido procesado por el despachador.</p>
      <p><strong>ID de la transacción:</strong> ${transactionId}</p>
      <p><strong>Total pagado:</strong> ₡${total.toFixed(2)}</p>
      <p>Puedes descargar tu factura desde el siguiente enlace:</p>
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}${pdfUrl}" target="_blank">Descargar Factura</a>
      <p>Gracias por confiar en Jack's!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Correo de confirmación enviado a:", email);
  } catch (error) {
    console.error("❌ Error enviando correo:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { codigoEmpleado, pedido, total } = await req.json();
    const transaction_id = `INV-${Math.random().toString(36).substr(2, 9)}`;

    // ✅ Buscar usuario en la BD
    const user = await prisma.usuarios_ecommerce.findUnique({
      where: { codigo_empleado: codigoEmpleado },
      select: { id: true, nombre: true, correo: true, cedula: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });
    }

    const userId = user.id;

    // ✅ Validar que no supere el límite de ₡12,000
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

    const montoGastado = totalGastado._sum.total || 0;

    if (montoGastado + total > 12000) {
      return NextResponse.json({
        error: `El empleado supera el límite de ₡12,000. Ha gastado ₡${montoGastado.toFixed(2)} esta semana.`,
      }, { status: 400 });
    }

    // 📂 Generar factura PDF
    const pdfUrl = await generateInvoicePDF(transaction_id, pedido, total, user.nombre, userId, "Despachador", "En tienda");

    // ✅ Guardar la compra en la BD con estado "Pedido realizado"
    const nuevaCompra = await prisma.historial_compras_ec.create({
      data: {
        id_usuario: userId,
        transaction_id,
        invoice: pdfUrl,
        fecha_hora: new Date(),
        device: "Despachador",
        location: "En tienda",
        total,
        estado: "Pedido realizado",
        metodo_pago: "Deducción de Planilla",
      },
    });

    // 📌 Guardar productos comprados
    await Promise.all(
      pedido.map(async (item: { Id: number; cantidad: number }) => {
        await prisma.productos_comprados.create({
          data: {
            id_historial: nuevaCompra.id,
            id_producto: item.Id,
            cantidad: item.cantidad,
          },
        });
      })
    );

    // ✅ Enviar correo de confirmación
    await sendConfirmationEmail(user.correo, user.nombre, transaction_id, pdfUrl, total);

    return NextResponse.json({ transaction_id, pdfUrl }, { status: 200 });

  } catch (error) {
    console.error("❌ Error en el checkout del despacho:", error);
    return NextResponse.json({ error: "Error al procesar la compra" }, { status: 500 });
  }
}
