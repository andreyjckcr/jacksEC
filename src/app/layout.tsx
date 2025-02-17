"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    console.log("🟢 Intentando registrar Service Worker..."); // DEBUG
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("✅ Service Worker registrado"))
        .catch((err) => console.error("❌ Error registrando Service Worker:", err));
    } else {
      console.error("❌ Service Worker NO es compatible en este navegador");
    }
  }, []);

  return (
    <html lang="es">
      <head>
        <title>Jack's E-commerce</title>
        <meta name="description" content="Compra tus snacks favoritos en línea." />
        <meta name="theme-color" content="#1B3668" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          {children}
          <Toaster position="top-right" />
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  );
}
