export interface Product {
  nombre: string
  categoria: string
  precio_aproximado_CRC: number
  imageUrl: string
  descripcion?: string
  descuento?: number
  isNew?: boolean // Nuevo campo para marcar productos como nuevos
  precioConDescuento?: number
}

export const products: Product[] = [
  {
    nombre: "Meneitos CL 60",
    categoria: "Snacks",
    precio_aproximado_CRC: 1000,
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MENEITOS-CL-60aniv-empaq-pag-web-UTzUwkjxOgDhmuYbjojJUoINFxKGSb.png",
    descripcion: "Horneados con queso - Insuflados de maíz",
    descuento: 10,
  },
  {
    nombre: "Meneitos Cremi Dulce",
    categoria: "Snacks",
    precio_aproximado_CRC: 1000,
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/products-meneitos-cremi-dulce-gZ1BEy40LU57xrbN5sGp10vdP2rZ4b.png",
    descripcion: "Deliciosos snacks de maíz con cobertura dulce",
    descuento: 15,
  },
  {
    nombre: "Picaritas BBQ",
    categoria: "Snacks",
    precio_aproximado_CRC: 1100,
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PICARITAS-BBQ-pag-web-HBlqWKMnCk2IvLsmAFe5CaHLvi70Kn.png",
    descripcion: "Tostaditas de maíz entero con sabor a barbacoa",
    descuento: 20,
  },
  {
    nombre: "Meneitos Super",
    categoria: "Snacks",
    precio_aproximado_CRC: 1000,
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MENEITOS-SUPER-empaq-pag-web-slkIqPgKE9eGT4e0aTaKz3ZU1FeE09.png",
    descripcion: "Insuflados de maíz con queso horneados",
    isNew: true,
  },
  {
    nombre: "Picaritas Jalapeño",
    categoria: "Snacks",
    precio_aproximado_CRC: 1100,
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PICARITAS-JALAP-pag-web-KMeRRIb9dGigO6GKwTef8F5l1uy2vy.png",
    descripcion: "Tostaditas de maíz entero con sabor a chile jalapeño y queso",
    isNew: true,
  },
  {
    nombre: "Picaronas Queso Nacho Picante",
    categoria: "Snacks",
    precio_aproximado_CRC: 1000,
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picarona-QNP-empaq-AFX4V4yHNyuEdIF5bRwl1hoa7coFYT.png",
    descripcion: "Crujientes snacks de maíz con sabor a queso nacho picante",
  },
  {
    nombre: "Twisters Queso",
    categoria: "Snacks",
    precio_aproximado_CRC: 1000,
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TWISTERS-QUESO-ilustrac-pag-web-I6H1ByJ3GTqGRp6dJKumFisaLTPy2Y.png",
    descripcion: "Bocadillos de maíz con sabor a queso",
  },
  {
    nombre: "Snack Mix",
    categoria: "Snacks",
    precio_aproximado_CRC: 1200,
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SNACK-MIX-pag-web-9l4jk0ADinlkCZo62DbC4UzswJ1jav.png",
    descripcion: "Mezcla de Meneitos super y Twisters con sabor a queso",
    isNew: true,
  },
  {
    nombre: "Hot Twisters",
    categoria: "Snacks",
    precio_aproximado_CRC: 1000,
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TWISTERS-ARDIENTE-ilustrac-pag-web-g1ieuhcA92Za88YAOmy5P21UbryD7M.png",
    descripcion: "Bocadillos de maíz con sabor a queso picante",
  },
  {
    nombre: "Doraditas Pizza",
    categoria: "Snacks",
    precio_aproximado_CRC: 900,
    imageUrl: "/placeholder.svg?height=300&width=300",
    descripcion: "Crujientes snacks con sabor a pizza",
  },
  {
    nombre: "Vegis",
    categoria: "Snacks Saludables",
    precio_aproximado_CRC: 1300,
    imageUrl: "/placeholder.svg?height=300&width=300",
    descripcion: "Snacks saludables hechos con vegetales",
  },
  {
    nombre: "Mejitos Fiesta",
    categoria: "Snacks",
    precio_aproximado_CRC: 1000,
    imageUrl: "/placeholder.svg?height=300&width=300",
    descripcion: "Snacks festivos con una mezcla de sabores",
  },
  {
    nombre: "Mejitos Super Nacho",
    categoria: "Snacks",
    precio_aproximado_CRC: 1100,
    imageUrl: "/placeholder.svg?height=300&width=300",
    descripcion: "Snacks con intenso sabor a queso nacho",
  },
  {
    nombre: "Chicharritos",
    categoria: "Snacks",
    precio_aproximado_CRC: 800,
    imageUrl: "/placeholder.svg?height=300&width=300",
    descripcion: "Crujientes snacks estilo chicharrón",
  },
  {
    nombre: "Cebollines",
    categoria: "Snacks",
    precio_aproximado_CRC: 900,
    imageUrl: "/placeholder.svg?height=300&width=300",
    descripcion: "Snacks con sabor a cebolla",
  },
  {
    nombre: "Yuquitas Natilla y Cebolla",
    categoria: "Snacks",
    precio_aproximado_CRC: 950,
    imageUrl: "/placeholder.svg?height=300&width=300",
    descripcion: "Snacks de yuca con sabor a natilla y cebolla",
  },
  {
    nombre: "Poropoz",
    categoria: "Snacks",
    precio_aproximado_CRC: 700,
    imageUrl: "/placeholder.svg?height=300&width=300",
    descripcion: "Palomitas de maíz",
  },
  {
    nombre: "Popi Jacks Caramelo",
    categoria: "Snacks",
    precio_aproximado_CRC: 1000,
    imageUrl: "/placeholder.svg?height=300&width=300",
    descripcion: "Palomitas de maíz con sabor a caramelo",
  },
  {
    nombre: "Popi Jacks Natural",
    categoria: "Snacks",
    precio_aproximado_CRC: 1000,
    imageUrl: "/placeholder.svg?height=300&width=300",
    descripcion: "Palomitas de maíz naturales",
  },
  {
    nombre: "Popi Jacks Queso",
    categoria: "Snacks",
    precio_aproximado_CRC: 1000,
    imageUrl: "/placeholder.svg?height=300&width=300",
    descripcion: "Palomitas de maíz con sabor a queso",
  },
].map((product) => ({
  ...product,
  precioConDescuento: product.descuento
    ? product.precio_aproximado_CRC * (1 - product.descuento / 100)
    : product.precio_aproximado_CRC,
}))

