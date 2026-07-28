"use client"

import { useState } from "react"
import { Marker, Popup } from "react-map-gl/mapbox"
import { MapPin, Navigation } from "lucide-react"

import { formatPrice, type Market, type Product } from "@/data/markets"

type Props = {
  market: Market
  product: Product
  selected?: boolean
  best?: boolean
  onSelect?: () => void
}

export default function MapMarker({
  market,
  product,
  selected = false,
  best = false,
  onSelect,
}: Props) {
  const [showPopup, setShowPopup] = useState(false)

  return (
    <>
      <Marker
        latitude={market.coordinate.lat}
        longitude={market.coordinate.lng}
        anchor="bottom"
      >
        <button
          onClick={() => {
            setShowPopup(true)
            onSelect?.()
          }}
          className={`relative flex flex-col items-center transition-all duration-200 hover:scale-105 ${
            selected ? "scale-110" : ""
          } `}
        >
          {best && (
            <span className="absolute -top-3 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
              🥇
            </span>
          )}

          <div
            className={`bg-card flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-lg ${
              selected
                ? "border-primary ring-primary/20 ring-4"
                : best
                  ? "border-green-500"
                  : "border-border"
            } `}
          >
            <span className="text-xl">{market.emoji}</span>
          </div>

          <span className="bg-primary mt-1 rounded-full px-2.5 py-1 text-xs font-bold text-white shadow">
            {formatPrice(product.price, market.currency)}
          </span>
        </button>
      </Marker>

      {showPopup && (
        <Popup
          latitude={market.coordinate.lat}
          longitude={market.coordinate.lng}
          anchor="top"
          closeButton={false}
          closeOnClick={false}
          onClose={() => setShowPopup(false)}
        >
          <div className="min-w-[220px] p-3">
            <button
              onClick={() => setShowPopup(false)}
              className="bg-secondary absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full text-lg"
            >
              ×
            </button>

            <div className="flex items-center gap-3 pr-8">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl text-xl">
                {market.emoji}
              </div>

              <strong className="text-sm">{market.name}</strong>
            </div>

            <p className="text-muted-foreground mt-3 text-xs">
              📍 {market.street}
            </p>

            <div className="bg-primary/10 text-primary mt-3 rounded-xl px-3 py-2 text-center font-bold">
              {formatPrice(product.price, market.currency)}
            </div>

            <button className="bg-primary mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm font-bold text-white">
              <MapPin size={18} />
              Como chegar
            </button>
          </div>
        </Popup>
      )}
    </>
  )
}
