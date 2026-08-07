"use client"

import { useEffect, useState } from "react"
import { Check, Globe2, Languages } from "lucide-react"

import BackButton from "@/components/BackButton"

const LANGUAGES = [
  {
    name: "Português",
    region: "Brasil",
    locale: "pt",
    available: true,
  },
  {
    name: "English",
    region: "United States",
    locale: "en",
    available: true,
  },
  {
    name: "Español",
    region: "",
    locale: "es",
    available: true,
  },
  {
    name: "Français",
    region: "",
    locale: "fr",
    available: false,
  },
  {
    name: "Deutsch",
    region: "",
    locale: "de",
    available: false,
  },
  {
    name: "Italiano",
    region: "",
    locale: "it",
    available: false,
  },
  {
    name: "日本語",
    region: "",
    locale: "ja",
    available: false,
  },
  {
    name: "中文",
    region: "",
    locale: "zh",
    available: false,
  },
] as const

export default function LanguagePage() {
  const [currentLanguage, setCurrentLanguage] = useState("en")

  useEffect(() => {
    const locale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("NEXT_LOCALE="))
      ?.split("=")[1]

    if (locale) {
      setCurrentLanguage(locale)
    }
  }, [])

  function selectLanguage(language: (typeof LANGUAGES)[number]) {
    if (!language.available) return

    document.cookie = [
      `NEXT_LOCALE=${language.locale}`,
      "path=/",
      "max-age=31536000",
    ].join("; ")

    setCurrentLanguage(language.locale)

    window.location.reload()
  }

  const selectedLanguage = LANGUAGES.find(
    (language) => language.locale === currentLanguage,
  )

  return (
    <main className="min-h-screen bg-[#F7F3E8] pb-8">
      <header className="border-b border-[#D8D1C1] bg-[#F7F3E8] px-4 py-4">
        <div className="flex items-center gap-3">
          <BackButton />

          <div>
            <span className="block text-[8px] font-black tracking-[0.25em] text-[#8291A1] uppercase">
              LocalV1
            </span>

            <h1 className="mt-0.5 text-lg font-black tracking-tight text-[#102A43]">
              Idioma
            </h1>
          </div>
        </div>
      </header>

      <section className="px-4 pt-6">
        <div className="border border-[#D8D1C1] bg-[#102A43] p-5 text-white">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-white/10">
              <Globe2 size={21} />
            </div>

            <div>
              <span className="text-[8px] font-black tracking-[0.2em] text-[#B8C7D2] uppercase">
                Language
              </span>

              <h2 className="mt-1 text-base font-black">Escolha seu idioma</h2>

              <p className="mt-1 text-[10px] leading-4 text-[#C5D0D8]">
                O idioma escolhido será usado em toda a sua experiência.
              </p>
            </div>
          </div>
        </div>
      </section>

      {selectedLanguage && (
        <section className="px-4 pt-6">
          <p className="mb-2 text-[9px] font-black tracking-[0.18em] text-[#8291A1] uppercase">
            Idioma atual
          </p>

          <div className="flex items-center gap-4 border border-[#BFD6CA] bg-[#E5F0EA] px-4 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#467566] text-white">
              <Languages size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-[#102A43]">
                {selectedLanguage.name}
              </p>

              {selectedLanguage.region && (
                <p className="mt-0.5 text-[10px] text-[#668073]">
                  {selectedLanguage.region}
                </p>
              )}
            </div>

            <Check size={19} className="shrink-0 text-[#467566]" />
          </div>
        </section>
      )}

      <section className="px-4 pt-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[9px] font-black tracking-[0.18em] text-[#8291A1] uppercase">
            Idiomas disponíveis
          </p>

          <span className="text-[8px] font-bold tracking-wider text-[#A5A9AC] uppercase">
            {LANGUAGES.filter((language) => language.available).length} ativos
          </span>
        </div>

        <div className="overflow-hidden border border-[#D8D1C1] bg-white">
          {LANGUAGES.map((language, index) => {
            const active = language.locale === currentLanguage

            const isLast = index === LANGUAGES.length - 1

            return (
              <button
                key={language.locale}
                type="button"
                disabled={!language.available}
                onClick={() => selectLanguage(language)}
                className={`group flex w-full items-center gap-4 px-4 py-4 text-left transition-colors duration-200 ${
                  !isLast ? "border-b border-[#E8E3D8]" : ""
                } ${
                  language.available
                    ? "hover:bg-[#F7F3E8] active:bg-[#EEE9DE]"
                    : "cursor-not-allowed"
                } `}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center transition-colors ${
                    active
                      ? "bg-[#467566] text-white"
                      : language.available
                        ? "bg-[#F7F3E8] text-[#102A43]"
                        : "bg-[#F3F1EB] text-[#B6B5AE]"
                  } `}
                >
                  <Globe2 size={17} />
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-xs font-black ${
                      language.available ? "text-[#102A43]" : "text-[#9FA3A5]"
                    } `}
                  >
                    {language.name}
                  </p>

                  {language.region && (
                    <p className="mt-0.5 text-[9px] text-[#8291A1]">
                      {language.region}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center">
                  {!language.available && (
                    <span className="border border-[#E1DDD3] bg-[#F7F3E8] px-2 py-1 text-[7px] font-black tracking-wider text-[#9A9992] uppercase">
                      Em breve
                    </span>
                  )}

                  {active && (
                    <div className="flex h-7 w-7 items-center justify-center bg-[#E5F0EA] text-[#467566]">
                      <Check size={16} />
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section className="px-4 pt-8 pb-4">
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-[#D8D1C1]" />

          <span className="text-[8px] font-black tracking-[0.2em] text-[#C0B9AB] uppercase">
            Travel without borders
          </span>

          <span className="h-px flex-1 bg-[#D8D1C1]" />
        </div>
      </section>
    </main>
  )
}
