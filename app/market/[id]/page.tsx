"use client"

import { use } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, MapPinned } from "lucide-react"

import { getMarketById, formatPrice } from "@/data/markets"
import ScoreBar from "@/components/ScoreBar"
import BottomNav from "@/components/BottomNav"

type Props = {
  params: Promise<{ id: string }>
}

export default function MarketDetailsPage({ params }: Props) {
  const { id } = use(params)
  const market = getMarketById(id)

  if (!market) {
    notFound()
  }

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
            {market.emoji}
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

      <section className="mt-6 px-4">
        <p className="text-muted-foreground mb-3 text-xs tracking-wider uppercase">
          Avaliação
        </p>

        <div className="bg-card rounded-2xl border p-4">
          <ScoreBar scores={market.scores} />
        </div>
      </section>

      <section className="mt-6 px-4">
        <p className="text-muted-foreground mb-3 text-xs tracking-wider uppercase">
          Produtos ({market.products.length})
        </p>

        <div className="flex flex-col gap-2">
          {market.products.map((product) => (
            <div
              key={product.id}
              className="bg-card flex items-center justify-between rounded-xl border p-3"
            >
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-muted-foreground text-xs">
                  {product.category}
                </p>
              </div>

              <div className="text-right">
                <p className="text-primary font-bold">
                  {formatPrice(product.price, market.currency)}
                </p>
                <p className="text-muted-foreground text-xs">
                  por {product.unit}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BottomNav />
    </main>
  )
}
