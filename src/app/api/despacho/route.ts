import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

// ✅ Obtener productos disponibles con imagen
export async function GET(req: NextRequest) {
  try {
    const products = await prisma.productos_ec.findMany({
      select: {
        Id: true,
        NomArticulo: true,
        Precio: true,
        image_url: true,
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}
