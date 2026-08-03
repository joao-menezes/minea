import type { Coordinate } from "@/lib/types"

export const USER_LOCATION: Coordinate = {
  lat: 53.3498,
  lng: -6.2603,
}

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
