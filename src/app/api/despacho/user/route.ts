import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export const dynamic = "force-dynamic"; // Evita la prerenderización estática

export async function GET(req: NextRequest) {
  try {
    // ✅ Obtener el código de empleado desde los parámetros de la URL
    const { searchParams } = new URL(req.url);
    const codigoEmpleado = searchParams.get("codigo");

    if (!codigoEmpleado) {
      return NextResponse.json({ error: "Código de empleado requerido" }, { status: 400 });
    }

    // ✅ Buscar el usuario en la base de datos
    const user = await prisma.usuarios_ecommerce.findUnique({
      where: { codigo_empleado: codigoEmpleado },
      select: { id: true, nombre: true, correo: true, cedula: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // ✅ Calcular el gasto semanal (últimos 7 días)
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const totalGastado = await prisma.historial_compras_ec.aggregate({
      where: {
        id_usuario: user.id,
        fecha_hora: { gte: startOfWeek },
        estado: { in: ["Pedido realizado", "Pedido en proceso"] }, // ✅ Solo estos estados cuentan
      },
      _sum: { total: true },
    });

    return NextResponse.json({
      nombre: user.nombre,
      correo: user.correo,
      cedula: user.cedula,
      totalGastado: totalGastado._sum.total || 0, // Si no ha gastado nada, devuelve 0
    });

  } catch (error) {
    console.error("❌ Error obteniendo datos del usuario:", error);
    return NextResponse.json({ error: "Error al obtener datos del usuario" }, { status: 500 });
  }
}
