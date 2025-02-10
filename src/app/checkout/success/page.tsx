"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../../../../components/ui/button"
import { generatePDF } from "../../../lib/pdfGenerator"

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const [redirectCountdown, setRedirectCountdown] = useState(5)

  useEffect(() => {
    // Recuperar datos de la factura
    const invoiceData = localStorage.getItem("lastInvoice")
    if (invoiceData) {
      // Generar y descargar el PDF
      generatePDF(JSON.parse(invoiceData))
      // Limpiar los datos de la factura
      localStorage.removeItem("lastInvoice")
    }

    // Iniciar cuenta regresiva para redirección
    const timer = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/dashboard")
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center space-y-6">
        <Image
          src="https://www.jacks.co.cr/wp-content/uploads/2024/02/logo60jacks_1.png"
          alt="Jack's Logo"
          width={200}
          height={100}
          className="mx-auto"
          priority
        />
        <h1 className="text-3xl font-bold text-gray-800">¡Gracias por comprar nuestros productos!</h1>
        <p className="text-gray-600">Tu factura ha sido generada y descargada automáticamente.</p>
        <p className="text-sm text-gray-500">Redirigiendo a la página principal en {redirectCountdown} segundos...</p>
        <Link href="/dashboard">
          <Button variant="link" className="text-blue-600 hover:text-blue-800">
            Si no has vuelto a la página principal, toca aquí
          </Button>
        </Link>
      </div>
    </div>
  )
}

