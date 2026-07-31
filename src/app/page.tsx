"use client"

import { useState } from "react"
import { MapPin, Search, PackageSearch, ShoppingCart } from "lucide-react"

import MarketCard from "@/components/MarketCard"
import BottomNav from "@/components/BottomNav"
import { useMarketData } from "@/hooks/useMarketData"
import { useMarketFilter } from "@/hooks/useMarketFilter"
import { MarketWithDistance } from "@/types"

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

  const { markets, prices, products, loading, locationError } = useMarketData()

  const { filteredMarkets, getPriceForMarket } = useMarketFilter({
    markets,
    prices,
    products,
    search,
    category,
  })

  function clearFilters() {
    setSearch("")
    setCategory("Tudo")
  }

  return (
    <main className="bg-background min-h-screen pb-24">
      <Header />

      <SearchBar
        value={search}
        onChange={setSearch}
        onClear={() => setSearch("")}
      />

      <LocationBadge
        loading={loading}
        error={locationError}
        count={filteredMarkets.length}
      />

      <CategoryFilter
        categories={CATEGORIES}
        active={category}
        onChange={setCategory}
      />

      <section className="px-4 pt-5">
        <ResultsHeader
          search={search}
          category={category}
          count={filteredMarkets.length}
        />

        {loading ? (
          <MarketListSkeleton />
        ) : filteredMarkets.length > 0 ? (
          filteredMarkets.map((market: MarketWithDistance, index: number) => (
            <MarketCard
              key={market.id}
              market={market}
              best={index === 0}
              rank={index + 1}
              price={getPriceForMarket(market.id)}
            />
          ))
        ) : (
          <EmptyState search={search} onClear={clearFilters} />
        )}
      </section>

      <BottomNav />
    </main>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Header() {
  return (
    <header className="border-border bg-card border-b px-4 pt-6 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">PricePal</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Onde comprar melhor perto de você
          </p>
        </div>
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-2xl">
          <ShoppingCart size={20} className="text-primary" />
        </div>
      </div>
    </header>
  )
}

function SearchBar({
  value,
  onChange,
  onClear,
}: {
  value: string
  onChange: (v: string) => void
  onClear: () => void
}) {
  return (
    <section className="px-4 pt-4">
      <div className="border-border bg-card flex items-center gap-3 rounded-2xl border px-4 shadow-sm">
        <Search size={18} className="text-muted-foreground shrink-0" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="placeholder:text-muted-foreground h-12 flex-1 bg-transparent text-sm outline-none"
          placeholder="Buscar produto ou mercado..."
        />
        {value && (
          <button
            onClick={onClear}
            aria-label="Limpar busca"
            className="text-muted-foreground hover:text-foreground hover:bg-secondary flex h-6 w-6 items-center justify-center rounded-full text-sm transition"
          >
            ✕
          </button>
        )}
      </div>
    </section>
  )
}

function LocationBadge({
  loading,
  error,
  count,
}: {
  loading: boolean
  error: string | null
  count: number
}) {
  const label = loading
    ? "Obtendo sua localização..."
    : error
      ? `Localização padrão · ${count} mercados`
      : `Sua localização · ${count} mercados`

  return (
    <div className="px-4 pt-3">
      <div className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
        <MapPin size={14} />
        <span>{label}</span>
      </div>
    </div>
  )
}

function CategoryFilter({
  categories,
  active,
  onChange,
}: {
  categories: string[]
  active: string
  onChange: (cat: string) => void
}) {
  return (
    <section className="mt-3 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-1">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`rounded-full border px-4 py-2 text-sm whitespace-nowrap transition-all duration-200 ${
            active === cat
              ? "border-primary bg-primary text-primary-foreground shadow-sm"
              : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
          }`}
        >
          {cat}
        </button>
      ))}
    </section>
  )
}

function ResultsHeader({
  search,
  category,
  count,
}: {
  search: string
  category: string
  count: number
}) {
  const label = search
    ? `Resultados para "${search}"`
    : category !== "Tudo"
      ? `Mercados com ${category}`
      : "Mercados próximos"

  return (
    <div className="mb-3 flex items-center justify-between">
      <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
        {label}
      </p>
      {count > 0 && (
        <span className="text-muted-foreground text-xs">
          {count} resultado{count !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  )
}

function MarketListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="bg-card h-[88px] animate-pulse rounded-3xl border"
        />
      ))}
    </div>
  )
}

function EmptyState({
  search,
  onClear,
}: {
  search: string
  onClear: () => void
}) {
  return (
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
        onClick={onClear}
        className="text-primary mt-1 text-sm font-medium hover:underline"
      >
        Limpar filtros
      </button>
    </div>
  )
}
