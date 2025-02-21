"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../../../../components/ui/button";

interface SuccessData {
  nombreEmpleado: string;
  codigoEmpleado: string;
  correoEmpleado: string;
}

export default function DespachoSuccessPage() {
  const router = useRouter();
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  useEffect(() => {
    // ✅ Recuperar datos del empleado desde localStorage
    const storedSuccessData = localStorage.getItem("despacho_success_data");

    if (storedSuccessData) {
      setSuccessData(JSON.parse(storedSuccessData));
      // Limpiar los datos después de usarlos
      localStorage.removeItem("despacho_success_data");
    }

    // ⏳ Cuenta regresiva para redirigir a /despacho
    const timer = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/despacho");
        }
        return prev - 1;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center space-y-6">
        <Image
          src="/logoJacks.png"
          alt="Jack's Logo"
          width={200}
          height={100}
          className="mx-auto"
          priority
        />
        <h1 className="text-3xl font-bold text-gray-800">¡Compra Realizada con Éxito! ✅</h1>

        {successData ? (
          <div className="text-gray-700 space-y-2">
            <p>
              La compra se ha registrado a nombre del empleado{" "}
              <strong>{successData.nombreEmpleado}</strong> con código{" "}
              <strong>{successData.codigoEmpleado}</strong>.
            </p>
            <p>
              La factura fue enviada al correo:{" "}
              <strong>{successData.correoEmpleado}</strong>.
            </p>
          </div>
        ) : (
          <p className="text-gray-500">Cargando detalles de la compra...</p>
        )}

        <p className="text-sm text-gray-500">
          Redirigiendo a la página de despacho en {redirectCountdown} segundos...
        </p>

        <Link href="/despacho">
          <Button variant="link" className="text-blue-600 hover:text-blue-800">
            Si no has vuelto a la página de despacho, toca aquí
          </Button>
        </Link>
      </div>
    </div>
  );
}
