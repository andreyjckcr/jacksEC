"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import Image from "next/image"
import { registerUser } from "@/lib/registerUser";
import { Label } from "@/components/ui/label"

export default function Register() {
  const [employeeCode, setEmployeeCode] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [cedula, setCedula] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!employeeCode || !name || !email || !cedula || !phone) {
      toast.error("Por favor, complete todos los campos obligatorios")
      return
    }

    const result = await registerUser(employeeCode, name, email, cedula, phone, address)

    if (result.success) {
      toast.success(result.message || "Registro exitoso", {
        duration: 3000,
        position: "top-center",
      })

      // 🔄 Redirigir al login después del registro
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } else {
      toast.error(result.error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Logo e imagen - visible en todos los tamaños de pantalla */}
      <div className="bg-[#edf4ff] p-8 flex flex-col items-center justify-center">
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

      {/* Formulario - en un contenedor scrollable */}
      <div className="flex-grow flex items-center justify-center p-4 overflow-y-auto bg-white">
        <div className="w-full max-w-md space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employeeCode">Código de Empleado (Completo) *</Label>
              <Input
                id="employeeCode"
                type="text"
                placeholder="Código de Empleado Completo"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Nombre Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cedula">Cédula (sin guiones) *</Label>
              <Input
                id="cedula"
                type="text"
                placeholder="Cédula sin guiones"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono (sin guiones) *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Teléfono sin guiones"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección (Opcional)</Label>
              <Input
                id="address"
                type="text"
                placeholder="Dirección"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-12"
              />
            </div>
            <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 h-12 text-base font-normal">
              Crear Cuenta
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

