import { create } from 'zustand';

interface CartState {
  cartCount: number;
  setCartCount: (count: number) => void;
  fetchCartCount: () => Promise<void>;
  increaseCartCount: (amount: number) => void;
  decreaseCartCount: (amount: number) => void;
}

export const useCartStore = create<CartState>((set) => ({
  cartCount: 0,

  // Establece directamente un valor específico
  setCartCount: (count) => set({ cartCount: count }),

  // Incrementa el contador
  increaseCartCount: (amount) =>
    set((state) => ({ cartCount: state.cartCount + amount })),

  // Decrementa el contador
  decreaseCartCount: (amount) =>
    set((state) => ({ cartCount: Math.max(0, state.cartCount - amount) })),

  // Sincroniza el contador con la cantidad total desde la BD
  fetchCartCount: async () => {
    try {
      const response = await fetch("/api/cart");
      if (!response.ok) throw new Error("Error al obtener el carrito");

      const data = await response.json();

      const totalItems = data.reduce(
        (sum: number, item: any) => sum + item.cantidad,
        0
      );

      set({ cartCount: totalItems });
    } catch (error) {
      console.error("❌ Error obteniendo el carrito:", error);
    }
  },
}));
