"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import toast from "react-hot-toast"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function Login() {
  const [email, setEmail] = useState("")
  const [codigoEmpleado, setCodigoEmpleado] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Llamamos a NextAuth con las credenciales correctas
    const result = await signIn("credentials", {
      redirect: false,
      email,
      codigo_empleado: codigoEmpleado, // Debe coincidir con el nombre en `route.ts`
    })

    if (result?.error) {
      console.log("❌ Error en login:", result.error)
      toast.error("Credenciales incorrectas")
      return
    }

    // 🔥 Login exitoso
    toast.success("Inicio de sesión exitoso!")

    // 🔄 Redirigir al dashboard
    setTimeout(() => {
      router.push("/dashboard")
    }, 2000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-[#e6f0ff] p-8 flex flex-col items-center justify-center">
        <div className="mb-4">
          <Image
            src="https://www.jacks.co.cr/wp-content/uploads/2024/02/logo60jacks_1.png"
            alt="Logo Jack's"
            width={300}
            height={150}
            className="drop-shadow-lg max-w-full h-auto"
            priority
          />
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 text-center">
          App Jack&apos;s - Compra desde donde tu quieras
        </h2>
      </div>

      <div className="flex-grow flex items-center justify-center p-4 overflow-y-auto bg-white">
        <div className="w-full max-w-[320px] space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12"
            />
            <Input
              type="text"
              placeholder="Código de Empleado"
              value={codigoEmpleado}
              onChange={(e) => setCodigoEmpleado(e.target.value)}
              required
              className="h-12"
            />
            <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 h-12 text-base font-normal">
              Iniciar Sesión
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Crear cuenta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

