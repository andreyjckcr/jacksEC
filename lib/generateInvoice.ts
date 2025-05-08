import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fs from "fs";
import path from "path";

export async function generateInvoicePDF(
  transaction_id: string,
  cartItems: any[],
  total: number,
  userName: string,
  userId: number,
  userAgent: string | undefined,
  location: string,
  fechaCompra: Date
) {
  try {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const page = pdfDoc.addPage([300, 500]); // Tamaño tipo recibo
    const { width, height } = page.getSize();

    // ✅ Establecer fuente Helvetica
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let yOffset = height - 30;

    // 📌 **Cargar el Logo**
    const logoPath = path.join(process.cwd(), "public", "logoJacks.png");
    const logoBytes = fs.readFileSync(logoPath);
    const logoImage = await pdfDoc.embedPng(logoBytes);
    const logoDims = logoImage.scale(0.5); // Escalar imagen si es muy grande

    // 🔹 Dibujar el logo en el PDF
    page.drawImage(logoImage, {
      x: (width - logoDims.width) / 2,
      y: height - logoDims.height - 20, // Espaciado desde el borde superior
      width: logoDims.width,
      height: logoDims.height,
    });

    yOffset -= logoDims.height + 10; // Ajustar espacio después del logo

    // 📌 ENCABEZADO PRINCIPAL
    page.drawText("ALIMENTOS JACK'S", { x: 60, y: yOffset, size: 12, font: fontBold });
    yOffset -= 15;
    page.drawText("VENTAS AL PERSONAL", { x: 60, y: yOffset, size: 10, font });

    // 📌 DATOS DE FACTURA Y CLIENTE
    yOffset -= 30;
    page.drawText(`Pedido No.: ${transaction_id}`, { x: 20, y: yOffset, size: 10, font });
    page.drawText(`Fecha: ${fechaCompra.toLocaleDateString()}`, { x: 170, y: yOffset, size: 10, font });

    yOffset -= 15;
    page.drawText(`${userName}`, { x: 20, y: yOffset, size: 10, font: fontBold });
    yOffset -= 15;
    page.drawText(`${location || "Online"}`, { x: 20, y: yOffset, size: 10, font });

    // 📌 LÍNEA DIVISORIA
    yOffset -= 10;
    page.drawLine({
      start: { x: 20, y: yOffset },
      end: { x: width - 20, y: yOffset },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    // 📌 ENCABEZADOS DE LA TABLA
    yOffset -= 15;
    page.drawText("Descripción", { x: 20, y: yOffset, size: 10, font: fontBold });
    page.drawText("Qty", { x: 180, y: yOffset, size: 10, font: fontBold });
    page.drawText("Total", { x: 220, y: yOffset, size: 10, font: fontBold });

    // 📌 PRODUCTOS EN LA FACTURA
    yOffset -= 15;
    cartItems.forEach((item) => {
      page.drawText(`${item.productos_ec.NomArticulo}`, { x: 20, y: yOffset, size: 10, font });
      page.drawText(`${item.cantidad}`, { x: 185, y: yOffset, size: 10, font });
      page.drawText(`CRC${(Number(item.productos_ec.Precio) * item.cantidad).toFixed(2)}`, {
        x: 220,
        y: yOffset,
        size: 10,
        font,
      });
      yOffset -= 15;
    });

    // 📌 LÍNEA DIVISORIA FINAL
    yOffset -= 5;
    page.drawLine({
      start: { x: 20, y: yOffset },
      end: { x: width - 20, y: yOffset },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    // 📌 SUBTOTAL, IMPUESTO Y TOTAL
    //const impuesto = total * 0.13; // Suponiendo un IVA del 13%
    //const subtotal = total - impuesto;

    //yOffset -= 15;
   // page.drawText(`SubTotal`, { x: 150, y: yOffset, size: 10, font });
    //page.drawText(`CRC${subtotal.toFixed(2)}`, { x: 220, y: yOffset, size: 10, font });

    //yOffset -= 15;
    //page.drawText(`Impuesto`, { x: 150, y: yOffset, size: 10, font });
    //page.drawText(`CRC${impuesto.toFixed(2)}`, { x: 220, y: yOffset, size: 10, font });

    yOffset -= 15;
    page.drawText(`Total`, { x: 150, y: yOffset, size: 10, font: fontBold });
    page.drawText(`CRC${total.toFixed(2)}`, { x: 220, y: yOffset, size: 10, font: fontBold });

    // 📌 MENSAJE DE AGRADECIMIENTO
    yOffset -= 30;
    page.drawText("Gracias por su compra", { x: 60, y: yOffset, size: 10, font: fontBold });

    // 📂 Guardar el PDF en memoria y devolverlo
    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = Buffer.from(pdfBytes).toString("base64");

    return `data:application/pdf;base64,${pdfBase64}`;
  } catch (error) {
    console.error("❌ Error generando PDF:", error);
    throw new Error("No se pudo generar el PDF.");
  }
}
