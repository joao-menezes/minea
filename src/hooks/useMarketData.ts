import { useEffect, useMemo, useState } from "react"

import { getMarkets, getPrices, getProducts } from "@/lib/api"
import { haversineDistance, USER_LOCATION } from "@/data/markets"
import { useUserLocation } from "@/hooks/useUserLocation"
import type { Market, MarketWithDistance, Price, Product } from "@/lib/types"

type UseMarketDataReturn = {
  markets: MarketWithDistance[]
  prices: Price[]
  products: Product[]
  loading: boolean
  locationError: string | null
}

export function useMarketData(): UseMarketDataReturn {
  const [markets, setMarkets] = useState<Market[]>([])
  const [prices, setPrices] = useState<Price[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const {
    location,
    loading: loadingLocation,
    error: locationError,
  } = useUserLocation()

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [marketsData, pricesData, productsData] = await Promise.all([
          getMarkets(),
          getPrices(),
          getProducts(),
        ])

        if (cancelled) return

        setMarkets(marketsData)
        setPrices(pricesData)
        setProducts(productsData)
      } catch (err) {
        console.error("[useMarketData] Failed to load data:", err)
      } finally {
        if (!cancelled) setLoadingData(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  const origin = location
    ? { lat: location.latitude, lng: location.longitude }
    : USER_LOCATION

  const rankedMarkets = useMemo<MarketWithDistance[]>(() => {
    return markets
      .map((market) => ({
        ...market,
        distance: Math.round(haversineDistance(origin, market.coordinate)),
      }))
      .sort((a, b) => a.distance - b.distance)
  }, [markets, origin])

  return {
    markets: rankedMarkets,
    prices,
    products,
    loading: loadingData || loadingLocation,
    locationError,
  }
}
