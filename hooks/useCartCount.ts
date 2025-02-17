import { useEffect, useState } from "react";

export function useCartCount() {
  const [cartCount, setCartCount] = useState<number>(0);

  async function fetchCartCount() {
    try {
      const response = await fetch("/api/cart");
      if (!response.ok) throw new Error("Error al obtener el carrito");

      const data = await response.json();

      // Sumamos la cantidad total de productos en el carrito
      const totalItems = data.reduce((sum: number, item: any) => sum + item.cantidad, 0);
      setCartCount(totalItems);
    } catch (error) {
      console.error("❌ Error obteniendo la cantidad de productos en el carrito:", error);
    }
  }

  useEffect(() => {
    fetchCartCount();
  }, []);

  return { cartCount, setCartCount, fetchCartCount };
}
