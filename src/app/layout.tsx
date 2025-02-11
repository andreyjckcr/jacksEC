"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";
import "./globals.css";
import type React from "react";
import { CartProvider } from "./context/CartContext";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Jack's E-commerce",
  description: "Compra tus snacks favoritos en línea.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SessionProvider>
          <CartProvider>
            {children}
            <Toaster position="top-right" />
            <Analytics />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

