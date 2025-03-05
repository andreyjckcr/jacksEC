import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    // Obtener el token del usuario (incluye la propiedad 'rol' definida en callbacks)
    const token = req.nextauth?.token;

    // Si el usuario es administrador o despachante, no se aplica la validación de miércoles
    if (token && (token.rol === "administrador" || token.rol === "despachante")) {
      return NextResponse.next();
    }

    // Verificar si hoy es miércoles (usa getDay() para hora local, getUTCDay() para UTC)
    const today = new Date().getUTCDay();
    if (today === 3 && pathname !== "/miercoles") {
      return NextResponse.redirect(new URL("/miercoles", req.url));
    }
    
    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login", // Redirige a /login si no está autenticado
    },
  }
);
// Rutas protegidas
export const config = {
  matcher: [
    "/dashboard",
    "/profile",
    "/promotions",
    "/new-products",
    "/cart",
    "/checkout",
    "/despacho",
    "/entregas",
    "/despacho/checkout",
    "/admin",
  ], // Rutas protegidas
};
