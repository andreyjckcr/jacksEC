import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { codigo_empleado, nombre, correo, cedula, telefono, direccion } = await req.json();

    // ✅ 1️⃣ Verificar si el usuario ya existe en usuarios_ecommerce
    const existingUser = await prisma.usuarios_ecommerce.findFirst({
      where: {
        OR: [{ correo }, { codigo_empleado }, { cedula }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El usuario ya está registrado con este correo, cédula o código de empleado" },
        { status: 400 }
      );
    }

    // ✅ 2️⃣ Validar que el Código y la Cédula (NIF) existan juntos en validacion_empleados
    const validEmployee = await prisma.validacion_empleados.findFirst({
      where: {
        Codigo_del_empleado: codigo_empleado,
        NIF: cedula,
      },
    });

    if (!validEmployee) {
      return NextResponse.json(
        { error: "El código de empleado y/o la cédula no son válidos o no coinciden en el registro de empleados." },
        { status: 400 }
      );
    }

    // ✅ 3️⃣ Crear el nuevo usuario en la BD
    const newUser = await prisma.usuarios_ecommerce.create({
      data: {
        codigo_empleado,
        nombre,
        correo,
        cedula,
        telefono,
        direccion: direccion || null,
      },
    });

    return NextResponse.json({ success: true, message: "Usuario registrado correctamente", user: newUser }, { status: 201 });

  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    return NextResponse.json({ error: "Error interno al registrar usuario" }, { status: 500 });
  }
}
