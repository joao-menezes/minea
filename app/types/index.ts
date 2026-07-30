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

export type Market = {
  id: string
  name: string
  street: string
  coordinate: Coordinate
  emoji?: string
  currency?: string
  open?: boolean
  scores?: Score
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

export type Product = {
  id: string
  name: string
  category: string
  emoji?: string
}
