import { NextAuthOptions, Session, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Extend the Session and User types to include id and rol
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
        email: { label: "Correo Electrónico", type: "email" },
        codigo_empleado: { label: "Código de Empleado", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Faltan credenciales");
        }
        const { email, codigo_empleado } = credentials;

        const user = await prisma.usuarios_ecommerce.findUnique({
          where: { codigo_empleado },
          select: { id: true, nombre: true, correo: true, estado: true, rol: true },
        });

        if (!user || user.estado !== "Activo" || user.correo.toLowerCase() !== email.toLowerCase()) {
          console.log("❌ Usuario no válido");
          return null;
        }

        return {
          id: user.id.toString(),
          codigo_empleado,
          name: user.nombre,
          email: user.correo,
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
