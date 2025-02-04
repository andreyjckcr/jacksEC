import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma"; // Importar Prisma para manejar la BD

export async function POST(req: NextRequest) {
  try {
    const { codigo_empleado, nombre, correo, cedula, telefono, direccion } = await req.json();

    // ✅ Verificar si el usuario ya existe en la BD por su correo o cédula
    const existingUser = await prisma.usuarios_ecommerce.findFirst({
      where: {
        OR: [{ correo },{codigo_empleado}, { cedula }],
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: "El usuario ya está registrado con este correo, cédula o código de empleado" }, { status: 400 });
    }

    // ✅ Crear el nuevo usuario en la BD
    const newUser = await prisma.usuarios_ecommerce.create({
      data: {
        codigo_empleado,
        nombre,
        correo,
        cedula,
        telefono,
        direccion: direccion || null, // Si la dirección es opcional
      },
    });

    return NextResponse.json({ success: true, message: "Usuario registrado correctamente", user: newUser }, { status: 201 });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    return NextResponse.json({ error: "Error interno al registrar usuario" }, { status: 500 });
  }
}
