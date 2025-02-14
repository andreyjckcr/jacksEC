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