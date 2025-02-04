import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    // ✅ Obtener datos del usuario desde la BD
    const user = await prisma.usuarios_ecommerce.findUnique({
      where: { id: Number(session.user.id) },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // ✅ Obtener historial de compras con productos comprados
    const historialCompras = await prisma.historial_compras_ec.findMany({
      where: { id_usuario: Number(session.user.id) },
      orderBy: { fecha_hora: "desc" },
      include: {
        productos_comprados: { // 📌 Ahora sí existe esta relación
          include: {
            productos_ec: {
              select: {
                NomArticulo: true,
              },
            },
          },
        },
      },
    });    

    // ✅ Ajustar la respuesta con productos y factura URL completa
    interface ProductoComprado {
      nombre: string;
      cantidad: number;
    }

    interface CompraConProductos {
      id: number;
      id_usuario: number;
      fecha_hora: Date;
      factura_url: string | null;
      productos: ProductoComprado[];
    }

    interface ProductoCompradoDB {
      productos_ec: {
      NomArticulo: string;
      };
      cantidad: number;
    }

    interface HistorialCompraDB {
      id: number;
      id_usuario: number;
      fecha_hora: Date;
      invoice: string | null;
      productos_comprados: ProductoCompradoDB[];
    }


    const comprasConProductos: CompraConProductos[] = historialCompras.map((compra: HistorialCompraDB): CompraConProductos => ({
      ...compra,
      factura_url: compra.invoice ? `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}${compra.invoice}` : null,
      productos: compra.productos_comprados.map((p: ProductoCompradoDB): ProductoComprado => ({
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
