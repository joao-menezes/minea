"use client"

import { Marker, Popup } from "react-map-gl/mapbox"
import { MapPin, ShoppingCart, X } from "lucide-react"

import { formatPrice } from "@/lib/utils"

type Props = {
  market: {
    id: string
    name: string
    street?: string
    coordinate: {
      lat: number
      lng: number
    }
  }

  product: {
    price: number
    product?: string
  }

  selected?: boolean
  best?: boolean
  onSelect?: () => void
  onClose?: () => void
}

export default function MapMarker({
  market,
  product,
  selected = false,
  best = false,
  onSelect,
  onClose,
}: Props) {
  return (
    <>
      <Marker
        latitude={market.coordinate.lat}
        longitude={market.coordinate.lng}
        anchor="bottom"
      >
        <button
          onClick={(e) => {
            e.stopPropagation()
            onSelect?.()
          }}
          className="relative z-50 flex flex-col items-center"
        >
          {best && (
            <span className="mb-1 rounded-full bg-green-500 px-2 py-0.5 text-[10px] text-white">
              🥇 Melhor
            </span>
          )}

          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white shadow-lg ${
              best ? "border-green-500" : "border-blue-500"
            } `}
          >
            <ShoppingCart size={24} />
          </div>

          <div className="mt-1 rounded-full bg-blue-600 px-2 py-1 text-xs font-bold text-white shadow">
            {formatPrice(product.price)}
          </div>

          <div className="relative z-50 mt-1 max-w-[160px] truncate rounded-md bg-white px-2 py-1 text-[11px] font-bold text-black shadow-lg">
            {market.name}
          </div>
        </button>
      </Marker>

      {selected && (
        <Popup
          latitude={market.coordinate.lat}
          longitude={market.coordinate.lng}
          anchor="top"
          closeButton={false}
          onClose={onClose}
          offset={20}
        >
          <div className="w-[220px] p-3">
            <div className="flex items-center justify-between gap-3">
              <strong className="truncate text-sm">{market.name}</strong>

              <button
                onClick={onClose}
                className="flex h-6 w-6 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >
                <X />
              </button>
            </div>

            <p className="mt-1 text-xs text-gray-500">📍 {market.street}</p>

            {product.product && (
              <p className="mt-2 text-sm">{product.product}</p>
            )}

            <div className="mt-2 rounded-lg bg-blue-50 p-2 text-center font-bold text-blue-600">
              {formatPrice(product.price)}
            </div>

            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-sm font-bold text-white">
              <MapPin size={16} />
              Como chegar
            </button>
          </div>
        </Popup>
      )}
    </>
  )
}
