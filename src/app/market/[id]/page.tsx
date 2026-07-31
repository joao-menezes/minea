"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MapPinned, ShoppingCart } from "lucide-react"

import ScoreBar from "@/components/ScoreBar"
import BottomNav from "@/components/BottomNav"
import BackButton from "@/components/BackButton"

import { getMarkets, getPrices } from "@/lib/api"
import { formatPrice } from "@/lib/utils"

type Score = {
  price: number
  quality: number
  distance: number
  availability: number
}

type Market = {
  id: string
  name: string
  street: string
  coordinate: {
    lat: number
    lng: number
  }
  scores?: Score
}

type Price = {
  id: string
  marketId: string
  product: string
  price: number
}

type Props = {
  params: Promise<{
    id: string
  }>
}

export default function MarketDetailsPage({ params }: Props) {
  const { id } = use(params)

  const [market, setMarket] = useState<Market | null>(null)
  const [prices, setPrices] = useState<Price[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [markets, allPrices] = await Promise.all([
        getMarkets(),
        getPrices(),
      ])

      const found = markets.find((market: Market) => market.id === id)

      if (!found) {
        setLoading(false)
        return
      }

      const marketPrices = allPrices.filter(
        (price: Price) => price.marketId === id,
      )

      setMarket({
        ...found,
        scores: {
          price: 90,
          quality: 85,
          distance: 95,
          availability: 80,
        },
      })

      setPrices(marketPrices)

      setLoading(false)
    }

    load()
  }, [id])

  if (loading) {
    return (
      <main className="bg-background flex min-h-screen items-center justify-center">
        <div className="bg-card h-20 w-80 animate-pulse rounded-3xl border" />
      </main>
    )
  }

  if (!market) {
    notFound()
  }

  return (
    <main className="bg-background min-h-screen pb-24">
      <BackButton variant="header" label="Voltar" />

      <section className="px-4 pt-5">
        <div className="flex items-center gap-4">
          <div className="bg-secondary flex h-16 w-16 items-center justify-center rounded-2xl">
            <ShoppingCart size={30} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">{market.name}</h1>

            <p className="text-muted-foreground mt-1 text-sm">
              📍 {market.street}
            </p>
          </div>
        </div>

        <Link
          href={`/map?focus=${market.id}`}
          className="border-border bg-card mt-4 flex items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-medium shadow-sm transition hover:shadow-md"
        >
          <MapPinned size={17} className="text-primary" />
          Ver no mapa
        </Link>
      </section>

      <section className="mt-6 px-4">
        <p className="text-muted-foreground mb-3 text-xs font-medium tracking-wider uppercase">
          Avaliação
        </p>

        <div className="bg-card rounded-3xl border p-5 shadow-sm">
          <ScoreBar
            scores={
              market.scores ?? {
                price: 0,
                quality: 0,
                distance: 0,
                availability: 0,
              }
            }
          />
        </div>
      </section>

      <section className="mt-6 px-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Preços encontrados
          </p>

          <span className="text-muted-foreground text-xs">
            {prices.length} itens
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {prices.length > 0 ? (
            prices.map((price) => (
              <div
                key={price.id}
                className="bg-card flex items-center justify-between rounded-3xl border p-4 shadow-sm"
              >
                <div>
                  <p className="font-medium">{price.product}</p>

                  <p className="text-muted-foreground text-xs">
                    Menor preço informado
                  </p>
                </div>

                <div className="bg-primary/10 rounded-xl px-3 py-2">
                  <p className="text-primary font-bold">
                    {formatPrice(price.price)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-card text-muted-foreground rounded-3xl border p-5 text-center text-sm">
              Nenhum preço encontrado
            </div>
          )}
        </div>
      </section>

      <BottomNav />
    </main>
  )
}
