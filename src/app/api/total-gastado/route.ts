import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/route";
import { authOptions } from "../../../../lib/authOptions"
import { prisma } from "../../../../lib/prisma";

export const dynamic = "force-dynamic"; // Evita la prerenderización estática

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const hoy = new Date();
    const diaSemana = hoy.getDay();

    if (diaSemana === 4) { // Jueves
      const juevesPasado = new Date();
      juevesPasado.setDate(hoy.getDate() - 7);

      await prisma.historial_compras_ec.updateMany({
        where: {
          id_usuario: userId,
          fecha_hora: { lt: juevesPasado }, // Solo pedidos anteriores al jueves actual
          estado: { in: ["Pedido realizado", "Pedido en proceso"] }
        },
        data: { total: 0 }
      });
    }

    // 📌 Encontrar el jueves más reciente (inicio del ciclo)
    const ultimoJueves = new Date();
    if (diaSemana >= 4) {
      // Si es jueves o después, restar la diferencia de días para llegar al jueves actual
      ultimoJueves.setDate(hoy.getDate() - (diaSemana - 4));
    } else {
      // Si es antes del jueves, retroceder a la semana pasada
      ultimoJueves.setDate(hoy.getDate() - (diaSemana + 3));
    }
    ultimoJueves.setHours(0, 0, 0, 0); 


    // ✅ Calcular el gasto desde el jueves hasta hoy
    const totalGastado = await prisma.historial_compras_ec.aggregate({
      where: {
        id_usuario: userId,
        fecha_hora: { gte: ultimoJueves }, // Solo cuenta desde el jueves más reciente
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
