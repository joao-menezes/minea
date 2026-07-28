export type Coordinate = {
  lat: number
  lng: number
}

export type Product = {
  id: string
  name: string
  category: string
  price: number
  unit: string
}

export type Market = {
  id: string
  name: string
  street: string
  emoji: string
  currency: string
  distance: number
  coordinate: Coordinate

  products: Product[]

  scores: {
    price: number
    quality: number
    distance: number
    availability: number
  }
}

export const USER_LOCATION: Coordinate = {
  lat: 53.3498,
  lng: -6.2603,
}

export const MARKETS: Market[] = [
  {
    id: "lidl",
    name: "Lidl",
    street: "Henry Street",
    emoji: "🛒",
    currency: "€",

    distance: 400,

    coordinate: {
      lat: 53.3501,
      lng: -6.2605,
    },

    products: [
      {
        id: "arroz",
        name: "Arroz",
        category: "Grãos",
        price: 1.99,
        unit: "kg",
      },
      {
        id: "leite",
        name: "Leite",
        category: "Laticínios",
        price: 1.2,
        unit: "L",
      },
    ],

    scores: {
      price: 95,
      quality: 80,
      distance: 90,
      availability: 85,
    },
  },

  {
    id: "tesco",
    name: "Tesco",
    street: "O'Connell Street",
    emoji: "🛍️",
    currency: "€",

    distance: 650,

    coordinate: {
      lat: 53.3489,
      lng: -6.2581,
    },

    products: [
      {
        id: "arroz",
        name: "Arroz",
        category: "Grãos",
        price: 2.49,
        unit: "kg",
      },
      {
        id: "cafe",
        name: "Café",
        category: "Bebidas",
        price: 4.5,
        unit: "500g",
      },
    ],

    scores: {
      price: 80,
      quality: 90,
      distance: 75,
      availability: 95,
    },
  },
]

/**
 * Calcula a distância em metros entre duas coordenadas (fórmula de Haversine).
 */
export function haversineDistance(a: Coordinate, b: Coordinate): number {
  const R = 6371000 // raio da Terra em metros
  const toRad = (deg: number) => (deg * Math.PI) / 180

  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2

  return R * 2 * Math.asin(Math.sqrt(h))
}

/**
 * Formata um preço com o símbolo da moeda, centralizando a lógica
 * repetida em MarketCard e MapMarker.
 */
export function formatPrice(value: number, currency: string): string {
  const formatted = value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  })

  return `${currency}${formatted}`
}

export function getMarketById(id: string): Market | undefined {
  return MARKETS.find((m) => m.id === id)
}
