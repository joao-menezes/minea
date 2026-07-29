import { supabase } from "./supabase"

export async function getMarkets() {
  const { data, error } = await supabase.from("markets").select("*")

  if (error) throw error

  return data.map(
    (market: {
      id: any
      name: any
      street: any
      latitude: any
      longitude: any
    }) => ({
      id: market.id,
      name: market.name,
      street: market.street,
      coordinate: {
        lat: market.latitude,
        lng: market.longitude,
      },
    }),
  )
}

export async function getProducts() {
  const { data, error } = await supabase.from("products").select("*")

  if (error) throw error

  return data
}

export async function getPrices() {
  const { data, error } = await supabase.from("prices").select("*")

  if (error) throw error

  return data
}
