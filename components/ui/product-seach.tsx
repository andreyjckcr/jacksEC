"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "./input";
import { Search, X } from "lucide-react";

export default function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();

  // 🔍 Buscar productos en la API
  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term.length < 2) {
      setSearchResults([]); // No buscar si es muy corto
      return;
    }

    try {
      const response = await fetch(`/api/products?search=${term}`);
      if (!response.ok) throw new Error("Error en la búsqueda");
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("❌ Error al buscar productos:", error);
    }
  };

  // 🔗 Redirigir a la página del producto
  const handleSelectProduct = (productId: number) => {
    setSearchTerm(""); // Limpiar búsqueda
    setSearchResults([]); // Limpiar resultados
    router.push(`/product/${productId}`);
  };

  return (
    <div className="relative w-full max-w-sm">
      <div className="flex items-center bg-gray-100 border rounded-lg px-3 py-2">
        <Search className="text-gray-500 h-5 w-5 mr-2" />
        <Input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full bg-transparent outline-none"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm("")} className="ml-2 text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Lista de Resultados */}
      {searchResults.length > 0 && (
        <div className="absolute left-0 w-full bg-white border shadow-lg rounded-lg mt-1 z-50 max-h-64 overflow-y-auto">
          {searchResults.map((product: any) => (
            <div
              key={product.id}
              onClick={() => handleSelectProduct(product.id)}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {product.NomArticulo}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
