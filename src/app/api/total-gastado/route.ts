import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = Number(session.user.id);

    // ✅ Calcular el gasto semanal (últimos 7 días)
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const totalGastado = await prisma.historial_compras_ec.aggregate({
      where: {
        id_usuario: userId,
        fecha_hora: { gte: startOfWeek },
        estado: { in: ["Pedido realizado", "Pedido en proceso"] }, // ✅ Solo estos estados cuentan
      },
      _sum: { total: true },
    });

    return NextResponse.json({ totalGastado: totalGastado._sum.total || 0 }, { status: 200 });
  } catch (error) {
    console.error("❌ Error obteniendo el total gastado:", error);
    return NextResponse.json({ error: "Error al obtener el total gastado" }, { status: 500 });
  }
}
