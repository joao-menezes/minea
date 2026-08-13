"use client"

import "flag-icons/css/flag-icons.min.css"

import {
  ChevronRight,
  Eye,
  Flag,
  Globe,
  Lock,
  MapPin,
  Shield,
  Trash2,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import BottomNav from "@/components/BottomNav"
import BackButton from "@/components/BackButton"

// ─── Types ────────────────────────────────────────────────────────────────────

type Country = {
  code: string
  name: string
  flag: string
  reports: number
  visible: boolean
}

type ToggleItem = {
  title: string
  description: string
  key: string
}

// ─── Mock data (viria do banco) ───────────────────────────────────────────────

const MOCK_COUNTRIES: Country[] = [
  { code: "BR", name: "Brasil", flag: "🇧🇷", reports: 34, visible: true },
  { code: "IE", name: "Irlanda", flag: "🇮🇪", reports: 21, visible: true },
  { code: "PT", name: "Portugal", flag: "🇵🇹", reports: 12, visible: true },
  { code: "DE", name: "Alemanha", flag: "🇩🇪", reports: 8, visible: false },
  { code: "JP", name: "Japão", flag: "🇯🇵", reports: 5, visible: true },
]

const VISIBILITY_TOGGLES: ToggleItem[] = [
  {
    key: "showProfile",
    title: "Perfil público",
    description: "Outros usuários podem ver seu perfil",
  },
  {
    key: "showCountries",
    title: "Países visitados",
    description: "Exibir flags no seu perfil público",
  },
  {
    key: "showReports",
    title: "Seus relatos",
    description: "Mostrar quantos preços você reportou",
  },
  {
    key: "showLocation",
    title: "Localização aproximada",
    description: "Cidade atual visível no perfil",
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PrivacyPage() {
  const router = useRouter()

  const [countries, setCountries] = useState<Country[]>(MOCK_COUNTRIES)

  const [toggles, setToggles] = useState<Record<string, boolean>>({
    showProfile: true,
    showCountries: true,
    showReports: true,
    showLocation: false,
  })

  useEffect(() => {
    // Preferências gerais
    const savedPrivacy = localStorage.getItem("pricepal-privacy")

    if (savedPrivacy) {
      try {
        setToggles(JSON.parse(savedPrivacy))
      } catch {
        console.error("Erro ao carregar preferências de privacidade")
      }
    }

    // Visibilidade dos países
    const savedCountries = localStorage.getItem("pricepal-countries-visibility")

    if (savedCountries) {
      try {
        const visibility = JSON.parse(savedCountries)

        setCountries((prev) =>
          prev.map((country) => ({
            ...country,
            visible: visibility[country.code] ?? country.visible,
          })),
        )
      } catch {
        console.error("Erro ao carregar visibilidade dos países")
      }
    }
  }, [])

  function handleToggle(key: string) {
    setToggles((prev) => {
      const next = {
        ...prev,
        [key]: !prev[key],
      }

      localStorage.setItem("pricepal-privacy", JSON.stringify(next))

      return next
    })
  }

  function handleCountryToggle(code: string) {
    setCountries((prev) => {
      const next = prev.map((country) =>
        country.code === code
          ? {
              ...country,
              visible: !country.visible,
            }
          : country,
      )

      const visibility = Object.fromEntries(
        next.map((country) => [country.code, country.visible]),
      )

      localStorage.setItem(
        "pricepal-countries-visibility",
        JSON.stringify(visibility),
      )

      return next
    })
  }

  return (
    <main className="min-h-screen bg-[#F7F3E8] pb-24">
      {/* Header */}
      <header className="border-b border-[#D8D1C1] bg-[#F7F3E8] px-4 py-4">
        <div className="flex items-center gap-3">
          <BackButton />
          <div>
            <span className="block text-[8px] font-black tracking-[0.25em] text-[#8291A1] uppercase">
              LocalV1
            </span>
            <h1 className="mt-0.5 text-lg font-black tracking-tight text-[#102A43]">
              Privacidade
            </h1>
          </div>
        </div>
        <p className="mt-3 pl-13 text-[10px] leading-4 text-[#8291A1]">
          Controle o que outros viajantes podem ver sobre você.
        </p>
      </header>

      <section className="space-y-6 px-4 pt-6">
        {/* Visibilidade do perfil */}
        <ConfigSection title="Visibilidade" icon={<Eye size={11} />}>
          {VISIBILITY_TOGGLES.map((item, index) => (
            <div key={item.key}>
              <div className="flex items-center gap-4 px-4 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-[#102A43]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[10px] leading-4 text-[#8291A1]">
                    {item.description}
                  </p>
                </div>
                <Toggle
                  active={toggles[item.key]}
                  onToggle={() => handleToggle(item.key)}
                />
              </div>
              {index < VISIBILITY_TOGGLES.length - 1 && <Divider />}
            </div>
          ))}
        </ConfigSection>

        {/* Países — só aparece se showCountries estiver ativo */}
        {toggles.showCountries && (
          <ConfigSection title="Países no perfil" icon={<Flag size={11} />}>
            <div className="px-4 py-3">
              <p className="text-[9px] leading-4 text-[#8291A1]">
                Escolha quais países aparecem publicamente no seu perfil.
              </p>
            </div>

            {countries.map((country, index) => (
              <div key={country.code}>
                <div className="flex items-center gap-4 px-4 py-3">
                  <span
                    className={`fi fi-${country.code.toLowerCase()}`}
                    style={{ width: 22, height: 15, flexShrink: 0 }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-[#102A43]">
                      {country.name}
                    </p>
                    <p className="text-[9px] text-[#8291A1]">
                      {country.reports} relatos
                    </p>
                  </div>
                  <Toggle
                    active={country.visible}
                    onToggle={() => handleCountryToggle(country.code)}
                  />
                </div>
                {index < countries.length - 1 && <Divider />}
              </div>
            ))}
          </ConfigSection>
        )}

        {/* Dados e segurança */}
        <ConfigSection title="Dados e segurança" icon={<Shield size={11} />}>
          <ConfigItem
            icon={<Lock size={18} />}
            title="Alterar senha"
            description="Atualize suas credenciais de acesso"
          />
          <Divider />
          <ConfigItem
            icon={<Globe size={18} />}
            title="Sessões ativas"
            description="Dispositivos conectados à sua conta"
          />
          <Divider />
          <ConfigItem
            icon={<MapPin size={18} />}
            title="Histórico de localização"
            description="Gerencie seus dados de localização"
          />
        </ConfigSection>

        {/* Zona de perigo */}
        <ConfigSection title="Zona de risco" icon={<Trash2 size={11} />} danger>
          <button className="group flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-[#FFF7F5]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#FFF7F5] text-[#B85C5C] transition-colors group-hover:bg-[#FDEAE5]">
              <Trash2 size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-[#B85C5C]">Excluir conta</p>
              <p className="mt-1 text-[10px] leading-4 text-[#8291A1]">
                Remove permanentemente seus dados e relatos
              </p>
            </div>
            <ChevronRight
              size={16}
              className="shrink-0 text-[#B85C5C] opacity-50 transition-transform group-hover:translate-x-1"
            />
          </button>
        </ConfigSection>

        {/* Rodapé */}
        <div className="pb-4 text-center">
          <p className="text-[8px] font-black tracking-[0.2em] text-[#C0B9AB] uppercase">
            Seus dados · Suas regras
          </p>
        </div>
      </section>

      <BottomNav />
    </main>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ConfigSection({
  title,
  icon,
  danger = false,
  children,
}: {
  title: string
  icon?: React.ReactNode
  danger?: boolean
  children: React.ReactNode
}) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={danger ? "text-[#B85C5C]" : "text-[#8291A1]"}>
            {icon}
          </span>
          <h2
            className={`text-[9px] font-black tracking-[0.18em] uppercase ${
              danger ? "text-[#B85C5C]" : "text-[#8291A1]"
            }`}
          >
            {title}
          </h2>
        </div>
        <span
          className={`h-px w-12 ${danger ? "bg-[#E5B5AA]" : "bg-[#D8D1C1]"}`}
        />
      </div>
      <div
        className={`overflow-hidden border bg-white ${
          danger ? "border-[#E5B5AA]" : "border-[#D8D1C1]"
        }`}
      >
        {children}
      </div>
    </section>
  )
}

function ConfigItem({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  description: string
  onClick?: () => void
}) {
  const Component = onClick ? "button" : "div"

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`group flex w-full items-center gap-4 px-4 py-4 text-left transition-colors ${
        onClick ? "hover:bg-[#F7F3E8] active:bg-[#EEE9DE]" : ""
      }`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#F7F3E8] text-[#102A43] transition-colors group-hover:bg-[#DDECE5] group-hover:text-[#467566]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-black text-[#102A43]">{title}</p>
        <p className="mt-1 text-[10px] leading-4 text-[#8291A1]">
          {description}
        </p>
      </div>
      {onClick && (
        <ChevronRight
          size={16}
          className="shrink-0 text-[#A5AFB7] transition-transform group-hover:translate-x-1 group-hover:text-[#102A43]"
        />
      )}
    </Component>
  )
}

function Toggle({
  active,
  onToggle,
}: {
  active: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={`flex h-6 w-11 shrink-0 items-center rounded-full border transition-all duration-200 ${
        active
          ? "border-[#467566] bg-[#467566]"
          : "border-[#D8D1C1] bg-[#F7F3E8]"
      }`}
    >
      <span
        className={`ml-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-200 ${
          active ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  )
}

function Divider() {
  return <div className="ml-[72px] h-px bg-[#E8E3D8]" />
}
