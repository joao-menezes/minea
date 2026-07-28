"use client"

import Link from "next/link"
import { ChevronRight, MapPin } from "lucide-react"

import { formatPrice } from "@/data/markets"

type Product = {
  name: string
  price: number
  unit: string
}

type Market = {
  id: string
  name: string
  street?: string
  distance: number
  currency: string
  emoji?: string
  products: Product[]
}

type Props = {
  market: Market
  best: boolean
}

export default function MarketCard({ market, best }: Props) {
  const product = market.products[0]

  return (
    <Link
      href={`/market/${market.id}`}
      className="group bg-card mb-3 flex w-full items-center justify-between rounded-3xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
    >
      <div className="flex min-w-0 items-center gap-4">
        {/* Avatar */}
        <div className="bg-secondary flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-inner">
          {market.emoji ?? "🛒"}
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-bold">{market.name}</h3>

          <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
            <MapPin size={13} />

            <span>{market.distance}m de distância</span>
          </div>

          {best && (
            <span className="mt-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-bold text-green-700">
              🥇 Melhor preço
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-right">
          {product ? (
            <>
              <div className="text-primary text-xl font-extrabold">
                {formatPrice(product.price, market.currency)}
              </div>

              <span className="text-muted-foreground text-xs">
                / {product.unit}
              </span>
            </>
          ) : (
            <span className="text-muted-foreground text-xs italic">
              Sem produtos
            </span>
          )}
        </div>

        <div className="bg-secondary group-hover:bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full transition">
          <ChevronRight
            size={18}
            className="text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </Link>
  )
}
