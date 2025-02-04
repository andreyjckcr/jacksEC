import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.productos_ec.findUnique({
      where: { Id: Number(params.id) },
    });

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    // 🔹 Asegurar que el precio se devuelve como número (evita errores en el frontend)
    const formattedProduct = {
      ...product,
      Precio: Number(product.Precio), // Convierte a número si es Decimal
    };

    return NextResponse.json(formattedProduct, { status: 200 });
  } catch (error) {
    console.error("❌ Error obteniendo producto:", error);
    return NextResponse.json({ error: "Error al obtener producto" }, { status: 500 });
  }
}

