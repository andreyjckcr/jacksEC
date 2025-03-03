import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const usuarios = await prisma.usuarios_ecommerce.findMany({
      select: {
        id: true,
        cedula: true,
        codigo_empleado: true,
        nombre: true,
        correo: true,
        estado: true,
      },
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { cedula, codigoEmpleado, nombre, correo } = await req.json();

    // Validar si la cédula y código existen en `validacion_empleados`
    const validacion = await prisma.validacion_empleados.findUnique({
      where: {
        NIF: cedula,
        Codigo_del_empleado: codigoEmpleado,
      },
    });

    if (!validacion) {
      return NextResponse.json(
        { error: "Cédula o Código de empleado no coinciden en la base de validación." },
        { status: 400 }
      );
    }

    // Crear usuario en la tabla `usuarios_ecommerce`
    const nuevoUsuario = await prisma.usuarios_ecommerce.create({
      data: {
        cedula,
        codigo_empleado: codigoEmpleado,
        nombre,
        correo,
        estado: "Activo",
      },
    });

    return NextResponse.json(nuevoUsuario, { status: 201 });
  } catch (error) {
    console.error("❌ Error al agregar usuario:", error);
    return NextResponse.json({ error: "Error al agregar usuario" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, estado } = await req.json();

    const usuarioActualizado = await prisma.usuarios_ecommerce.update({
      where: { id },
      data: { estado },
    });

    return NextResponse.json(usuarioActualizado, { status: 200 });
  } catch (error) {
    console.error("❌ Error al actualizar usuario:", error);
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 });
  }
}
