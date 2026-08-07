"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronDown,
  Info,
  MapPinned,
  Navigation,
  TrendingDown,
} from "lucide-react"

import InfoSheet from "@/components/InfoSheet"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { formatPrice } from "@/lib/utils"

type PriceCardProps = {
  product: string
  price: number
  marketId: string
  lowestPriceText: string
  variant?: "row" | "grid"
}

export default function PriceCard({
  product,
  price,
  marketId,
  lowestPriceText,
  variant = "row",
}: PriceCardProps) {
  const router = useRouter()

  const [showInfo, setShowInfo] = useState(false)

  const isGrid = variant === "grid"

  return (
    <>
      <article
        className={`group relative overflow-hidden border border-[#D8D1C1] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#102A43] hover:shadow-[0_5px_0_#102A43] active:translate-y-0 active:shadow-none ${
          isGrid
            ? "flex flex-col gap-5 p-5"
            : "flex items-center justify-between gap-4 p-4"
        } `}
      >
        <div className="absolute top-0 left-0 h-full w-1 bg-[#6B9080]" />

        <div
          className={
            isGrid ? "flex flex-col gap-4" : "flex min-w-0 items-center gap-4"
          }
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#DDECE5] text-[#467566]">
            <span className="text-lg font-black">$</span>
          </div>

          <div className="min-w-0">
            <span className="block text-[9px] font-black tracking-[0.18em] text-[#8291A1] uppercase">
              Product
            </span>

            <div className="mt-1 flex items-center gap-2">
              <h3 className="truncate text-sm font-black text-[#102A43]">
                {product}
              </h3>
            </div>

            <div className="mt-2 flex items-center gap-1.5">
              <TrendingDown size={12} className="shrink-0 text-[#E76F51]" />

              <p className="truncate text-xs font-bold text-[#E76F51]">
                {lowestPriceText}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`flex shrink-0 items-center ${
            isGrid ? "justify-between border-t border-[#E8E2D5] pt-4" : "gap-3"
          } `}
        >
          <div>
            <span className="block text-[9px] font-black tracking-[0.18em] text-[#8291A1] uppercase">
              Current price
            </span>

            <div className="mt-0.5 text-xl font-black tracking-tight text-[#102A43]">
              {formatPrice(price)}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              type="button"
              aria-label="Product actions"
              className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#D8D1C1] bg-[#F7F3E8] text-[#102A43] transition-all hover:border-[#102A43] hover:bg-white active:translate-y-0.5"
            >
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-72 border-[#D8D1C1] bg-white p-2 shadow-[0_6px_0_#102A43]"
            >
              <DropdownMenuItem
                className="min-h-12 gap-3 rounded-none px-3 text-[#102A43] focus:bg-[#F7F3E8]"
                onClick={() => router.push(`/map?focus=${marketId}`)}
              >
                <div className="flex h-9 w-9 items-center justify-center bg-[#DDECE5] text-[#467566]">
                  <MapPinned className="h-4 w-4" />
                </div>

                <div>
                  <span className="block text-xs font-black">View on map</span>

                  <span className="text-[10px] text-[#8291A1]">
                    Find the nearest market
                  </span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem className="min-h-12 gap-3 rounded-none px-3 text-[#102A43] focus:bg-[#F7F3E8]">
                <div className="flex h-9 w-9 items-center justify-center bg-[#FFF1D0] text-[#80651D]">
                  <Navigation className="h-4 w-4" />
                </div>

                <div>
                  <span className="block text-xs font-black">
                    Get directions
                  </span>

                  <span className="text-[10px] text-[#8291A1]">
                    Navigate to the market
                  </span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1 bg-[#E8E2D5]" />

              <DropdownMenuItem
                className="min-h-12 gap-3 rounded-none px-3 text-[#102A43] focus:bg-[#F7F3E8]"
                onClick={() => setShowInfo(true)}
              >
                <div className="flex h-9 w-9 items-center justify-center bg-[#E8E5F7] text-[#5E5982]">
                  <Info className="h-4 w-4" />
                </div>

                <div>
                  <span className="block text-xs font-black">
                    More information
                  </span>

                  <span className="text-[10px] text-[#8291A1]">
                    Product and price details
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </article>

      <InfoSheet
        open={showInfo}
        onClose={() => setShowInfo(false)}
        title={product}
      />
    </>
  )
}
