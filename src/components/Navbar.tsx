"use client";

import Link from "next/link";
import { ShoppingCart, Bell, User, Info } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./ui/tooltip";

export function Navbar() {
  const [totalGastado, setTotalGastado] = useState<number>(0);
  const LIMITE_SEMANAL = 12000; // Límite semanal

  // ✅ Obtener el total gastado de la última semana
  useEffect(() => {
    async function fetchTotalSpent() {
      try {
        const response = await fetch("/api/total-gastado"); // 📌 Nueva API para consultar gasto semanal
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

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* 🔹 Logo */}
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="https://www.jacks.co.cr/wp-content/uploads/2024/02/logo60jacks_1.png"
              alt="Jack's Logo"
              width={100}
              height={50}
              className="h-8 w-auto"
            />
          </Link>

          {/* 🔹 Saldo Gastado */}
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700" />
                </TooltipTrigger>
                <TooltipContent className="bg-white text-black border border-gray-300 shadow-md px-3 py-2 rounded-md">
                  <p>💰 Puedes gastar hasta ₡12,000 semanalmente.</p>
                  <p>🔹 Aquí ves cuánto has gastado esta semana.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <span className={`text-lg font-bold ${totalGastado >= LIMITE_SEMANAL ? "text-red-500" : "text-blue-600"}`}>
              ₡{formatCurrency(totalGastado)} / ₡{formatCurrency(LIMITE_SEMANAL)}
            </span>
          </div>

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

            {/* 🛒 Carrito */}
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/cart" className="text-gray-700 hover:text-blue-600">
                    <ShoppingCart className="h-6 w-6" />
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

