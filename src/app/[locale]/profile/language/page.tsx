"use client"

import { useEffect, useMemo, useState } from "react"
import { Check, Globe2, Languages, Search, X } from "lucide-react"

import BackButton from "@/components/BackButton"
import { searchAndRank } from "@/components/search"

const LANGUAGES = [
  {
    name: "Português",
    region: "Brasil",
    locale: "pt",
    aliases: ["portugues", "portuguese", "brasil", "brazil", "pt-br"],
    available: true,
  },
  {
    name: "English",
    region: "United States",
    locale: "en",
    aliases: ["ingles", "english", "americano", "america", "usa", "us"],
    available: true,
  },
  {
    name: "Español",
    region: "España",
    locale: "es",
    aliases: ["espanol", "espanhol", "spanish", "espanha", "spain"],
    available: true,
  },
  {
    name: "Français",
    region: "",
    locale: "fr",
    aliases: ["frances", "francais", "french", "franca", "france"],
    available: false,
  },
  {
    name: "Deutsch",
    region: "",
    locale: "de",
    aliases: ["alemao", "alemão", "german", "deutsch", "germany"],
    available: false,
  },
  {
    name: "Italiano",
    region: "",
    locale: "it",
    aliases: ["italiano", "italian", "italia", "italy"],
    available: false,
  },
  {
    name: "日本語",
    region: "",
    locale: "ja",
    aliases: ["japones", "japonês", "japanese", "japao", "japan"],
    available: false,
  },
  {
    name: "中文",
    region: "",
    locale: "zh",
    aliases: ["chines", "chinês", "chinese", "china"],
    available: false,
  },
] as const

export default function LanguagePage() {
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [search, setSearch] = useState("")
  const [pendingLanguage, setPendingLanguage] = useState<string | null>(null)

  useEffect(() => {
    const locale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("NEXT_LOCALE="))
      ?.split("=")[1]

    if (locale) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentLanguage(locale)
    }
  }, [])

  useEffect(() => {
    if (!pendingLanguage) return

    document.cookie = [
      `NEXT_LOCALE=${pendingLanguage}`,
      "path=/",
      "max-age=31536000",
    ].join("; ")

    window.location.reload()
  }, [pendingLanguage])

  function selectLanguage(language: (typeof LANGUAGES)[number]) {
    if (!language.available) return

    setPendingLanguage(language.locale)
  }

  const selectedLanguage = LANGUAGES.find(
    (language) => language.locale === currentLanguage,
  )

  const filteredLanguages = useMemo(() => {
    return searchAndRank(LANGUAGES, search, {
      fields: ["name", "region", "locale"],
      aliases: (language) => language.aliases,
    })
  }, [search])

  return (
    <main className="min-h-screen bg-[#F7F3E8]">
      <header className="flex items-center gap-3 px-4 pt-5">
        <BackButton />

        <div>
          <span className="block text-[8px] font-black tracking-[0.25em] text-[#8291A1] uppercase">
            LocalV1
          </span>

          <h1 className="mt-0.5 text-lg font-black tracking-tight text-[#102A43]">
            Idioma
          </h1>
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
            {filteredLanguages.length} idiomas
          </span>
        </div>

        <div className="relative mb-3">
          <Search
            size={15}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#8291A1]"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar idioma ou país..."
            aria-label="Buscar idioma"
            className="h-11 w-full border border-[#D8D1C1] bg-white pr-10 pl-10 text-xs font-medium text-[#102A43] transition-colors outline-none placeholder:text-[#A5A9AC] focus:border-[#467566]"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Limpar busca"
              className="absolute top-1/2 right-3 flex h-6 w-6 -translate-y-1/2 items-center justify-center text-[#8291A1] transition-colors hover:text-[#102A43]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {search && (
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="text-[8px] font-bold tracking-wider text-[#8291A1] uppercase">
              Resultados
            </span>

            <span className="text-[8px] font-black text-[#467566]">
              {filteredLanguages.length}
            </span>
          </div>
        )}

        <div className="overflow-hidden border border-[#D8D1C1] bg-white">
          {filteredLanguages.length > 0 ? (
            filteredLanguages.map((language, index) => {
              const active = language.locale === currentLanguage
              const isLast = index === filteredLanguages.length - 1

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
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center transition-colors ${
                      active
                        ? "bg-[#467566] text-white"
                        : language.available
                          ? "bg-[#F7F3E8] text-[#102A43]"
                          : "bg-[#F3F1EB] text-[#B6B5AE]"
                    }`}
                  >
                    <Globe2 size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-black ${
                        language.available ? "text-[#102A43]" : "text-[#9FA3A5]"
                      }`}
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
            })
          ) : (
            <div className="px-4 py-10 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center bg-[#F3F1EB] text-[#8291A1]">
                <Search size={17} />
              </div>

              <p className="mt-3 text-xs font-black text-[#102A43]">
                Nenhum idioma encontrado
              </p>

              <p className="mt-1 text-[10px] text-[#8291A9]">
                Tente buscar por outro nome ou código.
              </p>

              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-4 bg-[#102A43] px-4 py-2 text-[9px] font-black tracking-wider text-white uppercase"
              >
                Limpar busca
              </button>
            </div>
          )}
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
