"use client"

import "mapbox-gl/dist/mapbox-gl.css"

import { useEffect, useRef, useState } from "react"

import Map, { Marker, MapRef, Source, Layer } from "react-map-gl/mapbox"

import {
  ChevronUp,
  LocateFixed,
  MapPin,
  Navigation,
  Compass,
} from "lucide-react"

import BackButton from "@/components/BackButton"
import MapMarker from "@/components/MapMarker"
import BottomNav from "@/components/BottomNav"

import { useUserLocation } from "@/hooks/useUserLocation"
import { getMarkets, getPrices } from "@/lib/api"

import Constants from "@/lib/constants"
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

  const [route, setRoute] = useState<any>(null)

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
      if (interactionTimer.current) {
        clearTimeout(interactionTimer.current)
      }
    }
  }, [])

  const bestMarketId =
    prices.length > 0
      ? String(
          prices.reduce((best: any, curr: any) =>
            curr.price < best.price ? curr : best,
          ).marketId,
        )
      : null

  function getPriceForMarket(marketId: string) {
    const marketPrices = prices.filter(
      (price) => String(price.marketId) === String(marketId),
    )

    if (!marketPrices.length) {
      return undefined
    }

    const price = marketPrices.reduce((a, b) => (a.price < b.price ? a : b))

    return {
      ...price,
      product: price.products?.[0]?.name,
    }
  }

  function scheduleAutoShow() {
    if (interactionTimer.current) {
      clearTimeout(interactionTimer.current)
    }

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

  async function getRoute(market: any) {
    const start = `${userLocation.longitude},${userLocation.latitude}`

    const end = `${market.coordinate.lng},${market.coordinate.lat}`

    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start};${end}?geometries=geojson&access_token=${Constants.MAPBOX_TOKEN}`,
    )

    const data = await response.json()

    if (data.routes?.length) {
      setRoute(data.routes[0].geometry)
    }
  }

  const visibleMarkets =
    visibleMarketIds.size > 0
      ? markets.filter((market) => visibleMarketIds.has(String(market.id)))
      : markets

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#E8E3D8]">
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
        <ClusterLayer
          markets={markets}
          prices={prices}
          bestMarketId={bestMarketId}

          onVisibleMarketsChange={setVisibleMarketIds}

          onSelectMarket={(id) => setSelectedId(id)}
        />

        {route && (
          <Source
            id="route"
            type="geojson"
            data={{
              type: "Feature",
              geometry: route,
            }}
          >
            <Layer
              id="route-line"
              type="line"
              paint={{
                "line-color": "#467566",

                "line-width": 5,

                "line-opacity": 0.85,

                "line-dasharray": [1, 1.5],
              }}
            />
          </Source>
        )}

        <Marker
          latitude={userLocation.latitude}
          longitude={userLocation.longitude}
        >
          <div className="relative">
            <div className="absolute -inset-3 rounded-full border border-[#467566]/30 bg-[#467566]/10" />

            <div className="relative flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-white bg-[#467566] shadow-lg">
              <div className="h-1.5 w-1.5 rounded-full bg-white" />
            </div>
          </div>
        </Marker>

        {visibleMarkets.map((market) => {
          const product = getPriceForMarket(market.id)

          if (!product) {
            return null
          }

          return (
            <MapMarker
              key={market.id}

              market={market}

              product={product}

              selected={selectedId === String(market.id)}

              best={String(market.id) === String(bestMarketId)}

              onSelect={() => setSelectedId(String(market.id))}

              onClose={() => setSelectedId(null)}

              onRoute={() => getRoute(market)}
            />
          )
        })}
      </Map>

      <div className="pointer-events-none fixed top-0 right-0 left-0 z-40 px-4 pt-5">
        <div className="flex items-start justify-between">
          <div className="pointer-events-auto">
            <BackButton />
          </div>
          <div className="border border-[#D8D1C1] bg-[#F7F3E8]/95 px-4 py-2.5 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Compass size={15} className="text-[#467566]" />

              <div>
                <p className="text-[8px] font-black tracking-[0.2em] text-[#8291A1] uppercase">
                  Explorando
                </p>

                <p className="text-[11px] font-black text-[#102A43]">
                  Mercados próximos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {(error || loading) && (
        <div className="fixed top-4 left-1/2 z-40 -translate-x-1/2">
          <div className="flex items-center gap-2 border border-[#D8D1C1] bg-[#F7F3E8]/95 px-3 py-2 shadow-lg backdrop-blur-md">
            <span
              className={`flex h-6 w-6 items-center justify-center ${
                error
                  ? "bg-[#F4E7C4] text-[#A47B20]"
                  : "bg-[#DDECE5] text-[#467566]"
              } `}
            >
              <MapPin size={13} />
            </span>

            <span className="text-[9px] font-bold text-[#102A43]">
              {loading
                ? "Localizando você..."
                : "Usando localização aproximada"}
            </span>
          </div>
        </div>
      )}

      <div className="fixed bottom-28 left-4 z-40">
        <div className="border border-[#D8D1C1] bg-[#F7F3E8]/95 px-3 py-2.5 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#467566]" />

              <span className="text-[8px] font-bold tracking-wider text-[#66737C] uppercase">
                Você
              </span>
            </div>

            <div className="h-3 w-px bg-[#D8D1C1]" />

            <div className="flex items-center gap-1.5">
              <span className="flex h-3 w-3 items-center justify-center rounded-full bg-[#102A43]">
                <span className="h-1 w-1 rounded-full bg-white" />
              </span>

              <span className="text-[8px] font-bold tracking-wider text-[#66737C] uppercase">
                Mercado
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed right-4 bottom-28 z-50 flex flex-col gap-3">
        <button
          onClick={focusUserLocation}
          aria-label="Minha localização"

          className="flex h-12 w-12 items-center justify-center border border-[#D8D1C1] bg-[#F7F3E8] text-[#102A43] shadow-xl transition-all duration-200 hover:bg-white hover:text-[#467566] active:scale-95"
        >
          <LocateFixed size={20} strokeWidth={2.5} />
        </button>

        <button
          onClick={handleExpandNav}

          aria-label="Mostrar menu"

          className={`flex h-12 w-12 items-center justify-center border border-[#D8D1C1] bg-[#102A43] text-white shadow-xl transition-all duration-300 active:scale-95 ${
            navVisible
              ? "pointer-events-none translate-y-3 scale-75 opacity-0"
              : "translate-y-0 opacity-100"
          } `}
        >
          <ChevronUp size={20} strokeWidth={2.5} />
        </button>
      </div>
      <div
        className={`fixed right-0 bottom-0 left-0 z-50 transition-all duration-300 ease-out ${
          navVisible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-24 opacity-0"
        } `}
      >
        <BottomNav />
      </div>
    </main>
  )
}

function LocationMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-[#D8D1C1] bg-[#F7F3E8] px-3 py-2 shadow-lg">
      {children}
    </div>
  )
}
