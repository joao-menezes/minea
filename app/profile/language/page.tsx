"use client"

import { Check } from "lucide-react"

import BackButton from "@/components/BackButton"

export default function LanguagePage() {
  const languages = [
    "Português (Brasil)",
    "English (United States)",
    "Español",
    "Français",
    "Deutsch",
    "Italiano",
    "日本語",
    "中文",
  ]

  const currentLanguage = "Português (Brasil)"

  return (
    <main className="bg-background min-h-screen pb-8">
      <BackButton variant="header" />

      <section className="px-4 pt-6">
        <div className="border-border bg-card overflow-hidden rounded-3xl border shadow-sm">
          {languages.map((language, index) => (
            <button
              key={language}
              className={`hover:bg-secondary/50 flex w-full items-center justify-between px-5 py-4 text-left transition ${
                index !== languages.length - 1 ? "border-border border-b" : ""
              }`}
            >
              <span>{language}</span>

              {language === currentLanguage && (
                <Check size={18} className="text-primary" />
              )}
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}
