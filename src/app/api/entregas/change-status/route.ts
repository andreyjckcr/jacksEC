import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const { pedidoId, nuevoEstado } = await req.json();

    await prisma.pedidos_ec.update({
      where: { id: pedidoId },
      data: { estado: nuevoEstado },
    });

    return NextResponse.json(
      { message: "Estado actualizado correctamente" },
      {
        status: 200,
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
