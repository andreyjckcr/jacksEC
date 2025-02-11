import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/route";
import { authOptions } from "../../../../lib/authOptions"

const prisma = new PrismaClient();

type CartItem = {
  id_producto: number;
  cantidad: number;
};

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    // ✅ Obtener datos del usuario
    const user = await prisma.usuarios_ecommerce.findUnique({
      where: { id: Number(session.user.id) },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // ✅ Obtener historial de compras con productos
    const nuevaCompra = await prisma.historial_compras_ec.create({
      data: {
        id_usuario: user.id,
        invoice: "default_invoice", // replace with actual invoice value
        total: 0, // replace with actual total value
        estado: "pending", // replace with actual estado value
      },
    });

    const cartItems: CartItem[] = []; // Define cartItems with appropriate values

    await Promise.all(
      cartItems.map(async (item: CartItem) => {
        await prisma.productos_comprados.create({
          data: {
            id_historial: nuevaCompra.id,
            id_producto: item.id_producto,
            cantidad: item.cantidad,
          },
        });
      })
    );
    
    // 📌 DEBUG para verificar que los productos fueron guardados
    const productosGuardados = await prisma.productos_comprados.findMany({
      where: { id_historial: nuevaCompra.id },
    });
    console.log("✅ Productos guardados en la compra:", productosGuardados);

    // ✅ Obtener historial de compras
    const historialCompras = await prisma.historial_compras_ec.findMany({
      where: { id_usuario: user.id },
      include: { productos_comprados: true },
    });

    if (!historialCompras.length) {
      console.warn("⚠️ No hay historial de compras en PRODUCCIÓN.");
    }

    return NextResponse.json({ user, historialCompras }, { status: 200 });

  } catch (error) {
    console.error("❌ Error obteniendo el perfil:", error);
    return NextResponse.json({ error: "Error al obtener el perfil" }, { status: 500 });
  }
}
