interface InvoiceData {
  items: any[]
  total: number
  date: string
  invoiceNumber: string
  device: string
  location: string
}

export const generatePDF = (invoiceData: InvoiceData) => {
  // En una implementación real, aquí usaríamos una librería como jsPDF
  // Por ahora, simularemos la descarga con un archivo de texto
  const invoiceContent = `
FACTURA JACK'S
Número: ${invoiceData.invoiceNumber}
Fecha: ${new Date(invoiceData.date).toLocaleString()}
Ubicación: ${invoiceData.location}
Dispositivo: ${invoiceData.device}

PRODUCTOS:
${invoiceData.items
  .map(
    (item) =>
      `${item.nombre} x${item.quantity} - ₡${(
        (item.precioConDescuento || item.precio_aproximado_CRC) * item.quantity
      ).toFixed(2)}`,
  )
  .join("\n")}

TOTAL: ₡${invoiceData.total.toFixed(2)}

Gracias por tu compra!
`.trim()

  // Crear un blob con el contenido
  const blob = new Blob([invoiceContent], { type: "text/plain" })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `factura-${invoiceData.invoiceNumber}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

