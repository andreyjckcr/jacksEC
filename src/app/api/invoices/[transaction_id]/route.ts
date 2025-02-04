import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(req: NextRequest, { params }: { params: { transaction_id: string } }) {
  const filePath = path.join(process.cwd(), "public", "invoices", `${params.transaction_id}.pdf`);

  console.log("📂 Buscando archivo:", filePath);

  if (!fs.existsSync(filePath)) {
    console.error("❌ Factura no encontrada:", filePath);
    return NextResponse.json({ error: "Factura no encontrada" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${params.transaction_id}.pdf"`,
    },
  });
}
