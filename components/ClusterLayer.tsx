"use client"

import { useEffect, useMemo } from "react"
import { Layer, Source, useMap } from "react-map-gl/mapbox"

type Market = {
  id: string
  name: string
  coordinate: {
    lat: number
    lng: number
  }
}

type Price = {
  marketId: string
  price: number
  product?: string
}

type Props = {
  markets: Market[]
  prices: Price[]
  bestMarketId: string | null
  onVisibleMarketsChange: (ids: Set<string>) => void
  onSelectMarket: (id: string) => void
}

export default function ClusterLayer({
  markets,
  prices,
  bestMarketId,
  onVisibleMarketsChange,
  onSelectMarket,
}: Props) {
  const { current: map } = useMap()

  const geojson = useMemo(() => {
    const priceMap = new Map<string, Price>()

    prices.forEach((price) => {
      const current = priceMap.get(price.marketId)

      if (!current || price.price < current.price) {
        priceMap.set(price.marketId, price)
      }
    })

    return {
      type: "FeatureCollection" as const,
      features: markets.map((market) => {
        const price = priceMap.get(market.id)

        return {
          type: "Feature" as const,

          properties: {
            id: market.id,
            name: market.name,
            price: price?.price ?? 0,
            product: price?.product ?? "",
            best: market.id === bestMarketId,
          },

          geometry: {
            type: "Point" as const,
            coordinates: [market.coordinate.lng, market.coordinate.lat],
          },
        }
      }),
    }
  }, [markets, prices, bestMarketId])

  useEffect(() => {
    if (!map) return

    function updateVisibleMarkets() {
      if (!map) return
      const features = map.querySourceFeatures("markets")

      const ids = new Set<string>()

      features.forEach((feature: any) => {
        const id = feature.properties?.id

        if (typeof id === "string") {
          ids.add(id)
        }
      })

      onVisibleMarketsChange(ids)
    }

    function handleMarketClick(e: any) {
      const feature = e.features?.[0]

      const id = feature?.properties?.id

      if (id) {
        onSelectMarket(id)
      }
    }

    map.on("idle", updateVisibleMarkets)

    map.on("click", "market-points", handleMarketClick)

    return () => {
      map.off("idle", updateVisibleMarkets)

      map.off("click", "market-points", handleMarketClick)
    }
  }, [map, geojson, onVisibleMarketsChange, onSelectMarket])

  return (
    <Source
      id="markets"
      type="geojson"
      data={geojson}
      cluster
      clusterRadius={30}
      clusterMaxZoom={13}
    >
      <Layer
        id="clusters"
        type="circle"
        filter={["has", "point_count"]}
        paint={{
          "circle-color": "#2563eb",
          "circle-radius": ["step", ["get", "point_count"], 22, 10, 28, 50, 38],
          "circle-stroke-width": 3,
          "circle-stroke-color": "#fff",
        }}
      />

      <Layer
        id="cluster-count"
        type="symbol"
        filter={["has", "point_count"]}
        layout={{
          "text-field": "{point_count_abbreviated}",
          "text-size": 14,
        }}
        paint={{
          "text-color": "#fff",
        }}
      />

      <Layer
        id="market-points"
        type="circle"
        filter={["!", ["has", "point_count"]]}
        paint={{
          "circle-radius": 9,

          "circle-color": [
            "case",
            ["==", ["get", "best"], true],
            "#16a34a",
            "#2563eb",
          ],

          "circle-stroke-color": "#fff",
          "circle-stroke-width": 2,
        }}
      />
    </Source>
  )
}
