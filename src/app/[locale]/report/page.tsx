"use client"

import { useEffect, useState } from "react"
import { Camera, FileText, MapPin, ShoppingCart, Upload } from "lucide-react"

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
    <main className="bg-background min-h-screen pb-24">
      <BackButton variant="header" />

      <section className="px-4 pt-4">
        <div className="bg-card rounded-3xl border p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-2xl">
              <ShoppingCart className="h-8 w-8" />
            </div>

            <div>
              <h1 className="text-xl font-bold">Reportar preço</h1>

              <p className="text-muted-foreground mt-1 text-sm">
                Ajude outras pessoas compartilhando preços atuais.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 px-4">
        <div className="bg-card flex rounded-2xl border p-1">
          <button
            onClick={() => setMode("manual")}
            className={`flex-1 rounded-xl py-3 text-sm font-medium transition ${
              mode === "manual" ? "bg-primary text-primary-foreground" : ""
            }`}
          >
            Manual
          </button>

          <button
            onClick={() => setMode("scan")}
            className={`flex-1 rounded-xl py-3 text-sm font-medium transition ${
              mode === "scan" ? "bg-primary text-primary-foreground" : ""
            }`}
          >
            Nota fiscal
          </button>
        </div>
      </section>

      {mode === "manual" ? (
        <section className="mt-6 px-4">
          <div className="bg-card space-y-4 rounded-3xl border p-5 shadow-sm">
            <div>
              <label className="text-muted-foreground text-xs font-medium uppercase">
                Produto
              </label>

              <input
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Ex: Arroz 5kg"
                className="bg-background mt-2 w-full rounded-2xl border px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="text-muted-foreground text-xs font-medium uppercase">
                Preço
              </label>

              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="R$ 25,90"
                inputMode="decimal"
                className="bg-background mt-2 w-full rounded-2xl border px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="text-muted-foreground text-xs font-medium uppercase">
                Mercado
              </label>

              <div className="bg-secondary mt-2 flex items-center gap-2 rounded-2xl px-4 py-3">
                <MapPin className="h-5 w-5" />

                <span className="font-medium">
                  {marketName || "Carregando mercado..."}
                </span>
              </div>
            </div>

            <button
              onClick={submitManual}
              className="bg-primary text-primary-foreground w-full rounded-2xl py-3 font-medium"
            >
              Enviar preço
            </button>
          </div>
        </section>
      ) : (
        <section className="mt-6 px-4">
          <div className="bg-card rounded-3xl border p-5 shadow-sm">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center">
              <div className="bg-primary/10 text-primary mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
                <FileText className="h-8 w-8" />
              </div>

              <h2 className="font-semibold">Envie sua nota fiscal</h2>

              <p className="text-muted-foreground mt-1 text-sm">
                Vamos identificar produtos, preços e mercado automaticamente.
              </p>

              <label className="bg-primary text-primary-foreground mt-5 flex cursor-pointer items-center gap-2 rounded-xl px-5 py-3 font-medium">
                <Upload className="h-5 w-5" />
                Escanear nota
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => uploadInvoice(e.target.files?.[0])}
                />
              </label>
            </div>

            <div className="bg-secondary mt-5 rounded-2xl p-4">
              <div className="flex gap-3">
                <Camera className="h-5 w-5" />

                <p className="text-sm">
                  Tire uma foto da nota fiscal inteira. O sistema irá extrair os
                  produtos e valores.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <BottomNav />
    </main>
  )
}
