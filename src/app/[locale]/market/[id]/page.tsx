"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { notFound, useRouter } from "next/navigation"
import {
  ArrowUpRight,
  LayoutGrid,
  List,
  MapPin,
  MapPinned,
  Navigation,
  ShoppingCart,
  Users,
} from "lucide-react"

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
  const router = useRouter()

  const { id } = use(params)

  const [market, setMarket] = useState<Market | null>(null)
  const [prices, setPrices] = useState<Price[]>([])
  const [loading, setLoading] = useState(true)

  const [viewMode, setViewMode] = useState<ViewMode>("row")

  useEffect(() => {
    async function load() {
      try {
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

          /*
           * Temporary values.
           * Replace with scores calculated by the backend
           * when the scoring system is implemented.
           */
          scores: {
            price: 90,
            quality: 85,
            distance: 95,
            availability: 80,
          },
        })

        setPrices(marketPrices)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F3E8]">
        <div className="flex min-h-[70vh] items-center justify-center">
          <LoadSpinner />
        </div>

        <BottomNav />
      </main>
    )
  }

  if (!market) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#F7F3E8] pb-24">
      <header className="sticky top-0 z-30 border-b border-[#D8D1C1] bg-[#F7F3E8]/95 px-4 py-3 backdrop-blur">
        <BackButton />
      </header>

      <section className="px-4 pt-5">
        <div className="relative overflow-hidden border border-[#D8D1C1] bg-white">
          <div className="h-1 bg-[#6B9080]" />

          <div className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-[#DDECE5] text-[#467566]">
                  <ShoppingCart className="h-7 w-7" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[9px] font-black tracking-[0.2em] text-[#8291A1] uppercase">
                    Market
                  </span>

                  <h1 className="mt-1 text-xl leading-tight font-black tracking-tight text-[#102A43]">
                    {market.name}
                  </h1>

                  <p className="mt-2 flex items-start gap-1.5 text-xs leading-4 text-[#8291A1]">
                    <MapPin
                      className="mt-0.5 shrink-0 text-[#6B9080]"
                      size={13}
                    />

                    <span>{market.street}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 divide-x border border-[#E8E2D5] bg-[#F7F3E8]">
              <div className="px-4 py-3">
                <span className="block text-[8px] font-black tracking-wider text-[#8291A1] uppercase">
                  Location
                </span>

                <div className="mt-1 flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#6B9080]" />

                  <strong className="text-xs text-[#102A43]">Nearby</strong>
                </div>
              </div>

              <div className="px-4 py-3">
                <span className="block text-[8px] font-black tracking-wider text-[#8291A1] uppercase">
                  Prices
                </span>

                <strong className="mt-1 block text-xs text-[#102A43]">
                  {prices.length} items
                </strong>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                href={`/map?focus=${market.id}`}
                className="flex items-center justify-center gap-2 border border-[#D8D1C1] bg-[#F7F3E8] py-3 text-xs font-black tracking-wider text-[#102A43] uppercase transition-all hover:border-[#102A43]"
              >
                <MapPinned size={14} />

                {t("viewOnMap")}
              </Link>

              <button
                type="button"
                onClick={() => router.push(`/report?marketId=${market.id}`)}
                className="flex items-center justify-center gap-2 bg-[#E76F51] py-3 text-xs font-black tracking-wider text-white uppercase transition-all hover:bg-[#D85F47] active:translate-y-0.5"
              >
                <Users size={14} />
                Report price
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-6 px-4">
        <div className="mb-3">
          <span className="text-[9px] font-black tracking-[0.2em] text-[#8291A1] uppercase">
            Recommendation
          </span>

          <h2 className="mt-1 text-base font-black text-[#102A43]">
            Should you go here?
          </h2>
        </div>

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
      </section>

      <section className="mt-7 px-4">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <span className="text-[9px] font-black tracking-[0.2em] text-[#8291A1] uppercase">
              Available prices
            </span>

            <h2 className="mt-1 text-base font-black text-[#102A43]">
              What can you buy here?
            </h2>

            <p className="mt-1 text-xs text-[#8291A1]">
              {t("items", {
                count: prices.length,
              })}
            </p>
          </div>

          <div className="flex border border-[#D8D1C1] bg-white p-1">
            <button
              type="button"
              onClick={() => setViewMode("row")}
              aria-label="List view"
              className={`flex h-8 w-8 items-center justify-center transition-colors ${
                viewMode === "row"
                  ? "bg-[#102A43] text-white"
                  : "text-[#8291A1]"
              } `}
            >
              <List className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              className={`flex h-8 w-8 items-center justify-center transition-colors ${
                viewMode === "grid"
                  ? "bg-[#102A43] text-white"
                  : "text-[#8291A1]"
              } `}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
        {prices.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3"
                : "flex flex-col gap-3"
            }
          >
            {prices.map((price) => (
              <PriceCard
                key={price.id}
                product={price.product}
                price={price.price}
                marketId={market.id}
                variant={viewMode}
                lowestPriceText={t("lowestPriceReported")}
              />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-[#C8C0AF] bg-white px-5 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center bg-[#F7F3E8] text-[#8291A1]">
              <ShoppingCart size={20} />
            </div>

            <h3 className="mt-4 text-sm font-black text-[#102A43]">
              No prices yet
            </h3>

            <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-[#8291A1]">
              Be the first traveler to report a price at this market.
            </p>

            <button
              type="button"
              onClick={() => router.push(`/report?marketId=${market.id}`)}
              className="mt-4 inline-flex items-center gap-2 bg-[#E76F51] px-4 py-2.5 text-xs font-black tracking-wider text-white uppercase"
            >
              Report a price
              <ArrowUpRight size={13} />
            </button>
          </div>
        )}
      </section>

      <section className="mt-7 px-4">
        <div className="border border-[#D8D1C1] bg-[#102A43] p-5 text-white">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-white/10">
              <Users size={17} />
            </div>

            <div>
              <span className="text-[9px] font-black tracking-[0.2em] text-[#9FB3C3] uppercase">
                Help other travelers
              </span>

              <h3 className="mt-1 text-sm font-black">Share what you find.</h3>

              <p className="mt-2 text-xs leading-5 text-[#B7C5D0]">
                Prices change quickly. A fresh report can help the next traveler
                make a better decision.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push(`/report?marketId=${market.id}`)}
            className="mt-4 flex w-full items-center justify-center gap-2 bg-[#F4C95D] py-3 text-xs font-black tracking-wider text-[#102A43] uppercase"
          >
            <Users size={14} />
            Report a price
          </button>
        </div>
      </section>

      <BottomNav />
    </main>
  )
}
