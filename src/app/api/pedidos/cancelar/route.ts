import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";


export async function POST(req: NextRequest) {
    try {
      const { transactionId } = await req.json();
      console.log("🔍 [DEBUG] Transacción recibida:", transactionId);
  
      // Verificar si el pedido existe
      const pedido = await prisma.historial_compras_ec.findUnique({
        where: { transaction_id: transactionId },
      });
  
      if (!pedido) {
        console.log("❌ Pedido no encontrado.");
        return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
      }
  
      console.log("📦 [DEBUG] Pedido encontrado:", pedido);
  
      // Verificar si el pedido ya fue entregado
      if (pedido.estado === "Entregado") {
        console.log("⚠️ El pedido ya fue entregado y no se puede cancelar.");
        return NextResponse.json({ error: "No se puede cancelar un pedido ya entregado." }, { status: 400 });
      }
  
      // Actualizar el estado del pedido a "Cancelado"
      await prisma.historial_compras_ec.update({
        where: { transaction_id: transactionId },
        data: { estado: "Cancelado" },
      });
  
      console.log("✅ Pedido cancelado exitosamente.");
      return NextResponse.json({ message: "Pedido cancelado con éxito." });
  
    } catch (error) {
      console.error("❌ Error en la API de cancelación:", error);
      return NextResponse.json({ error: "Error interno al cancelar el pedido." }, { status: 500 });
    }
  }