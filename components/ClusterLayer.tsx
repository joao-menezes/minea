"use client"

import { useEffect, useMemo } from "react"
import type { GeoJSONFeature } from "mapbox-gl"

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
  currency: string
}

type Props = {
  markets: Market[]
  prices: Price[]
  bestMarketId: string | null
  onVisibleMarketsChange: (ids: Set<string>) => void
}

export default function ClusterLayer({
  markets,
  prices,
  bestMarketId,
  onVisibleMarketsChange,
}: Props) {
  const { current: map } = useMap()

  const geojson = useMemo(() => {
    const priceMap = new Map(prices.map((price) => [price.marketId, price]))

    return {
      type: "FeatureCollection" as const,

      features: markets.flatMap((market) => {
        const price = priceMap.get(market.id)

        if (!price) return []

        return [
          {
            type: "Feature" as const,

            properties: {
              id: market.id,
              name: market.name,
              price: price.price,
              currency: price.currency,
              best: market.id === bestMarketId,
            },

            geometry: {
              type: "Point" as const,
              coordinates: [market.coordinate.lng, market.coordinate.lat],
            },
          },
        ]
      }),
    }
  }, [markets, prices, bestMarketId])

  if (map === undefined) return

  useEffect(() => {
    function updateVisibleMarkets() {
      if (map === undefined) return

      const features = map.queryRenderedFeatures({
        layers: ["market-points"],
      }) as GeoJSONFeature[]

      const ids = new Set<string>()

      for (const feature of features) {
        const id = feature.properties?.id

        if (typeof id === "string") {
          ids.add(id)
        }
      }

      onVisibleMarketsChange(ids)
    }

    map.on("moveend", updateVisibleMarkets)
    map.on("idle", updateVisibleMarkets)

    return () => {
      map.off("moveend", updateVisibleMarkets)
      map.off("idle", updateVisibleMarkets)
    }
  }, [map, geojson, onVisibleMarketsChange])

  return (
    <Source
      id="markets"
      type="geojson"
      data={geojson}
      cluster
      clusterRadius={20}
      clusterMaxZoom={15}
      clusterProperties={{
        maxPrice: ["max", ["get", "price"]],
      }}
    >
      <Layer
        id="clusters"
        type="circle"
        filter={["has", "point_count"]}
        paint={{
          "circle-color": "#2563eb",

          "circle-radius": [
            "step",
            ["get", "point_count"],
            22,
            10,
            28,
            50,
            38,
            100,
            46,
          ],

          "circle-stroke-width": 3,

          "circle-stroke-color": "#ffffff",

          "circle-opacity": 0.9,
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
          "text-color": "#ffffff",
        }}
      />

      <Layer
        id="market-points"
        type="circle"
        filter={["!", ["has", "point_count"]]}
        paint={{
          "circle-radius": 7,

          "circle-color": [
            "case",
            ["==", ["get", "best"], true],
            "#16a34a",
            "#2563eb",
          ],

          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,

          "circle-opacity": 1,
        }}
      />
    </Source>
  )
}
