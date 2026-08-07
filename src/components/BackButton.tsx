"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

type BackButtonProps = {
  variant?: "button" | "header"
  label?: string
  fallbackHref?: string
  className?: string
}

export default function BackButton({
  variant = "button",
  label,
  fallbackHref = "/",
  className,
}: BackButtonProps) {
  const router = useRouter()

  const isHeader = variant === "header"

  const t = useTranslations("Header")

  function handleBack() {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackHref)
    }
  }

  /*
   * HEADER
   *
   * Usado em páginas internas onde o botão
   * faz parte da barra superior.
   */
  if (isHeader) {
    return (
      <button
        type="button"
        onClick={handleBack}
        aria-label={label ?? t("back")}
        className={cn(
          `group inline-flex items-center gap-2 py-2 text-[#8291A1] transition-colors duration-200 hover:text-[#102A43]`,
          className,
        )}
      >
        <span className="flex h-8 w-8 items-center justify-center border border-[#D8D1C1] bg-white transition-all duration-200 group-hover:border-[#102A43] group-hover:bg-[#102A43] group-hover:text-white">
          <ArrowLeft size={16} strokeWidth={2.5} />
        </span>

        {(label || isHeader) && (
          <span className="text-[10px] font-black tracking-[0.12em] uppercase">
            {label ?? t("back")}
          </span>
        )}
      </button>
    )
  }

  /*
   * BUTTON
   *
   * Usado como botão independente dentro
   * de páginas ou cards.
   */
  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label={label ?? t("back")}
      className={cn(
        `group flex h-10 w-10 items-center justify-center border border-[#D8D1C1] bg-white text-[#102A43] shadow-sm transition-all duration-200 hover:border-[#102A43] hover:bg-[#102A43] hover:text-white active:translate-y-0.5`,
        className,
      )}
    >
      <ArrowLeft
        size={18}
        strokeWidth={2.5}
        className="transition-transform duration-200 group-hover:-translate-x-0.5"
      />

      {label && <span className="ml-2 text-xs font-bold">{label}</span>}
    </button>
  )
}
