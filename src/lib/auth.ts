import { NextAuthOptions, Session, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 🔹 Extender la sesión y el usuario para incluir ID y Rol
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      rol: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    rol: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        cedula: { label: "Cédula", type: "text" },
        codigo_empleado: { label: "Código de Empleado", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Faltan credenciales");
        }

        const { cedula, codigo_empleado } = credentials;

        // ✅ Buscar usuario por cédula y código de empleado
        const user = await prisma.usuarios_ecommerce.findFirst({
          where: { cedula, codigo_empleado },
          select: { id: true, nombre: true, rol: true, estado: true },
        });

        // 🚨 Verificar si el usuario existe y está activo
        if (!user || user.estado !== "Activo") {
          console.log("❌ Usuario no válido");
          return null;
        }

        return {
          id: user.id.toString(),
          name: user.nombre,
          cedula,
          codigo_empleado,
          rol: user.rol,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.rol = token.rol as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.rol = user.rol;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // ✅ Usar JWT para evitar problemas de sesión
  },
};
