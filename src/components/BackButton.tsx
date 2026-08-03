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

  const button = (
    <button
      type="button"
      onClick={handleBack}
      aria-label={label ?? t("back")}
      className={cn(
        "transition-all duration-200",
        isHeader
          ? "text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
          : "border-border bg-card hover:bg-secondary flex h-11 w-11 items-center justify-center rounded-full border shadow-sm active:scale-95",
        className,
      )}
    >
      <ArrowLeft size={20} />

      {(label || isHeader) && (
        <span className="text-sm font-medium">{label ?? t("back")}</span>
      )}
    </button>
  )

  if (!isHeader) {
    return button
  }

  return (
    <header className="border-border bg-card sticky top-0 z-10 border-b px-4 pt-6 pb-4">
      {button}
    </header>
  )
}
