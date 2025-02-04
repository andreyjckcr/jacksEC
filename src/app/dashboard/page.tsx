"use client";

import { Navbar } from "../../components/Navbar";
import { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface Product {
  Id: number;
  CodArticulo: string;
  NomArticulo: string;
  Precio: number;
  PrecioImpuesto: number;
  image_url?: string | null;
  CodCabys: string;
  stock: number;
  categorias?: string;
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupedProducts, setGroupedProducts] = useState<{ [key: string]: Product[] }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const router = useRouter();

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

  // 🔍 Maneja la búsqueda de productos
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
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Contenedor Principal */}
      <div className="container mx-auto px-4 py-8">
        {/* 📌 Contenedor Azul Completo */}
        <div className="w-full bg-gradient-to-br from-[#1B3668] via-[#1B3668] to-[#2a4d8f] rounded-2xl p-10 text-white shadow-lg">
          
          {/* 📝 Texto alineado a la izquierda */}
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Bienvenido a Jack&apos;s E-commerce</h1>
            <p className="text-xl mb-6">Descubre nuestros deliciosos productos</p>

            {/* 🔍 Input de búsqueda con botón de limpiar */}
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-black"
              />

      {/* ❌ Botón para limpiar búsqueda y cerrar resultados */}
      {searchTerm && (
        <button
          onClick={() => {
            setSearchTerm("");  // 🔥 Limpia el input
            setSearchResults([]);  // ❌ Cierra el listado de resultados
          }}
          className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>
      )}

      {/* 📌 Dropdown de Resultados de Búsqueda */}
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

        {/* Productos por Categoría */}
        <h2 id="productos" className="text-2xl font-bold mb-4 mt-8">
          Nuestros Productos
        </h2>
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
