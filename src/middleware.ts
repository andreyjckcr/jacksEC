import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    pages: {
      signIn: "/login", // Redirigir a /login si no ha iniciado sesión
    },
  }
)

// 🔒 Especificar qué rutas están protegidas
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
  ], // Agrega aquí las rutas privadas
}
