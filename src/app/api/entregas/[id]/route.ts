import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { nuevoEstado } = await req.json();

  if (!nuevoEstado) {
    return NextResponse.json({ error: "Estado no proporcionado" }, { status: 400 });
  }

  try {
    const pedidoActualizado = await prisma.historial_compras_ec.update({
      where: { id: parseInt(id) },
      data: { estado: nuevoEstado },
    });

    return NextResponse.json(pedidoActualizado, { status: 200 });
  } catch (error) {
    console.error("❌ Error actualizando estado:", error);
    return NextResponse.json({ error: "Error actualizando el estado del pedido" }, { status: 500 });
  }
}
