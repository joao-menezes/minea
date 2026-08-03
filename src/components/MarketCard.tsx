"use client"

import Link from "next/link"
import { ChevronRight, MapPin, ShoppingCart, TrendingDown } from "lucide-react"
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
      className={`group transition-all duration-200 hover:shadow-lg active:scale-[0.98] ${
        isGrid
          ? "flex min-h-[180px] flex-col rounded-3xl border p-3 shadow-sm"
          : "flex w-full items-center justify-between rounded-3xl border p-4 shadow-sm"
      } ${
        best
          ? "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20"
          : "bg-card border-border"
      }`}
    >
      <div
        className={
          isGrid ? "flex flex-col gap-2" : "flex min-w-0 items-center gap-4"
        }
      >
        <div className="relative">
          <div
            className={`flex items-center justify-center rounded-2xl text-3xl shadow-inner ${
              isGrid ? "h-12 w-12" : "h-14 w-14"
            } ${best ? "bg-green-100 dark:bg-green-900/40" : "bg-secondary"}`}
          >
            <ShoppingCart />
          </div>

          {rank !== undefined && rank <= 3 && (
            <span className="border-border absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border bg-white text-[11px] shadow-sm">
              {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <h3 className="truncate text-sm font-bold">{market.name}</h3>

            {market.open === false && (
              <span className="text-[9px] font-medium text-red-500">
                Fechado
              </span>
            )}
          </div>

          <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
            <MapPin size={12} />

            <span>{market.distance}m</span>

            {!isGrid && market.street && (
              <>
                <span className="opacity-40">·</span>
                <span className="max-w-[120px] truncate">{market.street}</span>
              </>
            )}
          </div>

          {!isGrid && best && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-bold text-green-700 dark:bg-green-900/40 dark:text-green-400">
              <TrendingDown size={11} />
              Melhor preço
            </span>
          )}

          {price?.product && (
            <span className="mt-1 inline-flex max-w-full truncate rounded-full bg-blue-50 px-2 py-0.5 text-[10px] text-blue-600 capitalize dark:bg-blue-900/30 dark:text-blue-400">
              {price.product}
            </span>
          )}
        </div>
      </div>

      <div
        className={
          isGrid
            ? "mt-auto flex items-end justify-between pt-3"
            : "flex items-center gap-2 pl-2"
        }
      >
        <div>
          {price ? (
            <div
              className={`font-extrabold ${isGrid ? "text-lg" : "text-xl"} ${
                best ? "text-green-600 dark:text-green-400" : "text-primary"
              }`}
            >
              {formatPrice(price.price)}
            </div>
          ) : (
            <span className="text-muted-foreground text-xs italic">
              Sem preço
            </span>
          )}
        </div>

        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            best ? "bg-green-100 dark:bg-green-900/40" : "bg-secondary"
          }`}
        >
          <ChevronRight
            size={18}
            className={
              best
                ? "text-green-600 dark:text-green-400"
                : "text-muted-foreground"
            }
          />
        </div>
      </div>
    </Link>
  )
}
