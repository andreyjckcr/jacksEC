"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import toast from "react-hot-toast"
import Link from "next/link"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [codigoEmpleado, setCodigoEmpleado] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      codigo_empleado: codigoEmpleado,
      redirect: false,
    });

    if (!result?.error) {
      // ✅ Obtener la sesión para verificar el rol
      const res = await fetch("/api/auth/session");
      const session = await res.json();

      console.log("🔍 Sesión obtenida:", session); // 👀 Revisar si el rol está presente

      if (session.user?.rol === "administrador") {
        router.push("/admin"); // 🚀 Redirigir a la página de administrador
      } else if (session.user?.rol === "despachante") {
        router.push("/despacho"); // 🚀 Redirigir a la página de despachante
      } else {
        router.push("/dashboard"); // 🚀 Redirigir al dashboard normal
      }

      toast.success("Inicio de sesión exitoso");
    } else {
      toast.error("Error en el inicio de sesión");
    }
  };

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

