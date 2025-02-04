import Link from "next/link"
import { useAuthStore } from "../../context/authContext"
import { useCartStore } from "../../context/cartContext"

export const Navbar = () => {
  const { user } = useAuthStore()
  const { items } = useCartStore()

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Jack's E-commerce
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:text-blue-200">
            Inicio
          </Link>
          {/* <Link href="/promotions" className="text-gray-700 hover:text-blue-600 font-medium">
                      Promociones
                    </Link>
                    <Link href="/new-products" className="text-gray-700 hover:text-blue-600 font-medium">
                      Novedades
                    </Link> */}
          <Link href="/cart" className="hover:text-blue-200">
            Carrito ({items.length})
          </Link>
          {user ? (
            <Link href="/profile" className="hover:text-blue-200">
              Perfil
            </Link>
          ) : (
            <Link href="/login" className="hover:text-blue-200">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

