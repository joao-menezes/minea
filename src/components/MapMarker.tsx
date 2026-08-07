"use client"

import { Marker, Popup } from "react-map-gl/mapbox"
import { ArrowUpRight, MapPin, Navigation, ShoppingCart, X } from "lucide-react"

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
  onRoute?: () => void
}

export default function MapMarker({
  market,
  product,
  selected = false,
  best = false,
  onSelect,
  onClose,
  onRoute,
}: Props) {
  return (
    <>
      <Marker
        latitude={market.coordinate.lat}
        longitude={market.coordinate.lng}
        anchor="bottom"
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onSelect?.()
          }}
          className="group relative flex flex-col items-center outline-none"
        >
          {/* BEST DEAL */}
          {best && (
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#E76F51] px-2 py-1 text-[8px] font-black tracking-wider whitespace-nowrap text-white uppercase shadow-sm">
              Best deal
            </div>
          )}

          <div
            className={`relative flex min-w-[64px] flex-col items-center justify-center border-2 px-2 py-1.5 shadow-[0_3px_0_rgba(16,42,67,0.25)] transition-all duration-200 ${
              best ? "border-[#E76F51] bg-white" : "border-[#102A43] bg-white"
            } ${
              selected
                ? "-translate-y-1 scale-105"
                : "group-hover:-translate-y-0.5"
            } `}
          >
            <span className="text-[8px] font-black tracking-widest text-[#8291A1] uppercase">
              Price
            </span>

            <span
              className={`text-sm font-black ${
                best ? "text-[#E76F51]" : "text-[#102A43]"
              } `}
            >
              {formatPrice(product.price)}
            </span>
          </div>

          <div
            className={`relative -mt-px flex h-7 w-7 rotate-45 items-center justify-center border-2 shadow-sm ${
              best
                ? "border-[#E76F51] bg-[#E76F51]"
                : "border-[#102A43] bg-[#102A43]"
            } `}
          >
            <ShoppingCart size={13} className="rotate-[-45deg] text-white" />
          </div>

          <div className="mt-1 max-w-[150px] truncate bg-[#102A43] px-2 py-1 text-[9px] font-black tracking-wide text-white uppercase shadow-sm">
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
          offset={32}
        >
          <div className="w-[250px] bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="block text-[8px] font-black tracking-[0.2em] text-[#8291A1] uppercase">
                  Market
                </span>

                <h3 className="mt-1 truncate text-sm font-black text-[#102A43]">
                  {market.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-7 w-7 shrink-0 items-center justify-center border border-[#D8D1C1] bg-[#F7F3E8] text-[#8291A1] transition-colors hover:text-[#102A43]"
              >
                <X size={14} />
              </button>
            </div>

            {market.street && (
              <div className="mt-3 flex items-start gap-2 border-t border-[#E8E2D5] pt-3 text-xs text-[#8291A1]">
                <MapPin size={13} className="mt-0.5 shrink-0 text-[#6B9080]" />

                <span className="leading-4">{market.street}</span>
              </div>
            )}

            {product.product && (
              <div className="mt-3">
                <span className="block text-[8px] font-black tracking-[0.18em] text-[#8291A1] uppercase">
                  Looking for
                </span>

                <p className="mt-1 text-xs font-bold text-[#102A43]">
                  {product.product}
                </p>
              </div>
            )}

            <div
              className={`mt-4 flex items-center justify-between border p-3 ${
                best
                  ? "border-[#E76F51] bg-[#FFF1ED]"
                  : "border-[#D8D1C1] bg-[#F7F3E8]"
              } `}
            >
              <div>
                <span className="block text-[8px] font-black tracking-[0.18em] text-[#8291A1] uppercase">
                  Current price
                </span>

                <span
                  className={`mt-0.5 block text-xl font-black ${
                    best ? "text-[#E76F51]" : "text-[#102A43]"
                  } `}
                >
                  {formatPrice(product.price)}
                </span>
              </div>

              {best && (
                <span className="bg-[#E76F51] px-2 py-1 text-[8px] font-black tracking-wider text-white uppercase">
                  Best deal
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onRoute}
              className="mt-3 flex w-full items-center justify-center gap-2 bg-[#102A43] py-3 text-xs font-black tracking-wider text-white uppercase transition-all hover:bg-[#183B59] active:translate-y-0.5"
            >
              <Navigation size={14} />
              Get directions
              <ArrowUpRight size={13} />
            </button>
          </div>
        </Popup>
      )}
    </>
  )
}
