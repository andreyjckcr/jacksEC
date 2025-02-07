import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
          throw new Error("Faltan credenciales");
        }
        const { email, codigo_empleado } = credentials;

        // **Verificar si el usuario existe en la BD**
        const user = await prisma.usuarios_ecommerce.findUnique({
          where: { codigo_empleado },
          select: { id: true, nombre: true, correo: true, estado: true, rol: true }, // ✅ Incluir el rol
        });

        if (!user) {
          console.log("❌ Usuario no encontrado");
          return null;
        }

        if (user.estado !== "Activo") {
          console.log("❌ Usuario inactivo");
          return null;
        }

        if (user.correo.toLowerCase() !== email.toLowerCase()) {
          console.log("❌ Email incorrecto");
          return null;
        }

        console.log(`✅ Usuario autenticado (${user.rol}): ${user.nombre}`);
        return {
          id: user.id.toString(),
          codigo_empleado,
          name: user.nombre,
          email: user.correo,
          rol: user.rol, // ✅ Agregar el rol
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id;
      session.user.rol = token.rol; // ✅ Agregar el rol a la sesión
      return session;
    },
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.rol = user.rol; // ✅ Guardar el rol en el token JWT
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
