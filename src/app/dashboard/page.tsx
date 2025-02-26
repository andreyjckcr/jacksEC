"use client";

import { Navbar } from "../../components/Navbar";
import { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";
import { Search, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import Image from "next/image";
import { create } from "zustand";

// Interfaz de Producto
export interface Product {
  Id: number;
  CodArticulo: string;
  NomArticulo: string;
  Precio: number;
  PrecioImpuesto?: number;
  image_url?: string | null;
  categorias?: string;
  Embalaje?: string | null;
  CodCabys?: string;
  stock?: number;
}

// Propiedades que recibe ProductCard
export interface ProductCardProps {
  product: Product;
}

// Interfaz para un item del carrito
export interface CartItem {
  product: Product;
  cantidad: number;
}

// Interfaz del estado del carrito (si usas el backend, este store ya no se usará para obtener el carrito)
export interface CartState {
  cartItems: CartItem[];
  addToCart: (product: Product, cantidad?: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  removeFromCart: (productId: number) => void;
}

// Si prefieres manejar todo desde el backend, este store puede omitirse
export const useCartStore = create<CartState>((set) => ({
  cartItems: [],
  addToCart: (product, cantidad = 1) =>
    set((state) => {
      const existingItem = state.cartItems.find(item => item.product.Id === product.Id);
      if (existingItem) {
        return {
          cartItems: state.cartItems.map(item =>
            item.product.Id === product.Id
              ? { ...item, cantidad: item.cantidad + cantidad }
              : item
          ),
        };
      }
      return { cartItems: [...state.cartItems, { product, cantidad }] };
    }),
  increaseQuantity: (productId) =>
    set((state) => ({
      cartItems: state.cartItems.map(item =>
        item.product.Id === productId ? { ...item, cantidad: item.cantidad + 1 } : item
      ),
    })),
  decreaseQuantity: (productId) =>
    set((state) => ({
      cartItems: state.cartItems.map(item =>
        item.product.Id === productId
          ? { ...item, cantidad: Math.max(1, item.cantidad - 1) }
          : item
      ),
    })),
  removeFromCart: (productId) =>
    set((state) => ({
      cartItems: state.cartItems.filter(item => item.product.Id !== productId),
    })),
}));

export default function DashboardPage() {
  // Estados para productos y búsqueda
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupedProducts, setGroupedProducts] = useState<{ [key: string]: Product[] }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const router = useRouter();

  // Estado para mostrar/ocultar el mini carrito
  const [showCart, setShowCart] = useState<boolean>(false);

  // Estado para los items del carrito obtenidos del backend
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState<boolean>(false);

  // Función para traer los items del carrito desde el backend
  const fetchCartItems = async () => {
    try {
      setCartLoading(true);
      const res = await fetch("/api/cart");
      if (!res.ok) throw new Error("Error al obtener el carrito");
      const data = await res.json();
      // Asumimos que la API devuelve cada item con una propiedad "productos_ec" con los datos del producto.
      const mapped: CartItem[] = data.map((item: any) => ({
        // Puedes ajustar la propiedad 'id' según lo que devuelva tu API
        product: item.productos_ec,
        cantidad: item.cantidad,
      }));
      setCartItems(mapped);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setCartLoading(false);
    }
  };

  // Lógica para actualizar el carrito en tiempo real (polling cada 3 segundos)
  useEffect(() => {
    fetchCartItems();
    const interval = setInterval(() => {
      fetchCartItems();
    }, 3000); // Actualiza cada 3 segundos
    return () => clearInterval(interval);
  }, []);

  // Funciones para actualizar la cantidad y eliminar items (actualizan backend y refrescan el carrito)
  const increaseQuantity = async (productId: number) => {
    try {
      const item = cartItems.find((i) => i.product.Id === productId);
      if (!item) return;
      const newCantidad = item.cantidad + 1;
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_producto: productId, cantidad: newCantidad }),
      });
      if (!res.ok) throw new Error("Error al actualizar cantidad");
      fetchCartItems();
    } catch (error) {
      console.error(error);
    }
  };

  const decreaseQuantity = async (productId: number) => {
    try {
      const item = cartItems.find((i) => i.product.Id === productId);
      if (!item) return;
      const newCantidad = Math.max(1, item.cantidad - 1);
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_producto: productId, cantidad: newCantidad }),
      });
      if (!res.ok) throw new Error("Error al actualizar cantidad");
      fetchCartItems();
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_producto: productId }),
      });
      if (!res.ok) throw new Error("Error al eliminar el producto del carrito");
      fetchCartItems();
    } catch (error) {
      console.error(error);
    }
  };

  // Calcula el subtotal a partir de los items del carrito
  const subtotal = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.product.Precio * item.cantidad,
    0
  );

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        const data: Product[] = await response.json();
        // Agrupa los productos por categorías
        const grouped = data.reduce((acc: { [key: string]: Product[] }, product) => {
          const category = product.categorias || "Sin Categoría";
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(product);
          return acc;
        }, {});
        setProducts(data);
        setGroupedProducts(grouped);
      } catch (error) {
        console.error("❌ Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Maneja la búsqueda de productos
  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetch(`/api/products?search=${term}`);
      const data: Product[] = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("❌ Error al buscar productos:", error);
    }
  };

  return (
    <div className="relative">
      {/* Mini Carrito (Lado Izquierdo) */}
      {showCart && (
        <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg p-4 overflow-y-auto z-50 border-r border-gray-200">
          <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
            <span>Subtotal: ₡{subtotal.toFixed(2)}</span>
            <Button variant="outline" className="text-sm" onClick={() => setShowCart(false)}>
              Cerrar ✖
            </Button>
          </h2>
          {cartLoading ? (
            <p className="text-center">Cargando carrito...</p>
          ) : cartItems.length === 0 ? (
            <p className="text-gray-600 text-center">Tu carrito está vacío 🛒</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map(({ product, cantidad }: CartItem) => (
                <div key={product.Id} className="flex items-center border-b pb-2">
                  <Image
                    src={product.image_url || "/fallback-image.jpg"}
                    alt={product.NomArticulo}
                    width={50}
                    height={50}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1 ml-4">
                    <p className="text-sm font-semibold">{product.NomArticulo}</p>
                    <p className="text-xs text-gray-500">₡{product.Precio.toFixed(2)}</p>
                    <div className="flex items-center mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-6 h-6 p-0"
                        onClick={() => decreaseQuantity(product.Id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-center w-6">{cantidad}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-6 h-6 p-0"
                        onClick={() => increaseQuantity(product.Id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="ml-2 text-red-500 hover:text-red-600"
                        onClick={() => removeFromCart(product.Id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Button
            className="w-full bg-blue-600 text-white mt-4 hover:bg-blue-700"
            onClick={() => router.push("/cart")}
          >
            Ir al Carrito
          </Button>
        </div>
      )}

      {/* Botón flotante para abrir el carrito */}
      <button
        className="fixed left-4 top-16 bg-blue-600 text-white rounded-full p-3 shadow-lg z-50"
        onClick={() => setShowCart(true)}
      >
        <ShoppingCart className="w-6 h-6" />
      </button>

      {/* Navbar */}
      <Navbar />

      {/* Contenedor Principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Contenedor Azul */}
        <div className="w-full bg-gradient-to-br from-[#1B3668] via-[#1B3668] to-[#2a4d8f] rounded-2xl p-10 text-white shadow-lg">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Bienvenido a Jack&apos;s E-commerce</h1>
            <p className="text-xl mb-6">Descubre nuestros deliciosos productos</p>
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-black"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSearchResults([]);
                  }}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  ✖
                </button>
              )}
              {searchResults.length > 0 && (
                <div className="absolute mt-1 bg-white text-black shadow-lg rounded-md w-full z-50 border border-gray-200 max-h-60 overflow-y-auto">
                  {searchResults.map((product) => (
                    <button
                      key={product.Id}
                      onClick={() => router.push(`/product/${product.Id}`)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                    >
                      {product.NomArticulo}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sección de Productos por Categoría */}
        <h2 id="productos" className="text-2xl font-bold mb-4 mt-8">Nuestros Productos</h2>
        {loading ? (
          <p className="text-center">Cargando productos...</p>
        ) : (
          <div>
            {Object.keys(groupedProducts).length > 0 ? (
              Object.entries(groupedProducts).map(([category, products]) => (
                <div key={category} className="mb-8">
                  <h1 className="text-xl font-semibold mb-4 text-[#1B3668]">{category}</h1>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.Id} product={product} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No hay productos disponibles.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
