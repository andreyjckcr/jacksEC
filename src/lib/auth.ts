import { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { sendLoginNotification } from "../../lib/emailService";

const prisma = new PrismaClient();

declare module "next-auth" {
  interface User {
    id: string;
    rol: string;
  }

  interface Session {
    user: User;
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
      async authorize(credentials, req) {
        if (!credentials) throw new Error("Faltan credenciales");

        const { cedula, codigo_empleado } = credentials;

        // ✅ Obtener IP y User-Agent del usuario
        const ip = req.headers ? (req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || "IP desconocida") : "IP desconocida";
        const userAgent = req.headers ? (req.headers["user-agent"] || "Desconocido") : "Desconocido";

        // ✅ Buscar usuario en la BD
        const user = await prisma.usuarios_ecommerce.findFirst({
          where: { cedula, codigo_empleado },
          select: {
            id: true,
            nombre: true,
            rol: true,
            estado: true,
            intentosFallidos: true,
            bloqueoHasta: true,
            correo: true,
          },
        });

        // 🚨 Validaciones
        if (!user || user.estado !== "Activo") {
          throw new Error("Usuario no válido o inactivo");
        }

        // 🚨 Verificar si el usuario está bloqueado
        const ahora = new Date();
        if (user.bloqueoHasta && ahora < user.bloqueoHasta) {
          const segundosRestantes = Math.ceil((user.bloqueoHasta.getTime() - ahora.getTime()) / 1000);
          throw new Error(`Cuenta bloqueada. Intenta en ${segundosRestantes} segundos`);
        }

        // ✅ Si las credenciales son correctas, reiniciar intentos fallidos
        await prisma.usuarios_ecommerce.update({
          where: { id: user.id },
          data: { intentosFallidos: 0, bloqueoHasta: null },
        });

        // ✅ Enviar notificación de inicio de sesión
        try {
          await sendLoginNotification(user.correo, user.nombre, ip as string, userAgent);
        } catch (error) {
          console.error("❌ Error enviando notificación de inicio de sesión:", error);
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
    strategy: "jwt",
  },
};
