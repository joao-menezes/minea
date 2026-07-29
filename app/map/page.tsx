"use client"

import "mapbox-gl/dist/mapbox-gl.css"

import { useEffect, useRef, useState } from "react"

import Map, { Marker, MapRef } from "react-map-gl/mapbox"
import { ChevronUp, LocateFixed } from "lucide-react"
import BackButton from "@/components/BackButton"

import MapMarker from "@/components/MapMarker"
import BottomNav from "@/components/BottomNav"

import { useUserLocation } from "../hooks/useUserLocation"
import { getMarkets, getPrices } from "@/lib/api"

import Constants from "../../utils/consts/constants"
import ClusterLayer from "@/components/ClusterLayer"

const DEFAULT_LOCATION = {
  latitude: -22.5668,
  longitude: -47.4017,
}

const MAP_CONFIG = {
  zoom: 15,
  navigationDelay: 3000,
}

export default function MapPage() {
  const mapRef = useRef<MapRef | null>(null)
  const interactionTimer = useRef<NodeJS.Timeout | null>(null)

  const { location, loading, error } = useUserLocation()
  const [navVisible, setNavVisible] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [markets, setMarkets] = useState<any[]>([])
  const [prices, setPrices] = useState<any[]>([])

  const [visibleMarketIds, setVisibleMarketIds] = useState(new Set<string>())

  const userLocation = location ?? DEFAULT_LOCATION

  useEffect(() => {
    getMarkets().then((data) => setMarkets(data))
    getPrices().then((data) => setPrices(data))
  }, [])

  useEffect(() => {
    if (!location) return
    mapRef.current?.flyTo({
      center: [location.longitude, location.latitude],
      zoom: MAP_CONFIG.zoom,
      duration: 1000,
    })
  }, [location])

  useEffect(() => {
    return () => {
      if (interactionTimer.current) clearTimeout(interactionTimer.current)
    }
  }, [])

  const bestMarketId =
    prices.length > 0
      ? String(
          prices.reduce((best: any, curr: any) =>
            curr.price < best.price ? curr : best,
          ).market_id,
        )
      : null

  function getPriceForMarket(marketId: string) {
    const marketPrices = prices.filter(
      (p) => String(p.market_id) === String(marketId),
    )

    if (!marketPrices.length) return undefined

    const price = marketPrices.reduce((a, b) => (a.price < b.price ? a : b))

    return {
      ...price,
      product: price.products?.[0]?.name,
    }
  }

  function scheduleAutoShow() {
    if (interactionTimer.current) clearTimeout(interactionTimer.current)
    interactionTimer.current = setTimeout(() => {
      setNavVisible(true)
    }, MAP_CONFIG.navigationDelay)
  }

  function handleMapInteraction() {
    setNavVisible(false)
    scheduleAutoShow()
  }

  function handleExpandNav() {
    setNavVisible(true)
    scheduleAutoShow()
  }

  function focusUserLocation() {
    if (!mapRef.current) return
    mapRef.current.flyTo({
      center: [userLocation.longitude, userLocation.latitude],
      zoom: MAP_CONFIG.zoom,
      duration: 1000,
    })
  }

  const visibleMarkets =
    visibleMarketIds.size > 0
      ? markets.filter((market) => visibleMarketIds.has(String(market.id)))
      : markets

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <Map
        ref={mapRef}
        initialViewState={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          zoom: MAP_CONFIG.zoom,
        }}
        mapboxAccessToken={Constants.MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onMoveStart={handleMapInteraction}
        style={{ position: "absolute", inset: 0 }}
      >
        <ClusterLayer
          markets={markets}
          prices={prices}
          bestMarketId={bestMarketId}
          onVisibleMarketsChange={setVisibleMarketIds}
          onSelectMarket={function (id: string): void {
            throw new Error("Function not implemented.")
          }}
        />

        <Marker
          latitude={userLocation.latitude}
          longitude={userLocation.longitude}
        >
          <div className="h-5 w-5 rounded-full border-2 border-white bg-blue-500 shadow-lg ring-4 ring-blue-200" />
        </Marker>

        {visibleMarkets.map((market) => {
          const product = getPriceForMarket(market.id)

          if (!product) return null

          return (
            <MapMarker
              key={market.id}
              market={market}
              product={product}
              selected={selectedId === String(market.id)}
              best={String(market.id) === String(bestMarketId)}
              onSelect={() => setSelectedId(String(market.id))}
              onClose={() => setSelectedId(null)}
            />
          )
        })}
      </Map>

      {error && <LocationMessage>📍 Usando localização padrão</LocationMessage>}
      {loading && (
        <LocationMessage>Buscando sua localização...</LocationMessage>
      )}

      <div className="fixed top-5 left-4 z-50">
        <BackButton />
      </div>

      <div
        className={`fixed right-0 bottom-0 left-0 z-50 transition-all duration-300 ease-out ${
          navVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-24 opacity-0"
        }`}
      >
        <BottomNav />
      </div>

      <div className="fixed right-4 bottom-6 z-50 flex flex-col items-center gap-3">
        <button
          onClick={focusUserLocation}
          aria-label="Minha localização"
          className="border-border bg-card/95 fixed right-4 bottom-25 z-50 flex h-12 w-12 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <LocateFixed size={22} className="text-primary" strokeWidth={2.5} />
        </button>

        <button
          onClick={handleExpandNav}
          aria-label="Mostrar menu"
          className={`border-border bg-card/95 fixed right-4 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 ${
            navVisible
              ? "pointer-events-none translate-y-14 scale-75 opacity-0"
              : "scale-100 opacity-100"
          }`}
        >
          <ChevronUp size={20} className="text-primary" strokeWidth={2.5} />
        </button>
      </div>
    </main>
  )
}

function LocationMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full border bg-white px-4 py-2 text-xs text-gray-600 shadow-lg">
      {children}
    </div>
  )
}
