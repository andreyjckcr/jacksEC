import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    let products;

    if (search) {
      // Convertimos tanto la búsqueda como la columna a minúsculas para evitar problemas de mayúsculas/minúsculas
      products = await prisma.productos_ec.findMany({
        where: {
          NomArticulo: {
            contains: search,
          },
        },
        take: 10, // Limitar la cantidad de productos para mejorar rendimiento
      });
    } else {
      // Si no hay término de búsqueda, devolvemos todos los productos
      products = await prisma.productos_ec.findMany();
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("❌ Error obteniendo productos:", error);
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}
