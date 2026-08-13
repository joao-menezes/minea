"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  Search,
  MapPin,
  Navigation,
  X,
  List,
  LayoutGrid,
  Compass,
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
    <main className="min-h-screen bg-[#F7F3E8] pb-24 text-[#102A43]">
      <TravelHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="mx-auto max-w-5xl px-4">
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

        <section className="pt-7">
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
                  ? "grid grid-cols-2 gap-4 md:grid-cols-3"
                  : "flex flex-col gap-4"
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
      </div>

      <BottomNav />
    </main>
  )
}

function TravelHeader({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <header className="relative overflow-hidden bg-[#102A43]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
        <div className="absolute top-8 -right-10 h-40 w-40 rounded-full border border-white" />
        <div className="absolute top-20 -right-20 h-64 w-64 rounded-full border border-white" />
        <div className="absolute -top-20 right-20 h-52 w-52 rounded-full border border-white" />
      </div>

      <div className="relative mx-auto max-w-5xl px-5 pt-7 pb-8">
        <div className="flex items-center gap-2 text-[#F4C95D]">
          <Compass className="h-5 w-5" />

          <span className="text-xs font-black tracking-[0.25em] uppercase">
            LocalV1
          </span>
        </div>

        <div className="mt-7 max-w-xl">
          <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
            {title}
          </h1>

          <p className="mt-2 max-w-md text-sm leading-6 text-[#C9D6E2]">
            {subtitle}
          </p>
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs font-bold tracking-wider text-[#8FB8B0] uppercase">
          <Navigation className="h-3.5 w-3.5" />
          Discover what is around you
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
    <div className="relative -mt-5 flex h-14 items-center border-2 border-[#102A43] bg-white shadow-[0_6px_0_#102A43]">
      <Search className="ml-4 h-5 w-5 shrink-0 text-[#E76F51]" />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm font-medium text-[#102A43] outline-none placeholder:text-[#8291A1]"
        placeholder={placeholder}
      />

      {value && (
        <button
          type="button"
          onClick={onClear}
          className="mr-2 flex h-9 w-9 items-center justify-center bg-[#F4C95D] text-[#102A43] transition-transform active:translate-y-0.5"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
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
    <div className="mt-5 flex items-center justify-between border-b border-[#D8D1C1] pb-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#DDECE5]">
          <MapPin className="h-4 w-4 text-[#467566]" />
        </div>

        <div>
          <p className="text-[10px] font-black tracking-widest text-[#8291A1] uppercase">
            Your location
          </p>

          <p className="text-xs font-bold text-[#102A43]">{label}</p>
        </div>
      </div>

      <Navigation className="h-4 w-4 text-[#8291A1]" />
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
    <div className="-mx-4 mt-5 overflow-x-auto">
      <div className="flex min-w-max gap-2 px-4">
        {CATEGORY_KEYS.map((key) => {
          const isActive = active === key

          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-[#102A43] text-white"
                  : "border border-[#D8D1C1] bg-white text-[#53687A] hover:border-[#102A43]"
              } `}
            >
              {tCategories(key)}
            </button>
          )
        })}
      </div>
    </div>
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
      ? t("resultsCategory", {
          category: tCategories(category),
        })
      : t("resultsNearby")

  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <p className="text-[10px] font-black tracking-[0.18em] text-[#8291A1] uppercase">
          Nearby
        </p>

        <p className="mt-1 text-base font-black text-[#102A43]">
          {label}

          {count > 0 && (
            <span className="ml-1 font-medium text-[#8291A1]">({count})</span>
          )}
        </p>
      </div>

      <div className="flex border border-[#C9C1AF] bg-white">
        <button
          type="button"
          onClick={() => setViewMode("row")}
          className={
            viewMode === "row"
              ? "bg-[#102A43] p-2.5 text-white"
              : "p-2.5 text-[#8291A1]"
          }
        >
          <List className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setViewMode("grid")}
          className={
            viewMode === "grid"
              ? "bg-[#102A43] p-2.5 text-white"
              : "p-2.5 text-[#8291A1]"
          }
        >
          <LayoutGrid className="h-4 w-4" />
        </button>
      </div>
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
    <div className="border border-[#D8D1C1] bg-white px-6 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F4C95D]">
        <MapPin className="h-6 w-6 text-[#102A43]" />
      </div>

      <h2 className="mt-5 text-base font-black text-[#102A43]">
        {t("emptyTitle")}
      </h2>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#8291A1]">
        {search ? t("emptySearch", { search }) : t("emptyDefault")}
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-5 bg-[#E76F51] px-5 py-3 text-sm font-black text-white transition-transform active:translate-y-0.5"
      >
        {t("clearFilters")}
      </button>

      {search && <></>}
    </div>
  )
}
