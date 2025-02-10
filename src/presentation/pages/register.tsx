import { useState } from "react"
import { useRouter } from "next/router"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { registerUser } from "../../../lib/registerUser"
import { toast } from "react-hot-toast"

export default function Register() {
  const [employeeCode, setEmployeeCode] = useState("")
  const [cedula, setCedula] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
      await registerUser(employeeCode, name, email, cedula, phone)
    try {
      await registerUser(employeeCode, name, email, cedula, phone)
      toast.success("Usuario registrado correctamente", {
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
      router.push("/login")
    } catch (error) {
      toast.error("Error al registrar usuario", {
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Registro de Empleado</h2>
          </div>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            id="phone"
            name="phone"
            type="text"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        <Input
          id="name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          id="phone"
          name="phone"
          type="text"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            id="employeeCode"
            name="employeeCode"
            type="text"
            required
            value={employeeCode}
            onChange={(e) => setEmployeeCode(e.target.value)}
          />
          <Input
            id="cedula"
            name="cedula"
            type="text"
            required
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
          />
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit">Registrar</Button>
        </form>
          <Input
            id="employeeCode"
            name="employeeCode"
            type="text"
            required
            value={employeeCode}
            onChange={(e) => setEmployeeCode(e.target.value)}
          />
          <Input
            id="cedula"
            name="cedula"
            type="text"
            required
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
          />
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
      </div>
    </div>
  )
}

