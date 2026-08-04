"use client"

import { X } from "lucide-react"

type InfoSheetProps = {
  open: boolean
  onClose: () => void
  title?: string
}

export default function InfoSheet({
  open,
  onClose,
  title = "Mais informações",
}: InfoSheetProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <button
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
        aria-label="Fechar"
      />

      <div className="bg-background animate-in slide-in-from-bottom absolute right-0 bottom-0 left-0 h-[75vh] rounded-t-3xl border-t p-5 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>

          <button onClick={onClose} className="bg-secondary rounded-full p-2">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="text-muted-foreground text-sm">
          <p>Aqui estarão mais informações sobre este item.</p>

          <p className="mt-3">
            Este espaço poderá mostrar detalhes, avaliações, histórico de
            preços, informações adicionais e outras ações.
          </p>
        </div>
      </div>
    </div>
  )
}
