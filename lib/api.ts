import Constants from "../utils/consts/constants"

const API_URL = Constants.API_URL

export async function getMarkets() {
  const res = await fetch(`${API_URL}/markets`)
  return res.json()
}

export async function getPrices(product?: string) {
  const query = product ? `?product=${product}` : ""
  const res = await fetch(`${API_URL}/prices${query}`)
  return res.json()
}
export async function getProducts() {
  const res = await fetch(`${API_URL}/products`)
  return res.json()
}
