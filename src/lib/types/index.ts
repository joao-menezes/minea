export type Coordinate = {
  lat: number
  lng: number
}

export type Score = {
  price: number
  quality: number
  distance: number
  availability: number
}

export const PRODUCT_CATEGORIES = [
  "grains",
  "meat",
  "dairy",
  "fruits",
  "beverages",
] as const

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]

export type Product = {
  id: string
  name: string
  category: ProductCategory
}

export type Market = {
  id: string
  name: string
  street: string
  coordinate: Coordinate
  image?: string
  currency?: string
  open?: boolean
  scores?: Score
  products?: Product[]
}

export type MarketWithDistance = Market & {
  distance: number
}

export type Price = {
  id: string
  marketId: string
  product: string
  price: number
  unit?: string
  currency?: string
}

export type ProfileMenuItem = {
  icon: React.ReactNode
  title: string
  description: string
  href?: string
  onClick?: () => void
}
