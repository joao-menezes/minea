"use client"

import {
  Bell,
  ChevronRight,
  Globe,
  Info,
  MapPin,
  Moon,
  Shield,
  User,
} from "lucide-react"

import type { ReactNode } from "react"

import BottomNav from "@/components/BottomNav"
import BackButton from "@/components/BackButton"

import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"

export default function Config() {
  const router = useRouter()
  const locale = useLocale()

  const year = new Date().getFullYear()

  const LOCALE_LABELS: Record<string, string> = {
    pt: "Português (Brasil)",
    en: "English",
    es: "Español",
    it: "Italiano",
    ja: "日本語",
    zh: "中文",
    fr: "Français",
    de: "Deutsch",
  }

  return (
    <main className="min-h-screen bg-[#F7F3E8] pb-24">
      <header className="border-b border-[#D8D1C1] bg-[#F7F3E8] px-4 py-4">
        <div className="flex items-center gap-3">
          <BackButton />

          <div>
            <span className="block text-[8px] font-black tracking-[0.25em] text-[#8291A1] uppercase">
              LocalV1
            </span>

            <h1 className="mt-0.5 text-lg font-black tracking-tight text-[#102A43]">
              Configurações
            </h1>
          </div>
        </div>

        <p className="mt-4 pl-13 text-[10px] leading-4 text-[#8291A1]">
          Personalize sua experiência de viagem.
        </p>
      </header>
      <section className="space-y-6 px-4 pt-6">
        <ConfigSection title="Conta">
          <ConfigItem
            icon={<User size={18} />}
            title="Perfil"
            subtitle="Nome, foto e informações"
          />

          <Divider />

          <ConfigItem
            icon={<Shield size={18} />}
            title="Privacidade"
            subtitle="Permissões e segurança"
          />
        </ConfigSection>

        <ConfigSection title="Experiência">
          <ConfigItem
            icon={<MapPin size={18} />}
            title="Localização"
            subtitle="Usar localização atual"
          />

          <Divider />

          <ConfigItem
            icon={<Bell size={18} />}
            title="Notificações"
            subtitle="Alertas de preços e economia"
          />

          <Divider />

          <ConfigItem
            icon={<Moon size={18} />}
            title="Tema"
            subtitle="Claro, escuro ou automático"
          />

          <Divider />

          <ConfigItem
            icon={<Globe size={18} />}
            title="Idioma"
            subtitle={LOCALE_LABELS[locale] ?? locale}
            onClick={() => router.push("/profile/language")}
          />
        </ConfigSection>
        <ConfigSection title="Sobre">
          <ConfigItem
            icon={<Info size={18} />}
            title="Versão"
            subtitle="LocalV1 1.0.0"
            hideArrow
          />

          <Divider />

          <div className="px-5 py-5">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-black tracking-[0.18em] text-[#8291A1] uppercase">
                LocalV1
              </span>

              <span className="text-[8px] font-bold tracking-wider text-[#B1AFA8] uppercase">
                v1.0.0
              </span>
            </div>

            <p className="mt-3 text-[9px] leading-4 text-[#9AA5AE]">
              Uma ferramenta colaborativa para viajantes encontrarem produtos,
              mercados e melhores preços.
            </p>

            <p className="mt-4 border-t border-[#E8E3D8] pt-3 text-[8px] font-medium text-[#A5A9AC]">
              © {year} LocalV1
            </p>
          </div>
        </ConfigSection>
        <div className="pt-1 pb-4 text-center">
          <p className="text-[8px] font-black tracking-[0.2em] text-[#C0B9AB] uppercase">
            Built for travelers
          </p>
        </div>
      </section>

      <BottomNav />
    </main>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Section
// ─────────────────────────────────────────────────────────────────────────────

function ConfigSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[9px] font-black tracking-[0.18em] text-[#8291A1] uppercase">
          {title}
        </h2>

        <span className="h-px w-12 bg-[#D8D1C1]" />
      </div>

      <div className="overflow-hidden border border-[#D8D1C1] bg-white">
        {children}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Config Item
// ─────────────────────────────────────────────────────────────────────────────

function ConfigItem({
  icon,
  title,
  subtitle,
  hideArrow = false,
  onClick,
}: {
  icon: ReactNode
  title: string
  subtitle?: string
  hideArrow?: boolean
  onClick?: () => void
}) {
  const Component = onClick ? "button" : "div"

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`group flex w-full items-center gap-4 px-4 py-4 text-left transition-colors duration-200 ${
        onClick ? "hover:bg-[#F7F3E8] active:bg-[#EEE9DE]" : ""
      } `}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#F7F3E8] text-[#102A43] transition-colors duration-200 group-hover:bg-[#DDECE5] group-hover:text-[#467566]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-black text-[#102A43]">{title}</p>

        {subtitle && (
          <p className="mt-1 truncate text-[10px] leading-4 text-[#8291A1]">
            {subtitle}
          </p>
        )}
      </div>

      {!hideArrow && (
        <ChevronRight
          size={16}
          className="shrink-0 text-[#A5AFB7] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#102A43]"
        />
      )}
    </Component>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Divider
// ─────────────────────────────────────────────────────────────────────────────

function Divider() {
  return <div className="ml-[72px] h-px bg-[#E8E3D8]" />
}
