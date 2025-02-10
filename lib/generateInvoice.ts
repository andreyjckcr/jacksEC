import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

export async function generateInvoicePDF(
  transaction_id: string,
  cartItems: any[],
  total: number,
  userName: string,
  userId: number,
  userAgent: string | undefined,
  location: string
) {
  try {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const page = pdfDoc.addPage([600, 500]);
    const { width, height } = page.getSize();

    // ✅ Establecer una fuente base (sin leer archivos)
    const customFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // 📌 Encabezado de la Factura
    page.drawText("Factura de Compra", { x: 50, y: height - 50, size: 18, font: customFont, color: rgb(0, 0, 0) });

    page.drawText(`Número de Factura: ${transaction_id}`, { x: 50, y: height - 80, size: 12, font: customFont });
    page.drawText(`Fecha: ${new Date().toLocaleString()}`, { x: 50, y: height - 100, size: 12, font: customFont });

    // 📌 Información del Usuario
    page.drawText(`Usuario: ${userName} (ID: ${userId})`, { x: 50, y: height - 130, size: 12, font: customFont });

    // 📌 Método de Pago
    page.drawText("Método de Pago: Deducción de Planilla", { x: 50, y: height - 160, size: 12, font: customFont });

    // 📌 Dispositivo y Ubicación
    page.drawText(`Ubicación: ${location || "Online"}`, { x: 50, y: height - 190, size: 12, font: customFont });

    // 📌 Agregar Productos
    let yOffset = height - 220;
    cartItems.forEach((item, index) => {
      page.drawText(
        `${index + 1}. ${item.productos_ec.NomArticulo} - ${item.cantidad} unidades - ₡${(Number(item.productos_ec.Precio) || 0).toFixed(2)}`,
        { x: 50, y: yOffset, size: 10, font: customFont }
      );
      yOffset -= 20;
    });

    // 📌 Total
    page.drawText(`Total: ₡${total.toFixed(2)}`, { x: 50, y: yOffset - 30, size: 14, font: customFont });

    // 📂 Guardar el PDF en memoria y devolverlo
    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = Buffer.from(pdfBytes).toString("base64");

    return `data:application/pdf;base64,${pdfBase64}`;
  } catch (error) {
    console.error("❌ Error generando PDF:", error);
    throw new Error("No se pudo generar el PDF.");
  }
}
