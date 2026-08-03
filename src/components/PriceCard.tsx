"use client"

import { useRouter } from "next/navigation"
import { ChevronDown, Info, MapPinned, Navigation } from "lucide-react"

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

  return (
    <article
      className={
        variant === "grid"
          ? "bg-card flex flex-col gap-4 rounded-3xl border p-5 shadow-sm"
          : "bg-card flex items-center justify-between gap-4 rounded-3xl border p-4 shadow-sm"
      }
    >
      <div className="min-w-0 flex-1">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex max-w-full items-center gap-2 rounded-xl py-1 text-left outline-none">
            <span className="truncate text-base font-semibold">{product}</span>

            <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            sideOffset={8}
            className="bg-card w-72 rounded-3xl border p-2 shadow-xl"
          >
            <DropdownMenuItem
              className="min-h-12 gap-3 rounded-2xl px-4"
              onClick={() => router.push(`/map?focus=${marketId}`)}
            >
              <div className="bg-primary/10 rounded-xl p-2">
                <MapPinned className="text-primary h-4 w-4" />
              </div>

              <span>Ver mercado no mapa</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="min-h-12 gap-3 rounded-2xl px-4">
              <div className="bg-primary/10 rounded-xl p-2">
                <Navigation className="text-primary h-4 w-4" />
              </div>

              <span>Como chegar</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              disabled
              className="min-h-12 gap-3 rounded-2xl px-4"
            >
              <Info className="h-4 w-4" />
              <span>Mais informações</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <p className="text-muted-foreground mt-1 text-xs">{lowestPriceText}</p>
      </div>

      <div
        className={
          variant === "grid"
            ? "bg-primary text-primary-foreground rounded-2xl px-4 py-3 text-center text-lg font-bold"
            : "bg-primary text-primary-foreground shrink-0 rounded-2xl px-4 py-2 text-base font-bold"
        }
      >
        {formatPrice(price)}
      </div>
    </article>
  )
}
