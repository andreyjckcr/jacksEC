import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id_producto, cantidad } = await req.json();

  try {
    const existingCartItem = await prisma.carrito_ec.findFirst({
      where: {
        id_usuario: Number(session.user.id),
        id_producto: Number(id_producto),
      },
    });

    let cartItem;
    if (existingCartItem) {
      // Si ya existe, actualiza la cantidad
      cartItem = await prisma.carrito_ec.update({
        where: { id: existingCartItem.id },
        data: { cantidad: existingCartItem.cantidad + Number(cantidad) },
      });
    } else {
      // Si no existe, crea un nuevo ítem en el carrito
      cartItem = await prisma.carrito_ec.create({
        data: {
          id_usuario: Number(session.user.id),
          id_producto: Number(id_producto),
          cantidad: Number(cantidad),
        },
      });
    }

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al agregar al carrito" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const cartItems = await prisma.carrito_ec.findMany({
      where: { id_usuario: Number(session.user.id) },
      include: { productos_ec: true },
    });

    return NextResponse.json(cartItems, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener el carrito" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id_producto } = await req.json().catch(() => ({})); // ✅ Manejo de error si el JSON está vacío

    if (id_producto) {
      // ✅ Eliminar un solo producto del carrito
      await prisma.carrito_ec.deleteMany({
        where: {
          id_usuario: Number(session.user.id),
          id_producto: Number(id_producto),
        },
      });
      return NextResponse.json({ message: "Producto eliminado del carrito correctamente" }, { status: 200 });
    } else {
      // ✅ Eliminar todo el carrito si no se proporciona un `id_producto`
      await prisma.carrito_ec.deleteMany({
        where: { id_usuario: Number(session.user.id) },
      });
      return NextResponse.json({ message: "Carrito vaciado correctamente" }, { status: 200 });
    }
  } catch (error) {
    console.error("❌ Error al eliminar del carrito:", error);
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 });
  }
}


export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id_producto, cantidad } = await req.json();

  try {
    if (cantidad < 1) {
      return NextResponse.json({ error: "La cantidad debe ser al menos 1" }, { status: 400 });
    }

    // Buscar el ítem existente en el carrito
    const existingCartItem = await prisma.carrito_ec.findFirst({
      where: {
        id_usuario: Number(session.user.id),
        id_producto: Number(id_producto),
      },
    });

    if (!existingCartItem) {
      return NextResponse.json({ error: "Producto no encontrado en el carrito" }, { status: 404 });
    }

    // Actualizar la cantidad del producto en el carrito sin duplicaciones
    const updatedCartItem = await prisma.carrito_ec.update({
      where: {
        id: existingCartItem.id,
      },
      data: {
        cantidad: Number(cantidad),
      },
    });

    return NextResponse.json({ message: "Cantidad actualizada correctamente", updatedCartItem }, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar la cantidad:", error);
    return NextResponse.json({ error: "Error al actualizar la cantidad" }, { status: 500 });
  }
}
