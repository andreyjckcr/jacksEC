"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, User, Menu, Search, Bell } from "lucide-react";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "../../../components/ui/sheet";
import { Button } from "../../../components/ui/button";
import { useCartStore } from "../cartStore/cartStore";

export function Navbar() {
  const cartCount = useCartStore((state) => state.cartCount);
  const fetchCartCount = useCartStore((state) => state.fetchCartCount);

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  const [searchTerm, setSearchTerm] = useState("");
  interface Product {
    Id: number;
    NomArticulo: string;
  }
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/products?search=${term}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("❌ Error al buscar productos:", error);
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <nav className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <nav className="flex flex-col space-y-4 mt-4">
                    <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                      Inicio
                    </Link>
                   {/* <Link href="/promotions" className="text-gray-700 hover:text-blue-600 font-medium">
                      Promociones
                    </Link>
                    <Link href="/new-products" className="text-gray-700 hover:text-blue-600 font-medium">
                      Novedades
                    </Link> */}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <div className="flex-1 flex justify-center md:justify-start md:w-1/4">
              <Link href="/dashboard" className="flex items-center">
                <Image
                  src="/logoJacks.png"
                  alt="Jack's Logo"
                  width={100}
                  height={50}
                  className="h-8 w-auto"
                />
              </Link>
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
                  <TooltipContent className="bg-white text-black border border-gray-300 shadow-md px-3 py-1 rounded-md">
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
                  <TooltipContent className="bg-white text-black border border-gray-300 shadow-md px-3 py-1 rounded-md">
                    <p>Perfil</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </nav>
    </TooltipProvider>
  );
}
