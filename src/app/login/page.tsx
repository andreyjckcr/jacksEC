"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Image from "next/image";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [cedula, setCedula] = useState("");
  const [codigoEmpleado, setCodigoEmpleado] = useState("");
  const [intentosRestantes, setIntentosRestantes] = useState(5);
  const [bloqueadoHasta, setBloqueadoHasta] = useState<number | null>(null);
  const [tiempoRestante, setTiempoRestante] = useState(0);

  useEffect(() => {
    const storedBloqueo = localStorage.getItem("bloqueadoHasta");
    if (storedBloqueo) {
      const bloqueoTime = parseInt(storedBloqueo, 10);
      const now = Date.now();
      if (bloqueoTime > now) {
        setBloqueadoHasta(bloqueoTime);
      } else {
        localStorage.removeItem("bloqueadoHasta");
      }
    }
  }, []);

  useEffect(() => {
    if (bloqueadoHasta) {
      const interval = setInterval(() => {
        const now = Date.now();
        if (bloqueadoHasta > now) {
          setTiempoRestante(Math.ceil((bloqueadoHasta - now) / 1000));
        } else {
          setBloqueadoHasta(null);
          setIntentosRestantes(5);
          localStorage.removeItem("bloqueadoHasta");
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [bloqueadoHasta]);

  // 🔒 Bloquear navegación manual a otras rutas los miércoles
  useEffect(() => {
    const today = new Date().getUTCDay();
    if (today === 3 && session && pathname !== "/miercoles") {
      router.push("/miercoles");
    }
  }, [session, pathname, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bloqueadoHasta) {
      toast.error(`Cuenta bloqueada. Espera ${tiempoRestante} segundos.`);
      return;
    }

    const result = await signIn("credentials", {
      cedula,
      codigo_empleado: codigoEmpleado,
      redirect: false,
    });

    if (!result?.error) {
      const res = await fetch("/api/auth/session");
      const session = await res.json();

      console.log("🔍 Sesión obtenida:", session);

      // ✅ Si es miércoles, redirigir a la pantalla especial
      const today = new Date().getUTCDay();
      if (today === 3) {
        router.push("/miercoles");
      } else {
        if (session.user?.rol === "administrador") {
          router.push("/admin");
        } else if (session.user?.rol === "despachante") {
          router.push("/despacho");
        } else {
          router.push("/dashboard");
        }
      }

      // Para los roles especiales, redirigir siempre a sus rutas
      if (session.user?.rol === "administrador") {
        router.push("/admin");
      } else if (session.user?.rol === "despachante") {
        router.push("/despacho");
      } else {
        // Para los demás usuarios, si es miércoles redirigir a /miercoles, de lo contrario a /dashboard
        const today = new Date().getUTCDay();
        if (today === 3) {
          router.push("/miercoles");
        } else {
          router.push("/dashboard");
        }
      }

      toast.success("Inicio de sesión exitoso");
    } else {
      setIntentosRestantes((prev) => prev - 1);
      if (intentosRestantes - 1 <= 0) {
        const bloqueoTime = Date.now() + 2 * 60 * 1000; // 2 minutos de bloqueo
        setBloqueadoHasta(bloqueoTime);
        localStorage.setItem("bloqueadoHasta", bloqueoTime.toString());
        toast.error("Demasiados intentos fallidos. Cuenta bloqueada por 2 minutos.");
      } else {
        toast.error(`Cédula o código incorrectos. Intentos restantes: ${intentosRestantes - 1}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-[#e6f0ff] p-8 flex flex-col items-center justify-center">
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
          App Jack&apos;s - Compra desde donde tú quieras
        </h2>
      </div>

      <div className="flex-grow flex items-center justify-center p-4 overflow-y-auto bg-white">
        <div className="w-full max-w-[320px] space-y-4">
          {bloqueadoHasta ? (
            <div className="text-center text-red-600 font-semibold">
              Cuenta bloqueada. Espera {tiempoRestante} segundos.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Cédula"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                required
                className="h-12"
              />
              <Input
                type="text"
                placeholder="Código de Empleado"
                value={codigoEmpleado}
                onChange={(e) => setCodigoEmpleado(e.target.value)}
                required
                className="h-12"
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-br from-[#1B3668] via-[#1B3668] to-[#2a4d8f] text-white hover:opacity-90 h-12 text-base font-normal"
              >
                Iniciar Sesión
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
