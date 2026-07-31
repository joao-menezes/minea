"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"

import BackButton from "@/components/BackButton"

export default function LanguagePage() {
  const languages = [
    { name: "Português (Brasil)", locale: "pt", available: true },
    { name: "English (United States)", locale: "en", available: true },
    { name: "Español", locale: "es", available: true },
    { name: "Français", locale: "fr", available: false },
    { name: "Deutsch", locale: "de", available: false },
    { name: "Italiano", locale: "it", available: false },
    { name: "日本語", locale: "ja", available: false },
    { name: "中文", locale: "zh", available: false },
  ]

  const [currentLanguage, setCurrentLanguage] = useState(
    "English (United States)",
  )

  useEffect(() => {
    const locale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("NEXT_LOCALE="))
      ?.split("=")[1]

    const selectedLanguage = languages.find(
      (language) => language.locale === locale,
    )

    if (selectedLanguage) {
      setCurrentLanguage(selectedLanguage.name)
    }
  }, [])

  function getLanguage(language: (typeof languages)[number]) {
    if (!language.available) return

    document.cookie = `NEXT_LOCALE=${language.locale}; path=/; max-age=31536000`

    setCurrentLanguage(language.name)

    window.location.reload()
  }

  return (
    <main className="bg-background min-h-screen pb-8">
      <BackButton variant="header" />

      <section className="px-4 pt-6">
        <div className="border-border bg-card overflow-hidden rounded-3xl border shadow-sm">
          {languages.map((language, index) => (
            <button
              key={language.name}
              disabled={!language.available}
              onClick={() => getLanguage(language)}
              className={`flex w-full items-center justify-between px-5 py-4 text-left transition ${
                language.available
                  ? "hover:bg-secondary/50"
                  : "cursor-not-allowed opacity-50"
              } ${
                index !== languages.length - 1 ? "border-border border-b" : ""
              }`}
            >
              <span>{language.name}</span>

              <div className="flex items-center gap-2">
                {!language.available && (
                  <span className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs">
                    Em breve
                  </span>
                )}

                {language.name === currentLanguage && (
                  <Check size={18} className="text-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}
