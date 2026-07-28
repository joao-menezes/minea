"use client"

import "mapbox-gl/dist/mapbox-gl.css"

import { useEffect, useMemo, useRef, useState } from "react"

import Map, { Marker, MapRef } from "react-map-gl/mapbox"
import { ChevronUp, LocateFixed } from "lucide-react"

import MapMarker from "@/components/MapMarker"
import BottomNav from "@/components/BottomNav"

import { useUserLocation } from "../hooks/useUserLocation"

import { MARKETS } from "@/data/markets"

import Constants from "../../utils/consts/constants"

const DEFAULT_LOCATION = {
  latitude: 53.3498,
  longitude: -6.2603,
}

const MAP_CONFIG = {
  zoom: 15,
  navigationDelay: 3000,
}

function calculateMarketScore(market: (typeof MARKETS)[number]) {
  const { price, quality, distance, availability } = market.scores

  return price * 0.4 + quality * 0.2 + distance * 0.2 + availability * 0.2
}

export default function MapPage() {
  const mapRef = useRef<MapRef | null>(null)
  const interactionTimer = useRef<NodeJS.Timeout | null>(null)

  const { location, loading, error } = useUserLocation()
  const [navVisible, setNavVisible] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const bestMarketId = MARKETS.reduce((best, market) => {
    const price = market.products[0]?.price ?? Infinity
    const bestPrice = best.products[0]?.price ?? Infinity

    return price < bestPrice ? market : best
  }, MARKETS[0]).id

  const userLocation = location ?? DEFAULT_LOCATION

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
        style={{
          position: "absolute",
          inset: 0,
        }}
      >

        <Marker
          latitude={userLocation.latitude}
          longitude={userLocation.longitude}
        >
          <div className="h-5 w-5 rounded-full border-2 border-white bg-blue-500 shadow-lg ring-4 ring-blue-200" />
        </Marker>

        {MARKETS.map((market) => {
          const product = market.products[0]

          if (!product) return null

          return (
            <MapMarker
              key={market.id}
              market={market}
              product={product}
              selected={selectedId === market.id}
              best={market.id === bestMarketId}
              onSelect={() => setSelectedId(market.id)}
            />
          )
        })}
      </Map>

      {error && <LocationMessage>📍 Usando localização padrão</LocationMessage>}

      {loading && (
        <LocationMessage>📡 Buscando sua localização...</LocationMessage>
      )}

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
          className="border-border bg-card/95 flex h-12 w-12 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <LocateFixed size={22} className="text-primary" strokeWidth={2.5} />
        </button>
        <button
          onClick={handleExpandNav}
          aria-label="Mostrar menu"
          className={`border-border bg-card/95 flex h-12 w-12 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 ${
            navVisible
              ? "pointer-events-none absolute translate-y-14 scale-75 opacity-0"
              : "relative scale-100 opacity-100"
          } `}
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
