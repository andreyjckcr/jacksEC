import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";

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

    // ✅ Obtener historial de compras válidas con productos asociados
    const historialCompras = await prisma.historial_compras_ec.findMany({
      where: {
        id_usuario: user.id,
        total: { gt: 0 }, // 🔹 Solo mostrar compras con monto mayor a 0 (evita compras fallidas)
      },
      orderBy: { fecha_hora: "desc" },
      include: {
        productos_comprados: {
          include: {
            productos_ec: {
              select: { NomArticulo: true },
            },
          },
        },
      },
    });

    // 🔍 DEBUG: Mostrar historial de compras recuperado
    console.log("🔍 [DEBUG] Historial de compras recuperado:", JSON.stringify(historialCompras, null, 2));

    // ✅ Formatear compras para asegurar que solo incluya compras con productos
    const comprasConProductos = historialCompras
      .filter((compra) => compra.productos_comprados.length > 0) // 🔹 Elimina compras sin productos
      .map((compra) => ({
        ...compra,
        factura_url: compra.invoice ? `${process.env.NEXT_PUBLIC_SITE_URL}${compra.invoice}` : null,
        productos: compra.productos_comprados.map((p) => ({
          nombre: p.productos_ec.NomArticulo,
          cantidad: p.cantidad,
        })),
      }));

    // 🔍 DEBUG: Mostrar compras finales filtradas
    console.log("🔍 [DEBUG] Historial de compras con productos:", JSON.stringify(comprasConProductos, null, 2));

    return NextResponse.json({ user, historialCompras: comprasConProductos }, { status: 200 });

  } catch (error) {
    console.error("❌ Error obteniendo el perfil:", error);
    return NextResponse.json({ error: "Error al obtener el perfil" }, { status: 500 });
  }
}
