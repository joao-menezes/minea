import { useMemo } from "react"
import type {
  MarketWithDistance,
  Price,
  Product,
  ProductCategory,
} from "@/lib/types"

type UseMarketFilterParams = {
  markets: MarketWithDistance[]
  prices: Price[]
  products: Product[]
  search: string
  category: ProductCategory | "all"
}

type UseMarketFilterReturn = {
  filteredMarkets: MarketWithDistance[]
  getPriceForMarket: (marketId: string) => Price | undefined
}

export function useMarketFilter({
  markets,
  prices,
  products,
  search,
  category,
}: UseMarketFilterParams): UseMarketFilterReturn {
  const productsInCategory = useMemo(() => {
    if (category === "all") return new Set(products.map((p) => p.name))
    return new Set(
      products.filter((p) => p.category === category).map((p) => p.name),
    )
  }, [products, category])

  const pricesByMarket = useMemo(() => {
    const map = new Map<string, Price[]>()
    for (const price of prices) {
      const existing = map.get(price.marketId) ?? []
      map.set(price.marketId, [...existing, price])
    }
    return map
  }, [prices])

  const filteredMarkets = useMemo(() => {
    const query = search.toLowerCase()

    return markets.filter((market) => {
      const marketPrices = pricesByMarket.get(market.id) ?? []

      const matchesSearch =
        !query ||
        market.name.toLowerCase().includes(query) ||
        market.street?.toLowerCase().includes(query) ||
        marketPrices.some((p) => p.product?.toLowerCase().includes(query))

      const matchesCategory =
        category === "all" ||
        marketPrices.some((p) => productsInCategory.has(p.product))

      return matchesSearch && matchesCategory
    })
  }, [markets, pricesByMarket, search, category, productsInCategory])

  function getPriceForMarket(marketId: string): Price | undefined {
    const marketPrices = pricesByMarket.get(marketId) ?? []
    if (marketPrices.length === 0) return undefined

    if (search) {
      const query = search.toLowerCase()
      const match = marketPrices.find((p) =>
        p.product?.toLowerCase().includes(query),
      )
      if (match) return match
    }

    return [...marketPrices].sort((a, b) => a.price - b.price)[0]
  }

  return { filteredMarkets, getPriceForMarket }
}
