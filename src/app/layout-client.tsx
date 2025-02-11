"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";
import { Analytics } from "@vercel/analytics/react";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <Toaster position="top-right" />
        <Analytics />
      </CartProvider>
    </SessionProvider>
  );
}
