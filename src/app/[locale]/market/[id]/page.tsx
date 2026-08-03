"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { LayoutGrid, List, MapPin, MapPinned, ShoppingCart } from "lucide-react"

import ScoreBar from "@/components/ScoreBar"
import BottomNav from "@/components/BottomNav"
import BackButton from "@/components/BackButton"
import PriceCard from "@/components/PriceCard"

import { getMarkets, getPrices } from "@/lib/api"
import { useTranslations } from "next-intl"
import { LoadSpinner } from "@/components/LoadSpinner"

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

type ViewMode = "row" | "grid"

export default function MarketDetailsPage({ params }: Props) {
  const t = useTranslations("Details")

  const { id } = use(params)

  const [market, setMarket] = useState<Market | null>(null)
  const [prices, setPrices] = useState<Price[]>([])
  const [loading, setLoading] = useState(true)

  const [viewMode, setViewMode] = useState<ViewMode>("row")

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
    return <LoadSpinner />
  }

  if (!market) {
    notFound()
  }

  return (
    <main className="bg-background min-h-screen pb-24">
      <BackButton variant="header" />

      <section className="px-4 pt-4">
        <div className="bg-card rounded-3xl border p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-4">
              <div className="bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-2xl">
                <ShoppingCart className="h-8 w-8" />
              </div>

              <div>
                <h1 className="text-xl font-bold">{market.name}</h1>

                <p className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
                  <MapPin className="h-4 w-4" />
                  {market.street}
                </p>
              </div>
            </div>

            <button className="bg-primary text-primary-foreground rounded-xl px-3 py-2 text-sm font-medium">
              Reportar Preço
            </button>
          </div>

          <Link
            href={`/map?focus=${market.id}`}
            className="bg-secondary mt-5 flex items-center justify-center gap-2 rounded-2xl py-3 font-medium transition hover:opacity-90"
          >
            <MapPinned className="h-5 w-5" />
            {t("viewOnMap")}
          </Link>
        </div>
      </section>

      <section className="mt-6 px-4">
        <p className="text-muted-foreground mb-3 text-xs font-medium tracking-wider uppercase">
          {t("rating")}
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
          <div>
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              {t("pricesFound")}
            </p>

            <span className="text-muted-foreground text-xs">
              {t("items", {
                count: prices.length,
              })}
            </span>
          </div>

          <div className="bg-card flex gap-1 rounded-2xl border p-1">
            <button
              onClick={() => setViewMode("row")}
              className={`rounded-xl p-2 transition ${
                viewMode === "row" ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              <List className="h-4 w-4" />
            </button>

            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-xl p-2 transition ${
                viewMode === "grid" ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 gap-3 md:grid-cols-3"
              : "flex flex-col gap-3"
          }
        >
          {prices.length > 0 ? (
            prices.map((price) => (
              <PriceCard
                key={price.id}
                product={price.product}
                price={price.price}
                marketId={market.id}
                variant={viewMode}
                lowestPriceText={t("lowestPriceReported")}
              />
            ))
          ) : (
            <div className="bg-card text-muted-foreground rounded-3xl border p-5 text-center text-sm">
              {t("noPricesFound")}
            </div>
          )}
        </div>
      </section>

      <BottomNav />
    </main>
  )
}
