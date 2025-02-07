"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type UserWithRole = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  rol?: string | null;
};
export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Esperar la carga de la sesión
    if (!session || !session.user || (session.user as UserWithRole).rol !== "administrador") {
      router.push("/"); // Redirect to home if not an admin
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800">🔹 Panel de Administración</h1>
    </div>
  );
}

