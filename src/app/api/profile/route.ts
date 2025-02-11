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

    // ✅ Obtener historial de compras exitosas con productos comprados
    const historialCompras = await prisma.historial_compras_ec.findMany({
      where: {
        id_usuario: user.id,
        total: { gt: 0 }, // 🔹 Solo mostrar compras con total > 0 (evita compras fallidas)
      },
      orderBy: { fecha_hora: "desc" },
      include: {
        productos_comprados: {
          include: {
            productos_ec: { select: { Id: true, NomArticulo: true } },
          },
        },
      },
    });

    // 🔍 Debug en producción para verificar que los productos están siendo consultados
    console.log("🔍 [DEBUG] Historial de compras con productos en Backend:", historialCompras);

    // ✅ Mapear los datos al formato correcto
    const comprasConProductos = historialCompras.map((compra) => ({
      id: compra.id,
      transaction_id: compra.transaction_id,
      fecha_hora: compra.fecha_hora,
      total: compra.total,
      estado: compra.estado,
      factura_url: compra.invoice ? `${process.env.NEXT_PUBLIC_SITE_URL}/invoices/${compra.invoice}` : null,
      productos: compra.productos_comprados.map((p) => ({
        nombre: p.productos_ec.NomArticulo,
        cantidad: p.cantidad,
      })),
    }));

    return NextResponse.json({ user, historialCompras: comprasConProductos }, { status: 200 });

  } catch (error) {
    console.error("❌ Error obteniendo el perfil:", error);
    return NextResponse.json({ error: "Error al obtener el perfil" }, { status: 500 });
  }
}
