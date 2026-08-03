"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  MapPin,
  Search,
  PackageSearch,
  ShoppingCart,
  List,
  LayoutGrid,
} from "lucide-react"

import MarketCard from "@/components/MarketCard"
import BottomNav from "@/components/BottomNav"
import { useMarketData } from "@/hooks/useMarketData"
import { useMarketFilter } from "@/hooks/useMarketFilter"
import { PRODUCT_CATEGORIES, ProductCategory } from "@/lib/types"
import { LoadSpinner } from "@/components/LoadSpinner"

const CATEGORY_KEYS = ["all", ...PRODUCT_CATEGORIES] as const

type CategoryKey = "all" | ProductCategory

export default function Home() {
  const t = useTranslations("Home")
  const tCategories = useTranslations("Categories")

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<CategoryKey>("all")

  const [viewMode, setViewMode] = useState<"row" | "grid">("row")

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
    setCategory("all")
  }

  return (
    <main className="bg-background min-h-screen pb-24">
      <Header title={t("title")} subtitle={t("subtitle")} />

      <SearchBar
        value={search}
        onChange={setSearch}
        onClear={() => setSearch("")}
        placeholder={t("searchPlaceholder")}
      />

      <LocationBadge
        loading={loading}
        error={locationError}
        count={filteredMarkets.length}
        t={t}
      />

      <CategoryFilter
        active={category}
        onChange={setCategory}
        tCategories={tCategories}
      />

      <section className="px-4 pt-5">
        <ResultsHeader
          search={search}
          category={category}
          count={filteredMarkets.length}
          t={t}
          tCategories={tCategories}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {loading ? (
          <LoadSpinner />
        ) : filteredMarkets.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 gap-2 md:gap-3 lg:grid-cols-3"
                : "flex flex-col gap-3"
            }
          >
            {filteredMarkets.map((market, index) => (
              <MarketCard
                key={market.id}
                market={market}
                best={index === 0}
                rank={index + 1}
                price={getPriceForMarket(market.id)}
                variant={viewMode}
              />
            ))}
          </div>
        ) : (
          <EmptyState search={search} onClear={clearFilters} t={t} />
        )}
      </section>

      <BottomNav />
    </main>
  )
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="border-border bg-card border-b px-4 pt-6 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">{subtitle}</p>
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
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  onClear: () => void
  placeholder: string
}) {
  return (
    <section className="px-4 pt-4">
      <div className="border-border bg-card flex items-center gap-3 rounded-2xl border px-4 shadow-sm">
        <Search size={18} className="text-muted-foreground shrink-0" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="placeholder:text-muted-foreground h-12 flex-1 bg-transparent text-sm outline-none"
          placeholder={placeholder}
        />
        {value && (
          <button
            onClick={onClear}
            aria-label="Limpar busca"
            className="text-muted-foreground hover:text-foreground hover:bg-secondary flex h-6 w-6 items-center justify-center rounded-full text-sm transition"
          >
            âœ•
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
  t,
}: {
  loading: boolean
  error: string | null
  count: number
  t: ReturnType<typeof useTranslations>
}) {
  const label = loading
    ? t("locationDetecting")
    : error
      ? t("locationDefault", { count })
      : t("locationFound", { count })

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
  active,
  onChange,
  tCategories,
}: {
  active: CategoryKey
  onChange: (cat: CategoryKey) => void
  tCategories: ReturnType<typeof useTranslations>
}) {
  return (
    <section className="mt-3 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-1">
      {CATEGORY_KEYS.map((key) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`rounded-full border px-4 py-2 text-sm whitespace-nowrap transition-all duration-200 ${
            active === key
              ? "border-primary bg-primary text-primary-foreground shadow-sm"
              : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
          }`}
        >
          {tCategories(key)}
        </button>
      ))}
    </section>
  )
}

function ResultsHeader({
  search,
  category,
  count,
  t,
  tCategories,
  viewMode,
  setViewMode,
}: {
  search: string
  category: CategoryKey
  count: number
  t: ReturnType<typeof useTranslations>
  tCategories: ReturnType<typeof useTranslations>
  viewMode: "row" | "grid"
  setViewMode: (mode: "row" | "grid") => void
}) {
  const label = search
    ? t("resultsFor", { search })
    : category !== "all"
      ? t("resultsCategory", { category: tCategories(category) })
      : t("resultsNearby")

  return (
    <div className="mb-3 flex items-center justify-between">
      <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
        {label}

        {count > 0 && <span className="ml-2">({count})</span>}
      </p>

      <div className="flex items-center gap-2">
        <div className="bg-card flex gap-1 rounded-2xl border p-1">
          <button
            onClick={() => setViewMode("row")}
            className={`rounded-xl p-2 ${
              viewMode === "row" ? "bg-primary text-primary-foreground" : ""
            }`}
          >
            <List className="h-4 w-4" />
          </button>

          <button
            onClick={() => setViewMode("grid")}
            className={`rounded-xl p-2 ${
              viewMode === "grid" ? "bg-primary text-primary-foreground" : ""
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function MarketListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-[88px] animate-pulse rounded-3xl border bg-cyan-200"
        />
      ))}
    </div>
  )
}

function EmptyState({
  search,
  onClear,
  t,
}: {
  search: string
  onClear: () => void
  t: ReturnType<typeof useTranslations>
}) {
  return (
    <div className="border-border bg-card flex flex-col items-center gap-3 rounded-3xl border p-10 text-center">
      <div className="bg-secondary flex h-14 w-14 items-center justify-center rounded-2xl">
        <PackageSearch size={28} className="text-muted-foreground" />
      </div>
      <div>
        <p className="font-semibold">{t("emptyTitle")}</p>
        <p className="text-muted-foreground mt-1 text-sm">
          {search ? t("emptySearch", { search }) : t("emptyDefault")}
        </p>
      </div>
      <button
        onClick={onClear}
        className="text-primary mt-1 text-sm font-medium hover:underline"
      >
        {t("clearFilters")}
      </button>
    </div>
  )
}
