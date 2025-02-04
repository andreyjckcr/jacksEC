import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fs from "fs";
import path from "path";

// ✅ Función mejorada para detectar dispositivo desde el User-Agent
function detectDevice(userAgent: string | undefined): string {
  if (!userAgent) return "Desconocido";

  const ua = userAgent.toLowerCase();

  if (/android/.test(ua)) return "Android";
  if (/iphone|ipad|ipod/.test(ua)) return "iOS";
  if (/win/.test(ua)) return "Windows";
  if (/mac/.test(ua)) return "MacOS";
  if (/linux/.test(ua)) return "Linux";

  return "Desconocido";
}

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
    const invoicesDir = path.join(process.cwd(), "public", "invoices");

    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const filePath = path.join(invoicesDir, `${transaction_id}.pdf`);
    const pdfDoc = await PDFDocument.create();

    pdfDoc.registerFontkit(fontkit);

    const page = pdfDoc.addPage([600, 500]);
    const { width, height } = page.getSize();

    // ✅ Cargar la fuente Roboto
    const fontPath = path.join(process.cwd(), "public", "fonts", "Roboto-Regular.ttf");
    const fontBytes = fs.readFileSync(fontPath);
    const customFont = await pdfDoc.embedFont(fontBytes);

    const device = detectDevice(userAgent);

    // 📌 Datos de la Factura
    page.drawText("Factura de Compra", { x: 50, y: height - 50, size: 18, font: customFont, color: rgb(0, 0, 0) });

    page.drawText(`Número de Factura: ${transaction_id}`, { x: 50, y: height - 80, size: 12, font: customFont });
    page.drawText(`Fecha: ${new Date().toLocaleString()}`, { x: 50, y: height - 100, size: 12, font: customFont });

    // 📌 Información del Usuario
    page.drawText(`Usuario: ${userName} (ID: ${userId})`, { x: 50, y: height - 130, size: 12, font: customFont });

    // 📌 Método de Pago
    page.drawText("Método de Pago: Deducción de Planilla", { x: 50, y: height - 160, size: 12, font: customFont });

    // 📌 Información del Dispositivo y Ubicación
    page.drawText(`Dispositivo: ${device}`, { x: 50, y: height - 190, size: 12, font: customFont });
    page.drawText(`Ubicación: ${location || "Online"}`, { x: 50, y: height - 210, size: 12, font: customFont });

    // 📌 Agregar Productos
    let yOffset = height - 250;
    cartItems.forEach((item, index) => {
      page.drawText(
        `${index + 1}. ${item.productos_ec.NomArticulo} - ${item.cantidad} unidades - ₡${(Number(item.productos_ec.Precio) || 0).toFixed(2)}`,
        { x: 50, y: yOffset, size: 10, font: customFont }
      );
      yOffset -= 20;
    });

    // 📌 Total
    page.drawText(`Total: ₡${total.toFixed(2)}`, { x: 50, y: yOffset - 30, size: 14, font: customFont });

    // 📂 Guardar el PDF en el servidor
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(filePath, pdfBytes);

    return `/invoices/${transaction_id}.pdf`;
  } catch (error) {
    console.error("❌ Error generando PDF:", error);
    throw new Error("No se pudo generar el PDF.");
  }
}
