"use client"

import { useEffect, useMemo, useState } from "react"
import { MapPin, Search, PackageSearch, ShoppingCart } from "lucide-react"

import MarketCard from "@/components/MarketCard"
import BottomNav from "@/components/BottomNav"
import { useUserLocation } from "./hooks/useUserLocation"
import { getMarkets, getPrices, getProducts } from "@/lib/api"
import { haversineDistance, USER_LOCATION } from "@/data/markets"

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
  const [markets, setMarkets] = useState<any[]>([])
  const [prices, setPrices] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loadingMarkets, setLoadingMarkets] = useState(true)

  const { location, loading: loadingLocation, error } = useUserLocation()

  useEffect(() => {
    async function load() {
      const [marketsData, pricesData, productsData] = await Promise.all([
        getMarkets(),
        getPrices(),
        getProducts(),
      ])
      setMarkets(marketsData)
      setPrices(pricesData)
      setProducts(productsData)
      setLoadingMarkets(false)
    }
    load()
  }, [])

  const origin = location
    ? { lat: location.latitude, lng: location.longitude }
    : USER_LOCATION

  const rankedMarkets = useMemo(() => {
    return markets
      .map((market) => ({
        ...market,
        distance: Math.round(haversineDistance(origin, market.coordinate)),
      }))
      .sort((a, b) => a.distance - b.distance)
  }, [markets, origin])

  const productsInCategory = useMemo(() => {
    if (category === "Tudo") return products.map((p) => p.name)
    return products.filter((p) => p.category === category).map((p) => p.name)
  }, [products, category])

  const filteredMarkets = useMemo(() => {
    return rankedMarkets.filter((market) => {
      const marketPrices = prices.filter((p) => p.marketId === market.id)
      const matchesSearch =
        !search ||
        market.name.toLowerCase().includes(search.toLowerCase()) ||
        market.street?.toLowerCase().includes(search.toLowerCase()) ||
        marketPrices.some((p) =>
          p.products?.[0]?.name?.toLowerCase().includes(search.toLowerCase()),
        )
      const matchesCategory =
        category === "Tudo" ||
        marketPrices.some((p) =>
          productsInCategory.includes(p.products?.[0]?.name),
        )
      return matchesSearch && matchesCategory
    })
  }, [rankedMarkets, prices, search, category, productsInCategory])

  function getPriceForMarket(marketId: string) {
    const marketPrices = prices.filter((p) => p.market_id === marketId)

    if (marketPrices.length === 0) return undefined

    if (search) {
      const match = marketPrices.find((p) =>
        p.products?.[0]?.name?.toLowerCase().includes(search.toLowerCase()),
      )

      if (match) return match
    }

    return marketPrices.sort((a, b) => a.price - b.price)[0]
  }

  const loading = loadingMarkets || loadingLocation

  function clearFilters() {
    setSearch("")
    setCategory("Tudo")
  }

  return (
    <main className="bg-background min-h-screen pb-24">
      <header className="border-border bg-card border-b px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">PricePal</h1>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Onde comprar melhor perto de você
            </p>
          </div>
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-2xl">
            <span className="text-xl">
              <ShoppingCart />
            </span>
          </div>
        </div>
      </header>

      <section className="px-4 pt-4">
        <div className="border-border bg-card flex items-center gap-3 rounded-2xl border px-4 shadow-sm">
          <Search size={18} className="text-muted-foreground shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="placeholder:text-muted-foreground h-12 flex-1 bg-transparent text-sm outline-none"
            placeholder="Buscar produto ou mercado..."
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary flex h-6 w-6 items-center justify-center rounded-full text-sm transition"
            >
              ✕
            </button>
          )}
        </div>

        <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
          <MapPin size={14} />
          <span>
            {loading
              ? "Obtendo sua localização..."
              : error
                ? `Localização padrão · ${filteredMarkets.length} mercados`
                : `Sua localização · ${filteredMarkets.length} mercados`}
          </span>
        </div>
      </section>

      <section className="mt-3 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-full border px-4 py-2 text-sm whitespace-nowrap transition-all duration-200 ${
              category === cat
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      <section className="px-4 pt-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            {search
              ? `Resultados para "${search}"`
              : category !== "Tudo"
                ? `Mercados com ${category}`
                : "Mercados próximos"}
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
                className="bg-card h-[88px] animate-pulse rounded-3xl border"
              />
            ))}
          </div>
        ) : filteredMarkets.length > 0 ? (
          filteredMarkets.map((market, index) => (
            <MarketCard
              key={market.id}
              market={market}
              best={index === 0}
              rank={index + 1}
              price={getPriceForMarket(market.id)}
            />
          ))
        ) : (
          <div className="border-border bg-card flex flex-col items-center gap-3 rounded-3xl border p-10 text-center">
            <div className="bg-secondary flex h-14 w-14 items-center justify-center rounded-2xl">
              <PackageSearch size={28} className="text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">Nenhum mercado encontrado</p>
              <p className="text-muted-foreground mt-1 text-sm">
                {search
                  ? `Nenhum mercado vende "${search}" por aqui`
                  : "Tente ajustar sua busca ou categoria"}
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
