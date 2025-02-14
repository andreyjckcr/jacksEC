// generateInvoice.ts
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
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const page = pdfDoc.addPage([600, 500]);
  const { width, height } = page.getSize();
  const customFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText("Factura de Compra", {
    x: 50,
    y: height - 50,
    size: 18,
    font: customFont,
    color: rgb(0, 0, 0),
  });
  // ... dibujar contenido adicional ...

  const pdfBytes = await pdfDoc.save();
  const pdfBase64 = Buffer.from(pdfBytes).toString("base64");
  return `data:application/pdf;base64,${pdfBase64}`;
}
