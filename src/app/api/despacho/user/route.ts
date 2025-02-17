import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const codigoEmpleado = searchParams.get("codigo");

    if (!codigoEmpleado) {
      return NextResponse.json({ error: "Código de empleado requerido" }, { status: 400 });
    }

    const user = await prisma.usuarios_ecommerce.findUnique({
      where: { codigo_empleado: codigoEmpleado },
      select: { id: true, nombre: true, correo: true, cedula: true, codigo_empleado: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const totalGastado = await prisma.historial_compras_ec.aggregate({
      where: {
        id_usuario: user.id,
        fecha_hora: { gte: startOfWeek },
        estado: { in: ["Pedido realizado", "Pedido en proceso"] },
      },
      _sum: { total: true },
    });

    return NextResponse.json({
      nombre: user.nombre,
      correo: user.correo,
      cedula: user.cedula,
      codigo_empleado: user.codigo_empleado,
      totalGastado: totalGastado._sum.total || 0,
    });

  } catch (error) {
    console.error("❌ Error obteniendo datos del usuario:", error);
    return NextResponse.json({ error: "Error al obtener datos del usuario" }, { status: 500 });
  }
}
