import Image from "next/image"
import Link from "next/link"
import { Button } from "../../components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Logo e imagen - visible en todos los tamaños de pantalla */}
      <div className="w-full md:w-1/2 bg-[#edf4ff] p-8 flex flex-col items-center justify-center">
        <div className="mb-4">
          <Image
            src="/logoJacks.png"
            alt="Logo Jack's"
            width={300}
            height={150}
            className="drop-shadow-lg max-w-full h-auto"
            priority
          />
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 text-center">
          App Jack&apos;s - Compra desde donde tu quieras
        </h2>
      </div>

      {/* Columna de botones */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-[320px] flex flex-col gap-4">
          <Link href="/login" className="block">
            <Button
              className="w-full bg-black text-white hover:bg-gray-800 h-12 text-base font-normal"
              variant="default"
            >
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/register" className="block">
            <Button
              className="w-full bg-black text-white hover:bg-gray-800 h-12 text-base font-normal"
              variant="default"
            >
              Crear Cuenta
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

