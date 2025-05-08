import Image from "next/image"
import Link from "next/link"
import { Button } from "../components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white md:flex-row">
      {/* Logo e imagen - visible en todos los tamaños de pantalla */}
      <div className="w-full md:w-1/2 bg-[#edf4ff] p-8 flex flex-col items-center justify-center">
        <div className="mb-4">
          <Image
            src="/logoJacks.png"
            alt="Logo Jack's"
            width={300}
            height={150}
            className="h-auto max-w-full drop-shadow-lg"
            priority
          />
        </div>
        <h2 className="text-xl font-semibold text-center text-gray-800 md:text-2xl">
          App Jack&apos;s - Compra desde donde tu quieras
        </h2>
      </div>

      {/* Columna de botones */}
      <div className="flex items-center justify-center w-full p-8 md:w-1/2">
        <div className="w-full max-w-[320px] flex flex-col gap-4">
          <Link href="/login" className="block">
            <Button
              className="w-full h-12 text-base font-normal text-white bg-black hover:bg-gray-800"
              variant="default"
            >
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/register" className="block">
            <Button
              className="w-full h-12 text-base font-normal text-white bg-black hover:bg-gray-800"
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