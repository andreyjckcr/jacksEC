"use client";

import Link from "next/link";
import { ShoppingCart, Bell, User, Info } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./ui/tooltip";
import { useCartStore } from "../app/cartStore/cartStore";

export function Navbar() {
  const cartCount = useCartStore((state) => state.cartCount);
  const fetchCartCount = useCartStore((state) => state.fetchCartCount);

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  const [totalGastado, setTotalGastado] = useState<number>(0);
  const LIMITE_SEMANAL = 12000; // Límite semanal

  // ✅ Obtener el total gastado de la última semana
  useEffect(() => {
    async function fetchTotalSpent() {
      try {
        const response = await fetch("/api/total-gastado");
        if (!response.ok) throw new Error("Error al obtener el gasto semanal");

        const data = await response.json();
        setTotalGastado(data.totalGastado || 0);
      } catch (error) {
        console.error("❌ Error obteniendo el gasto semanal:", error);
      }
    }

    fetchTotalSpent();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  function SaldoGastadoTooltip({ totalGastado, LIMITE_SEMANAL, formatCurrency }: any) {
    const [open, setOpen] = useState(false);

    return (
      <div className="flex items-center space-x-2 md:ml-10 lg:ml-20">
        <TooltipProvider>
          <Tooltip open={open} onOpenChange={setOpen}>
            <TooltipTrigger asChild>
              <button
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                onClick={() => setOpen((prev) => !prev)} // 🔄 Toggle manual para móviles
              >
                <Info className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-white text-black border border-gray-300 shadow-md px-3 py-2 rounded-md">
              <p>💰 Puedes gastar hasta ₡12,000 semanalmente.</p>
              <p>🔹 Aquí ves cuánto has gastado esta semana.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <span
          className={`
            text-sm               /* Font pequeño en móviles */
            md:text-base          /* Font normal en pantallas medianas */
            lg:text-lg            /* Font más grande en pantallas grandes */
            font-bold 
            ${totalGastado >= LIMITE_SEMANAL ? "text-red-500" : "text-blue-600"}
          `}
        >
          ₡{formatCurrency(totalGastado)} / ₡{formatCurrency(LIMITE_SEMANAL)}
        </span>
      </div>
    );
  }

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* 🔹 Logo */}
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/logoJacks.png"
              alt="Jack's Logo"
              width={100}
              height={50}
              className="h-8 w-auto"
            />
          </Link>

          {/* 🔹 Saldo Gastado */}
          <SaldoGastadoTooltip
            totalGastado={totalGastado}
            LIMITE_SEMANAL={LIMITE_SEMANAL}
            formatCurrency={formatCurrency}
          />

          {/* 🔹 Right Side Icons */}
          <div className="flex items-center space-x-6">
            {/* 🔔 Notificaciones */}
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/notifications" className="text-gray-700 hover:text-blue-600">
                    <Bell className="h-6 w-6" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="bg-white text-black border border-gray-300 shadow-md px-3 py-2 rounded-md">
                  <p>Notificaciones</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* 🛒 Carrito con contador */}
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/cart" className="relative text-gray-700 hover:text-blue-600">
                    <ShoppingCart className="h-6 w-6" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="bg-white text-black border border-gray-300 shadow-md px-3 py-2 rounded-md">
                  <p>Carrito de compras</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* 👤 Perfil */}
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/profile" className="text-gray-700 hover:text-blue-600">
                    <User className="h-6 w-6" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="bg-white text-black border border-gray-300 shadow-md px-3 py-2 rounded-md">
                  <p>Perfil</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </nav>
  );
}
