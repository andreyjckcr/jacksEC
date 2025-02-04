import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"

export default function Login() {
  const [email, setEmail] = useState("")
  const [employeeCode, setEmployeeCode] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    try {
      const response = await fetch("/api/login", {
        method: "POST", // Asegurar que sea POST
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo: employeeCode }),
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error)
      }

      toast.success("Inicio de sesión exitoso", {
        style: {
          border: "1px solid #3B82F6",
          padding: "16px",
          color: "#1F2937",
        },
        iconTheme: {
          primary: "#3B82F6",
          secondary: "#FFFFFF",
        },
      })
      router.push("/")
    } catch (error: any) {
      console.log("❌ Error en login:", error.message)
      toast.error(error.message, {
        style: {
          border: "1px solid #EF4444",
          padding: "16px",
          color: "#1F2937",
        },
        iconTheme: {
          primary: "#EF4444",
          secondary: "#FFFFFF",
        },
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Iniciar Sesión</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Correo Electrónico"
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Código de Empleado"
            id="employeeCode"
            name="employeeCode"
            type="text"
            required
            value={employeeCode}
            onChange={(e) => setEmployeeCode(e.target.value)}
          />
          <Button type="submit">Iniciar Sesión</Button>
        </form>
      </div>
    </div>
  )
}

