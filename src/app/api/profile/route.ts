import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/route";
import { authOptions } from "../../../../lib/authOptions"

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    // ✅ Obtener datos del usuario
    const user = await prisma.usuarios_ecommerce.findUnique({
      where: { id: Number(session.user.id) },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // ✅ Obtener historial de compras con productos
    const historialCompras = await prisma.historial_compras_ec.findMany({
      where: { id_usuario: Number(session.user.id) },
      orderBy: { fecha_hora: "desc" },
      include: {
        productos_comprados: {
          include: {
            productos_ec: {
              select: {
                Id: true,
                NomArticulo: true,
              },
            },
          },
        },
      },
    });
    
    // 📌 Depuración en logs
    console.log("🔍 [DEBUG] Historial de compras con productos:", JSON.stringify(historialCompras, null, 2));    

    if (!historialCompras.length) {
      console.warn("⚠️ No hay historial de compras en PRODUCCIÓN.");
    }

    return NextResponse.json({ user, historialCompras }, { status: 200 });

  } catch (error) {
    console.error("❌ Error obteniendo el perfil:", error);
    return NextResponse.json({ error: "Error al obtener el perfil" }, { status: 500 });
  }
}
