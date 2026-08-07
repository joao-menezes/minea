"use client"

import Link from "next/link"
import {
  ChevronRight,
  MapPin,
  TrendingDown,
} from "lucide-react"

import { formatPrice } from "@/lib/utils"

type Price = {
  price: number
  currency?: string
  product?: string
}

type Market = {
  id: string
  name: string
  street?: string
  distance?: number
  image?: string
  open?: boolean
}

type Props = {
  market: Market
  best: boolean
  price?: Price
  rank?: number
  variant?: "row" | "grid"
}

export default function MarketCard({
  market,
  best,
  price,
  rank,
  variant = "row",
}: Props) {
  const isGrid = variant === "grid"

  return (
    <Link
      href={`/market/${market.id}`}
      className={`
group
relative
overflow-hidden
border
border-[#D8D1C1]
bg-white
transition-all
duration-200
hover:-translate-y-0.5
hover:border-[#102A43]
hover:shadow-[0_6px_0_#102A43]
active:translate-y-0
active:shadow-none

${
  isGrid
    ? "flex min-h-[220px] flex-col p-4"
    : "flex w-full items-center justify-between p-4"
}
`}
    >

      {best && (
        <div className="absolute left-0 top-0 h-full w-1 bg-[#E76F51]" />
      )}

      <div
        className={
          isGrid
            ? "flex flex-col gap-4"
            : "flex min-w-0 items-center gap-4"
        }
      >

        <div
          className={`
relative
flex
shrink-0
items-center
justify-center
bg-[#102A43]
text-white

${
  isGrid
    ? "h-12 w-12"
    : "h-14 w-14"
}
`}
        >
          {rank !== undefined ? (
            <div className="text-center">

              <span className="block text-[9px] font-bold uppercase tracking-widest text-[#8FA7BB]">
                Rank
              </span>

              <span
                className={
                  isGrid
                    ? "text-lg font-black"
                    : "text-xl font-black"
                }
              >
                #{rank}
              </span>

            </div>
          ) : (
            <MapPin className="h-5 w-5" />
          )}

          {best && (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#F4C95D] text-[#102A43]">
              <TrendingDown className="h-3 w-3" />
            </span>
          )}
        </div>

        <div className="min-w-0">

          <div className="flex items-center gap-2">

            <h3 className="truncate text-sm font-black text-[#102A43]">
              {market.name}
            </h3>

            {market.open === false && (
              <span className="shrink-0 border border-[#E7B5A9] bg-[#FFF1ED] px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide text-[#C9563D]">
                Closed
              </span>
            )}

          </div>

          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#8291A1]">

            <MapPin
              size={12}
              className="shrink-0 text-[#6B9080]"
            />

            <span className="font-bold">
              {formatDistance(market.distance)}
            </span>

            {!isGrid && market.street && (
              <>
                <span className="opacity-40">·</span>

                <span className="max-w-[150px] truncate">
                  {market.street}
                </span>
              </>
            )}

          </div>

          {best && (
            <span
              className="
                mt-2
                inline-flex
                items-center
                gap-1.5
                bg-[#FFF1D0]
                px-2
                py-1
                text-[9px]
                font-black
                uppercase
                tracking-wider
                text-[#80651D]
              "
            >
              <TrendingDown size={10} />

              Best deal
            </span>
          )}

          {price?.product && (
            <span
              className="
                mt-1.5
                block
                max-w-full
                truncate
                text-[10px]
                font-medium
                uppercase
                tracking-wide
                text-[#8291A1]
              "
            >
              {price.product}
            </span>
          )}

        </div>
      </div>

      <div
        className={
          isGrid
            ? "mt-auto flex items-end justify-between border-t border-[#E8E2D5] pt-4"
            : "flex shrink-0 items-center gap-3 pl-3"
        }
      >

        <div>

          {price ? (
            <>
              <span className="block text-[9px] font-black uppercase tracking-widest text-[#8291A1]">
                Price
              </span>

              <div
                className={`
mt-0.5
font-black
tracking-tight

${
  isGrid
    ? "text-xl"
    : "text-xl"
}

${
  best
    ? "text-[#E76F51]"
    : "text-[#102A43]"
}
`}
              >
                {formatPrice(price.price)}
              </div>
            </>
          ) : (
            <span className="text-xs italic text-[#9BA6B0]">
              Price unavailable
            </span>
          )}

        </div>
        <div
          className={`
flex
shrink-0
items-center
justify-center
border
transition-all
duration-200

${
  best
    ? "border-[#E76F51] bg-[#E76F51] text-white"
    : "border-[#D8D1C1] bg-[#F7F3E8] text-[#102A43]"
}

${
  isGrid
    ? "h-9 w-9"
    : "h-9 w-9"
}

group-hover:translate-x-0.5
  `}
        >
          <ChevronRight size={17} />
        </div>

      </div>

    </Link>
  )
}


/* =========================================================
   DISTANCE FORMATTER
========================================================= */

function formatDistance(distance?: number) {
  if (distance === undefined) {
    return "--"
  }

  if (distance < 1000) {
    return `${Math.round(distance)} m`
  }

  return `${(distance / 1000).toFixed(1)} km`
}