import type { User } from "../../domain/models/User"

// Datos de ejemplo
const users: User[] = [
  { id: "1", employeeCode: "EMP001", cedula: "123456789", email: "empleado1@jacks.com" },
  { id: "2", employeeCode: "EMP002", cedula: "987654321", email: "empleado2@jacks.com" },
]

export const authService = {
  async register(employeeCode: string, cedula: string, email: string): Promise<User> {
    const newUser: User = { id: String(users.length + 1), employeeCode, cedula, email }
    users.push(newUser)
    return newUser
  },

  async login(email: string, employeeCode: string): Promise<User> {
    const user = users.find((u) => u.email === email && u.employeeCode === employeeCode)
    if (!user) {
      throw new Error("Usuario no encontrado")
    }
    return user
  },
}

