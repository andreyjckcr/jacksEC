import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Correo Electrónico", type: "email" },
        codigo_empleado: { label: "Código de Empleado", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Missing credentials")
        }
        const { email, codigo_empleado } = credentials


        // **Verificar si el usuario existe en la BD**
        const user = await prisma.usuarios_ecommerce.findUnique({
          where: { codigo_empleado },
        })


        // **Si no existe, retornar null**
        if (!user) {
          console.log("❌ Usuario no encontrado")
          return null
        }

        // **Verificar si el usuario está activo**
        if (user.estado !== "Activo") {
          console.log("❌ Usuario inactivo")
          return null
        }

        // **Comparar emails sin importar mayúsculas/minúsculas**
        if (user.correo.toLowerCase() !== email.toLowerCase()) {
          console.log("❌ Email incorrecto")
          return null
        }

        console.log("✅ Usuario autenticado:", user.nombre)
        return {
          id: user.id.toString(),
          codigo_empleado: user.codigo_empleado,
          name: user.nombre,
          email: user.correo,
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: any, token: any }) {
      session.user.id = token.id
      return session
    },
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
