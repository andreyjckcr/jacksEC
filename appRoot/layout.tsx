import { Toaster } from "react-hot-toast"
import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { CartProvider } from "../src/app/context/CartContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Jack's E-commerce",
  description: "Aplicación de compras para empleados de Jack's",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <CartProvider>
          {children}
          <Toaster position="top-right" />
        </CartProvider>
      </body>
    </html>
  )
}
