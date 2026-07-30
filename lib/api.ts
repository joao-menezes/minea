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

export async function getPrices(): Promise<any[]> {
  const { data, error } = await supabase.from("prices").select(`
    id,
    price,
    market_id,
    product_id,
    products (
      name
    )
  `)

  if (error) throw error

  return data.map((item: any) => ({
    id: item.id,
    marketId: item.market_id,
    product: item.products?.name ?? "Produto",
    price: Number(item.price),
  }))
}
