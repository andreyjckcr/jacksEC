export interface Product {
    nombre: string
    categoria: string
    precio_aproximado_CRC: number
    imageUrl: string
    descripcion?: string
    descuento?: number
    isNew?: boolean
    precioConDescuento?: number
  }
  // src/types.ts
// src/app/types/product.ts
export interface Product {
  Id: number;
  CodArticulo: string;
  NomArticulo: string;
  Precio: number;
  PrecioImpuesto?: number; // opcional para evitar conflictos
  image_url?: string | null;
  categorias?: string;
  Embalaje?: string | null;
  CodCabys?: string;
  stock?: number;
}


export interface CartItem {
  product: Product;
  cantidad: number;
}
