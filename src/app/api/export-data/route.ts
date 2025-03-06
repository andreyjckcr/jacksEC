import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

/**
 * Handler GET: Retorna en formato JSON los pedidos con estado "Pedido Realizado",
 * partiendo de 'historial_compras_ec' y uniendo tablas para traer la información necesaria.
 */
export async function GET() {
  try {
    const data = await obtenerDatosDesdeHistorial();
    return NextResponse.json({ data });
  } catch (err) {
    console.error("❌ Error al leer datos:", err);
    return NextResponse.json({ error: "Error al leer datos" }, { status: 500 });
  }
}

/**
 * Handler POST: Obtiene la misma data que el GET y la inserta en la tabla "Producto".
 * Luego, actualiza los estados en "pedidos_ec", "facturacion_ec" e "historial_compras_ec"
 * de "Pedido Realizado" a "Pedido en proceso".
 */
export async function POST() {
  try {
    // 1. Consulta la data a exportar desde historial_compras_ec
    const datos = await obtenerDatosDesdeHistorial();

    // 2. Insertar en la tabla "Producto" con createMany para evitar errores de MSSQL
    if (datos.length > 0) {
      await prisma.producto.createMany({
        data: datos.map((item) => ({
          codigo_empleado: item.codigoEmpleado.slice(0, 20),
          codigo_articulo: item.codigoProducto.slice(0, 6),
          fecha: item.fechaPedido ?? new Date(),
          cantidad: item.cantidad, // Agregamos la cantidad
          estado: 0, // 0 = pendiente
        })),
      });
    }

    // 3. Cambiar estado en las 3 tablas a "Pedido en proceso"
    await cambiarEstadoAPedidoEnProceso();

    return NextResponse.json({
      message:
        "Datos exportados a la tabla 'Producto' exitosamente y estados actualizados a 'Pedido en proceso'.",
    });
  } catch (err) {
    console.error("❌ Error al exportar datos o cambiar estado:", err);
    return NextResponse.json({ error: "Error al exportar datos" }, { status: 500 });
  }
}

/**
 * Cambia el estado de "Pedido Realizado" a "Pedido en proceso"
 * en las tablas: pedidos_ec, facturacion_ec, historial_compras_ec.
 */
async function cambiarEstadoAPedidoEnProceso() {
  // Buscar todos los historiales con estado "Pedido Realizado"
  const historiales = await prisma.historial_compras_ec.findMany({
    where: { estado: "Pedido Realizado" },
    select: { transaction_id: true },
  });

  // Si no hay pedidos en ese estado, salir
  if (historiales.length === 0) return;

  // Obtener los transaction_id de los pedidos a actualizar
  const transactionIds = historiales
    .map((h) => h.transaction_id)
    .filter((id): id is string => Boolean(id)); // Asegurar que no haya nulls

  // a) Actualizar en historial_compras_ec
  await prisma.historial_compras_ec.updateMany({
    where: { transaction_id: { in: transactionIds } },
    data: { estado: "Pedido en proceso" },
  });

  // b) Actualizar en facturacion_ec
  await prisma.facturacion_ec.updateMany({
    where: { transaction_id: { in: transactionIds } },
    data: { estado: "Pedido en proceso" },
  });

  // Obtener los id_factura asociados a esos transaction_id en facturacion_ec
  const idFacturaList = await prisma.facturacion_ec.findMany({
    where: { transaction_id: { in: transactionIds } },
    select: { id: true },
  });

  // Convertir los id_factura en un array de números asegurando que no haya nulls
  const idFacturaNumbers = idFacturaList
    .map((f) => f.id)
    .filter((id): id is number => Boolean(id));

  // c) Actualizar en pedidos_ec solo si hay IDs válidos
  if (idFacturaNumbers.length > 0) {
    await prisma.pedidos_ec.updateMany({
      where: { id_factura: { in: idFacturaNumbers } },
      data: { estado: "Pedido en proceso" },
    });
  }
}

/**
 * Obtiene los "pedidos" con estado "Pedido Realizado" 
 * directamente desde 'historial_compras_ec', junto con:
 * - código de empleado (usuarios_ecommerce)
 * - productos_comprados (productos_ec)
 */
async function obtenerDatosDesdeHistorial() {
  // 1. Buscar historiales con estado "Pedido Realizado"
  const historiales = await prisma.historial_compras_ec.findMany({
    where: { estado: "Pedido Realizado" },
    include: {
      usuarios_ecommerce: {
        select: { codigo_empleado: true },
      },
      productos_comprados: {
        include: {
          productos_ec: {
            select: { CodArticulo: true },
          },
        },
      },
    },
  });

  const resultados: Array<{
    codigoEmpleado: string;
    codigoProducto: string;
    cantidad: number;
    fechaPedido: Date | null;
    transactionId: string;
  }> = [];

  // 2. Recorrer cada historial, juntar datos
  for (const h of historiales) {
    for (const pc of h.productos_comprados) {
      resultados.push({
        codigoEmpleado: h.usuarios_ecommerce.codigo_empleado.slice(0, 20),
        codigoProducto: pc.productos_ec?.CodArticulo?.toString() || "N/A",
        cantidad: pc.cantidad,
        fechaPedido: h.fecha_hora, // fecha del historial
        transactionId: h.transaction_id, // transactionId del historial
      });
    }
  }

  return resultados;
}
