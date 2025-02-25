import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    const { pedidoId, nuevoEstado } = await req.json();

    if (!pedidoId || !nuevoEstado) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    // Verificamos si el pedido existe
    const pedidoExistente = await prisma.pedidos_ec.findUnique({
      where: { id: pedidoId },
    });

    if (!pedidoExistente) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    // Iniciamos una transacción para actualizar todas las tablas relacionadas
    await prisma.$transaction([
      prisma.pedidos_ec.update({
        where: { id: pedidoId },
        data: { estado: nuevoEstado },
      }),
      prisma.historial_compras_ec.updateMany({
        where: { id: pedidoId }, // Ajusta el campo si es diferente
        data: { estado: nuevoEstado },
      }),
      prisma.facturacion_ec.updateMany({
        where: { id_pedido: pedidoId }, // Ajusta el campo si es diferente
        data: { estado: nuevoEstado },
      }),
    ]);

    return NextResponse.json({ message: "Estado actualizado correctamente" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error en la actualización del estado:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
