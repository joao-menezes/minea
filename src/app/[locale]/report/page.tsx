"use client"

import { useEffect, useState } from "react"
import {
  ArrowUpRight,
  Camera,
  CheckCircle2,
  FileText,
  MapPin,
  Receipt,
  ShoppingCart,
  Sparkles,
  Upload,
  Users,
} from "lucide-react"

import BackButton from "@/components/BackButton"
import BottomNav from "@/components/BottomNav"
import { useSearchParams } from "next/navigation"
import { getMarkets } from "@/lib/api"

type ReportMode = "manual" | "scan"

export default function ReportPrice() {
  const [mode, setMode] = useState<ReportMode>("manual")

  const [product, setProduct] = useState("")
  const [price, setPrice] = useState("")
  const [marketName, setMarketName] = useState("")

  const searchParams = useSearchParams()

  const marketId = searchParams.get("marketId")

  useEffect(() => {
    async function loadMarket() {
      if (!marketId) return

      const markets = await getMarkets()

      const found = markets.find((market) => market.id === marketId)

      if (found) {
        setMarketName(found.name)
      }
    }

    loadMarket()
  }, [marketId])

  function submitManual() {
    console.log({
      product,
      price,
      marketId,
    })
  }

  function uploadInvoice(file?: File) {
    if (!file) return

    console.log("Enviar nota fiscal:", file)
  }

  return (
    <main className="min-h-screen bg-[#F7F3E8] pb-24">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#D8D1C1] bg-[#F7F3E8]/95 px-4 py-3 backdrop-blur">
        <BackButton />

        <div>
          <span className="block text-[8px] font-black tracking-[0.2em] text-[#8291A1] uppercase">
            LocalV1
          </span>

          <span className="text-sm font-black text-[#102A43]">Contribute</span>
        </div>
      </header>
      <section className="px-4 pt-5">
        <div className="relative overflow-hidden border border-[#D8D1C1] bg-[#102A43] p-5 text-white">
          <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full border-[12px] border-white/5" />

          <div className="relative flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#F4C95D] text-[#102A43]">
              <Users size={21} />
            </div>

            <div>
              <span className="text-[9px] font-black tracking-[0.2em] text-[#9FB3C3] uppercase">
                Help other travelers
              </span>

              <h1 className="mt-1 text-xl font-black tracking-tight">
                Share a price.
              </h1>

              <p className="mt-2 text-xs leading-5 text-[#B7C5D0]">
                Your report helps travelers find better prices wherever they go.
              </p>
            </div>
          </div>
          <div className="relative mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-[9px] font-bold tracking-wider text-[#9FB3C3] uppercase">
            <span className="text-[#F4C95D]">You</span>

            <ArrowUpRight size={11} />

            <span>LocalV1</span>

            <ArrowUpRight size={11} />

            <span>Next traveler</span>
          </div>
        </div>
      </section>

      <section className="mt-6 px-4">
        <div className="border border-[#D8D1C1] bg-white p-1">
          <div className="grid grid-cols-2">
            <button
              type="button"
              onClick={() => setMode("manual")}
              className={`flex items-center justify-center gap-2 py-3 text-xs font-black tracking-wider uppercase transition-all ${
                mode === "manual" ? "bg-[#102A43] text-white" : "text-[#8291A1]"
              } `}
            >
              <FileText size={14} />
              Manual
            </button>

            <button
              type="button"
              onClick={() => setMode("scan")}
              className={`flex items-center justify-center gap-2 py-3 text-xs font-black tracking-wider uppercase transition-all ${
                mode === "scan" ? "bg-[#102A43] text-white" : "text-[#8291A1]"
              } `}
            >
              <Receipt size={14} />
              Scan receipt
            </button>
          </div>
        </div>
      </section>
      {mode === "manual" ? (
        <section className="mt-5 px-4">
          <div className="border border-[#D8D1C1] bg-white p-5">
            <div>
              <label className="text-[9px] font-black tracking-[0.15em] text-[#8291A1] uppercase">
                Product
              </label>

              <input
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Ex: Rice 5kg"
                className="mt-2 w-full border border-[#D8D1C1] bg-[#F7F3E8] px-4 py-3 text-sm font-medium text-[#102A43] transition outline-none placeholder:text-[#A5A9AC] focus:border-[#6B9080]"
              />
            </div>

            <div className="mt-5">
              <label className="text-[9px] font-black tracking-[0.15em] text-[#8291A1] uppercase">
                Price
              </label>

              <div className="relative mt-2">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm font-black text-[#8291A1]">
                  R$
                </span>

                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="25,90"
                  inputMode="decimal"
                  className="w-full border border-[#D8D1C1] bg-[#F7F3E8] py-3 pr-4 pl-12 text-lg font-black text-[#102A43] transition outline-none placeholder:text-[#B7B7B0] focus:border-[#6B9080]"
                />
              </div>
            </div>
            <div className="mt-5">
              <label className="text-[9px] font-black tracking-[0.15em] text-[#8291A1] uppercase">
                Market
              </label>

              <div className="mt-2 flex items-center gap-3 border border-[#D8D1C1] bg-[#F7F3E8] px-4 py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#DDECE5] text-[#467566]">
                  <MapPin size={15} />
                </div>

                <div className="min-w-0">
                  <span className="block text-[8px] font-black tracking-wider text-[#8291A1] uppercase">
                    Selected market
                  </span>

                  <span className="block truncate text-xs font-black text-[#102A43]">
                    {marketName || "Loading market..."}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={submitManual}
              className="mt-6 flex w-full items-center justify-center gap-2 bg-[#E76F51] py-3.5 text-xs font-black tracking-wider text-white uppercase transition-all hover:bg-[#D85F47] active:translate-y-0.5"
            >
              <CheckCircle2 size={16} />
              Submit price
            </button>

            <p className="mt-3 text-center text-[9px] leading-4 text-[#9AA5AE]">
              Make sure the price matches the shelf or receipt.
            </p>
          </div>
        </section>
      ) : (
        /* ===================================================
           RECEIPT SCAN
        =================================================== */

        <section className="mt-5 px-4">
          <div className="border border-[#D8D1C1] bg-white p-5">
            <label className="relative flex min-h-[260px] cursor-pointer flex-col items-center justify-center overflow-hidden border border-dashed border-[#B8B0A0] bg-[#F7F3E8] p-6 text-center transition-all hover:border-[#6B9080]">
              <div className="absolute top-4 left-4 h-6 w-6 border-t-2 border-l-2 border-[#6B9080]" />
              <div className="absolute top-4 right-4 h-6 w-6 border-t-2 border-r-2 border-[#6B9080]" />
              <div className="absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-[#6B9080]" />
              <div className="absolute right-4 bottom-4 h-6 w-6 border-r-2 border-b-2 border-[#6B9080]" />

              <div className="flex h-16 w-16 items-center justify-center bg-[#DDECE5] text-[#467566]">
                <Camera size={28} />
              </div>

              <h2 className="mt-5 text-sm font-black text-[#102A43]">
                Scan your receipt
              </h2>

              <p className="mt-2 max-w-xs text-xs leading-5 text-[#8291A1]">
                Take a clear photo of the entire receipt. LocalV1 will identify
                products and prices automatically.
              </p>

              <span className="mt-5 flex items-center gap-2 bg-[#102A43] px-5 py-3 text-xs font-black tracking-wider text-white uppercase">
                <Upload size={14} />
                Choose photo
              </span>

              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => uploadInvoice(e.target.files?.[0])}
              />
            </label>

            <div className="mt-4 flex gap-3 border border-[#D8D1C1] bg-[#FFF8E5] p-4">
              <Sparkles size={17} className="mt-0.5 shrink-0 text-[#B28A20]" />

              <div>
                <p className="text-xs font-black text-[#102A43]">
                  Automatic extraction
                </p>

                <p className="mt-1 text-[10px] leading-4 text-[#8291A1]">
                  Products, prices and market information can be extracted from
                  your receipt.
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-3 bg-[#F7F3E8] p-4">
              <Camera size={16} className="mt-0.5 shrink-0 text-[#6B9080]" />

              <p className="text-[10px] leading-4 text-[#8291A1]">
                Tip: keep the receipt flat and make sure all text is visible in
                the photo.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="mt-6 px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#DDECE5] text-[#467566]">
            <ShoppingCart size={14} />
          </div>

          <p className="text-[10px] leading-4 text-[#8291A1]">
            Every report helps make LocalV1 more accurate for travelers around
            you.
          </p>
        </div>
      </section>

      <BottomNav />
    </main>
  )
}
