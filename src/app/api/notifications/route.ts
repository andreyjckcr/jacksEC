import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    // ✅ Obtener datos del usuario desde la BD
    const user = await prisma.usuarios_ecommerce.findUnique({
      where: { id: Number(session.user.id) },
      select: { correo: true, telefono: true, notificaciones_push: true, notificaciones_email: true },
    });

    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    return NextResponse.json({
      email: user.correo,
      telefono: user.telefono,
      pushEnabled: user.notificaciones_push,
      emailEnabled: user.notificaciones_email,
    });

  } catch (error) {
    console.error("❌ Error obteniendo configuración de notificaciones:", error);
    return NextResponse.json({ error: "Error al obtener configuración" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { pushEnabled, phoneNumber, emailEnabled, emailAddress } = await req.json();

    // ✅ Actualizar datos en la BD
    await prisma.usuarios_ecommerce.update({
      where: { id: Number(session.user.id) },
      data: {
        telefono: phoneNumber || null,
        correo: emailAddress || null,
        notificaciones_push: pushEnabled,
        notificaciones_email: emailEnabled,
      },
    });

    return NextResponse.json({ success: true, message: "Configuración actualizada correctamente" });

  } catch (error) {
    console.error("❌ Error actualizando configuración de notificaciones:", error);
    return NextResponse.json({ error: "Error al actualizar configuración" }, { status: 500 });
  }
}

