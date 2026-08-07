import { Compass } from "lucide-react"

export function LoadSpinner() {
  return (
    <div className="inset-0 flex flex-col items-center justify-center gap-4">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-dashed border-[#6B9080] duration-[3s]" />
        <Compass className="h-7 w-7 animate-pulse" strokeWidth={2.5} />
      </div>

      <span className="text-[10px] font-black tracking-[0.2em] text-[#8291A1] uppercase">
        Procurando mercados
      </span>
    </div>
  )
}
