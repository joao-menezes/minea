"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, MapPinned } from "lucide-react"

import ScoreBar from "@/components/ScoreBar"
import BottomNav from "@/components/BottomNav"
import { getMarkets, getPrices } from "@/lib/api"
import { formatPrice } from "@/lib/utils"

type Props = {
  params: Promise<{ id: string }>
}

export default function MarketDetailsPage({ params }: Props) {
  const { id } = use(params)

  const [market, setMarket] = useState<any>(null)
  const [prices, setPrices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [markets, allPrices] = await Promise.all([
        getMarkets(),
        getPrices(),
      ])

      const found = markets.find((m: any) => m.id === id)
      if (!found) {
        setLoading(false)
        return
      }

      const marketPrices = allPrices.filter((p: any) => p.marketId === id)

      setMarket(found)
      setPrices(marketPrices)
      setLoading(false)
    }

    load()
  }, [id])

  if (loading) {
    return (
      <main className="bg-background flex min-h-screen items-center justify-center">
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-card h-16 w-80 animate-pulse rounded-2xl border"
            />
          ))}
        </div>
      </main>
    )
  }

  if (!market) notFound()

  return (
    <main className="bg-background min-h-screen pb-24">
      <header className="border-border bg-card sticky top-0 z-10 border-b px-4 py-4">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition"
        >
          <ArrowLeft size={18} />
          Voltar
        </Link>
      </header>

      <section className="px-4 pt-5">
        <div className="flex items-center gap-4">
          <div className="bg-secondary flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl">
            {market.emoji ?? "🛒"}
          </div>

          <div>
            <h1 className="text-2xl font-bold">{market.name}</h1>
            <p className="text-muted-foreground mt-0.5 text-sm">
              📍 {market.street} · {market.distance}m
            </p>
          </div>
        </div>

        <Link
          href={`/map?focus=${market.id}`}
          className="border-border bg-card mt-4 flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium shadow-sm transition hover:shadow-md"
        >
          <MapPinned size={16} className="text-primary" />
          Ver no mapa
        </Link>
      </section>

      {market.scores && (
        <section className="mt-6 px-4">
          <p className="text-muted-foreground mb-3 text-xs tracking-wider uppercase">
            Avaliação
          </p>
          <div className="bg-card rounded-2xl border p-4">
            <ScoreBar scores={market.scores} />
          </div>
        </section>
      )}

      <section className="mt-6 px-4">
        <p className="text-muted-foreground mb-3 text-xs tracking-wider uppercase">
          Preços reportados ({prices.length})
        </p>

        <div className="flex flex-col gap-2">
          {prices.length > 0 ? (
            prices.map((price) => (
              <div
                key={price.id}
                className="bg-card flex items-center justify-between rounded-xl border p-3"
              >
                <div>
                  <p className="font-medium capitalize">{price.product}</p>
                  <p className="text-muted-foreground text-xs">
                    Atualizado em {price.reportedAt}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-primary font-bold">
                    {formatPrice(price.price, price.currency)}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    por {price.unit}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-card rounded-xl border p-4 text-center text-sm text-gray-400">
              Nenhum preço reportado ainda
            </div>
          )}
        </div>
      </section>

      <BottomNav />
    </main>
  )
}
