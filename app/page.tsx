"use client"

import { useMemo, useState } from "react"
import { MapPin, Search, PackageSearch } from "lucide-react"

import { MARKETS, USER_LOCATION, haversineDistance } from "@/data/markets"
import MarketCard from "@/components/MarketCard"
import BottomNav from "@/components/BottomNav"
import { useUserLocation } from "./hooks/useUserLocation"

const CATEGORIES = [
  "Tudo",
  "Grãos",
  "Carnes",
  "Laticínios",
  "Frutas",
  "Bebidas",
]

export default function Home() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("Tudo")

  const { location, loading, error } = useUserLocation()

  const origin = location
    ? { lat: location.latitude, lng: location.longitude }
    : USER_LOCATION

  const markets = useMemo(() => {
    return MARKETS.map((market) => {
      const distance = Math.round(haversineDistance(origin, market.coordinate))

      const totalScore =
        market.scores.price * 0.4 +
        market.scores.quality * 0.2 +
        market.scores.distance * 0.2 +
        market.scores.availability * 0.2

      return { ...market, distance, totalScore }
    }).sort((a, b) => b.totalScore - a.totalScore)
  }, [origin])

  const filteredMarkets = markets.filter((market) => {
    const matchesSearch =
      !search ||
      market.name.toLowerCase().includes(search.toLowerCase()) ||
      market.street.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      category === "Tudo" ||
      market.products.some((p) => p.category === category)

    return matchesSearch && matchesCategory
  })

  function clearFilters() {
    setSearch("")
    setCategory("Tudo")
  }

  return (
    <main className="bg-background min-h-screen pb-24">
      <header className="border-border bg-card border-b px-4 py-5">
        <h1 className="text-3xl font-bold tracking-tight">PricePal</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Onde comprar melhor perto de você
        </p>
      </header>

      <section className="p-4">
        <div className="border-border bg-card flex items-center gap-3 rounded-2xl border px-4 shadow-sm">
          <Search size={20} className="text-muted-foreground" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="placeholder:text-muted-foreground h-12 flex-1 bg-transparent outline-none"
            placeholder="Buscar mercado..."
          />
        </div>

        <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-700">
          <MapPin size={16} />
          {loading
            ? "Obtendo sua localização..."
            : error
              ? `Localização padrão · ${MARKETS.length} mercados próximos`
              : `Sua localização · ${MARKETS.length} mercados próximos`}
        </div>
      </section>

      <section className="flex gap-2 overflow-x-auto px-4 pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-full border px-4 py-2 text-sm whitespace-nowrap transition ${
              category === cat
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground"
            } `}
          >
            {cat}
          </button>
        ))}
      </section>

      <section className="px-4 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-muted-foreground text-xs tracking-wider uppercase">
            Melhores mercados próximos
          </p>

          {filteredMarkets.length > 0 && (
            <span className="text-muted-foreground text-xs">
              {filteredMarkets.length} resultado
              {filteredMarkets.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="bg-card h-[76px] animate-pulse rounded-2xl border"
              />
            ))}
          </div>
        ) : filteredMarkets.length > 0 ? (
          filteredMarkets.map((market, index) => (
            <MarketCard key={market.id} market={market} best={index === 0} />
          ))
        ) : (
          <div className="border-border bg-card flex flex-col items-center gap-3 rounded-2xl border p-8 text-center">
            <PackageSearch size={32} className="text-muted-foreground" />

            <div>
              <p className="font-medium">Nenhum mercado encontrado</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Tente ajustar sua busca ou categoria
              </p>
            </div>

            <button
              onClick={clearFilters}
              className="text-primary mt-1 text-sm font-medium hover:underline"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </section>

      <BottomNav />
    </main>
  )
}
