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
  market_id: string
  price: number
  products?: {
    name: string
  }[]
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
      const marketId = String(price.market_id)

      const current = priceMap.get(marketId)

      if (!current || price.price < current.price) {
        priceMap.set(marketId, price)
      }
    })

    return {
      type: "FeatureCollection" as const,

      features: markets.map((market) => {
        const price = priceMap.get(String(market.id))

        return {
          type: "Feature" as const,

          properties: {
            id: String(market.id),
            name: market.name,
            price: price?.price ?? 0,
            product: price?.products?.[0]?.name ?? "",
            best: String(market.id) === String(bestMarketId),
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

        if (id !== undefined && id !== null) {
          ids.add(String(id))
        }
      })

      onVisibleMarketsChange(ids)
    }

    function handleMarketClick(e: any) {
      const feature = e.features?.[0]

      const id = feature?.properties?.id

      if (id) {
        onSelectMarket(String(id))
      }
    }

    map.on("idle", updateVisibleMarkets)

    map.on("click", "market-points", handleMarketClick)

    return () => {
      map.off("idle", updateVisibleMarkets)

      map.off("click", "market-points", handleMarketClick)
    }
  }, [map, onVisibleMarketsChange, onSelectMarket])

  return (
    <Source
      id="markets"
      type="geojson"
      data={geojson}
      cluster
      clusterMaxZoom={14}
      clusterRadius={50}
    >
      <Layer
        id="clusters"
        type="circle"
        filter={["has", "point_count"]}
        paint={{
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#E8C766",
            10,
            "#D9A441",
            50,
            "#C87B32",
          ],

          "circle-radius": ["step", ["get", "point_count"], 22, 10, 28, 50, 36],

          "circle-stroke-width": 3,

          "circle-stroke-color": "#FFF9EC",

          "circle-opacity": 0.95,
        }}
      />

      <Layer
        id="cluster-count"
        type="symbol"
        filter={["has", "point_count"]}
        layout={{
          "text-field": "{point_count_abbreviated}",
          "text-size": 14,
          "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],
        }}
        paint={{
          "text-color": "#102A43",
        }}
      />

      <Layer
        id="market-point-outline"
        type="circle"
        filter={["!", ["has", "point_count"]]}
        paint={{
          "circle-radius": ["case", ["==", ["get", "best"], true], 14, 11],

          "circle-color": "#FFF9EC",

          "circle-stroke-width": 0,
        }}
      />

      {/* ─────────────────────────────
          MARKET
      ───────────────────────────── */}

      <Layer
        id="market-points"
        type="circle"
        filter={["!", ["has", "point_count"]]}
        paint={{
          "circle-radius": ["case", ["==", ["get", "best"], true], 9, 7],

          "circle-color": [
            "case",
            ["==", ["get", "best"], true],
            "#467566",
            "#102A43",
          ],

          "circle-stroke-color": "#FFF9EC",

          "circle-stroke-width": 2,
        }}
      />

      <Layer
        id="market-price"
        type="symbol"
        filter={["!", ["has", "point_count"]]}
        layout={{
          "text-field": [
            "concat",
            "R$ ",
            ["to-string", ["/", ["get", "price"], 100]],
          ],

          "text-size": 11,

          "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"],

          "text-offset": [0, 2.1],

          "text-anchor": "top",

          "text-allow-overlap": true,
        }}
        paint={{
          "text-color": [
            "case",
            ["==", ["get", "best"], true],
            "#467566",
            "#102A43",
          ],

          "text-halo-color": "#FFF9EC",

          "text-halo-width": 3,
        }}
      />
    </Source>
  )
}
