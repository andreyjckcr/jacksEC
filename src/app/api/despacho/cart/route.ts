import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { codigoEmpleado, id_producto, cantidad } = await req.json();

    const user = await prisma.usuarios_ecommerce.findUnique({
      where: { codigo_empleado: codigoEmpleado },
    });

    if (!user) {
      return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });
    }

    const existingItem = await prisma.carrito_ec.findFirst({
      where: {
        id_usuario: user.id,
        id_producto: id_producto,
      },
    });

    let updatedCartItem;
    if (existingItem) {
      updatedCartItem = await prisma.carrito_ec.update({
        where: { id: existingItem.id },
        data: { cantidad: existingItem.cantidad + cantidad },
      });
    } else {
      updatedCartItem = await prisma.carrito_ec.create({
        data: {
          id_usuario: user.id,
          id_producto,
          cantidad,
        },
      });
    }

    return NextResponse.json(updatedCartItem, { status: 200 });
  } catch (error) {
    console.error("❌ Error agregando al carrito:", error);
    return NextResponse.json({ error: "Error agregando al carrito" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const codigoEmpleado = searchParams.get("codigoEmpleado");

  if (!codigoEmpleado) {
    return NextResponse.json({ error: "Código de empleado requerido" }, { status: 400 });
  }

  try {
    const user = await prisma.usuarios_ecommerce.findUnique({
      where: { codigo_empleado: codigoEmpleado },
    });

    if (!user) {
      return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });
    }

    const cartItems = await prisma.carrito_ec.findMany({
      where: { id_usuario: user.id },
      include: {
        productos_ec: true,
      },
    });

    return NextResponse.json(cartItems, { status: 200 });
  } catch (error) {
    console.error("❌ Error obteniendo el carrito:", error);
    return NextResponse.json({ error: "Error obteniendo el carrito" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { codigoEmpleado, id_producto } = await req.json();

    const user = await prisma.usuarios_ecommerce.findUnique({
      where: { codigo_empleado: codigoEmpleado },
    });

    if (!user) {
      return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });
    }

    if (id_producto) {
      await prisma.carrito_ec.deleteMany({
        where: {
          id_usuario: user.id,
          id_producto,
        },
      });
    } else {
      await prisma.carrito_ec.deleteMany({
        where: { id_usuario: user.id },
      });
    }

    return NextResponse.json({ message: "Producto eliminado o carrito vaciado" });
  } catch (error) {
    console.error("❌ Error eliminando del carrito:", error);
    return NextResponse.json({ error: "Error eliminando del carrito" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { codigoEmpleado, id_producto, cantidad } = await req.json();

    const user = await prisma.usuarios_ecommerce.findUnique({
      where: { codigo_empleado: codigoEmpleado },
    });

    if (!user) {
      return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });
    }

    const existingItem = await prisma.carrito_ec.findFirst({
      where: {
        id_usuario: user.id,
        id_producto,
      },
    });

    if (!existingItem) {
      return NextResponse.json({ error: "Producto no encontrado en el carrito" }, { status: 404 });
    }

    const updatedCartItem = await prisma.carrito_ec.update({
      where: { id: existingItem.id },
      data: { cantidad },
    });

    return NextResponse.json(updatedCartItem, { status: 200 });
  } catch (error) {
    console.error("❌ Error actualizando carrito:", error);
    return NextResponse.json({ error: "Error actualizando carrito" }, { status: 500 });
  }
}
