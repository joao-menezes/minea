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
import { useRouter } from "next/navigation"
import { getRequestConfig } from "next-intl/server"
import { useLocale } from "next-intl"

export default function Config() {
  const router = useRouter()

  const year = new Date().getFullYear()

  const LOCALE_LABELS: Record<string, string> = {
    pt: "Português (Brasil)",
    en: "English",
    es: "Español",
    it: "Italiano",
    ja: "日本語",
    zh: "中文",
    fr: "France",
    de: "Deutsch",
  }

  const locale = useLocale()

  return (
    <main className="bg-background min-h-screen pb-24">
      <header className="border-border bg-card border-b px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Personalize sua experiência no PricePal
        </p>
      </header>

      <section className="space-y-6 px-4 pt-6">
        <div>
          <h2 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
            Conta
          </h2>

          <div className="border-border bg-card overflow-hidden rounded-3xl border shadow-sm">
            <ConfigItem
              icon={<User size={20} />}
              title="Perfil"
              subtitle="Nome, foto e informações"
            />

            <Divider />

            <ConfigItem
              icon={<Shield size={20} />}
              title="Privacidade"
              subtitle="Permissões e segurança"
            />
          </div>
        </div>

        <div>
          <h2 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
            Preferências
          </h2>

          <div className="border-border bg-card overflow-hidden rounded-3xl border shadow-sm">
            <ConfigItem
              icon={<MapPin size={20} />}
              title="Localização"
              subtitle="Usar localização atual"
            />

            <Divider />

            <ConfigItem
              icon={<Bell size={20} />}
              title="Notificações"
              subtitle="Alertas de promoções"
            />

            <Divider />

            <ConfigItem
              icon={<Moon size={20} />}
              title="Tema"
              subtitle="Claro, escuro ou automático"
            />

            <Divider />

            <ConfigItem
              icon={<Globe size={20} />}
              title="Idioma"
              subtitle={LOCALE_LABELS[locale] ?? locale}
              onClick={() => router.push("/profile/language")}
            />
          </div>
        </div>

        <div>
          <h2 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
            Sobre
          </h2>

          <div className="border-border bg-card overflow-hidden rounded-3xl border shadow-sm">
            <ConfigItem
              icon={<Info size={20} />}
              title="Versão"
              subtitle="PricePal 1.0.0"
              hideArrow
            />

            <Divider />

            <div className="px-5 py-4 text-center">
              <p className="text-muted-foreground text-xs">
                © {year} PricePal. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </section>

      <BottomNav />
    </main>
  )
}

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
  return (
    <button
      onClick={onClick}
      className="hover:bg-secondary/50 flex w-full items-center gap-4 px-5 py-4 text-left transition-colors"
    >
      <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-2xl">
        {icon}
      </div>

      <div className="flex-1">
        <p className="font-medium">{title}</p>
        {subtitle && (
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        )}
      </div>

      {!hideArrow && (
        <ChevronRight size={18} className="text-muted-foreground" />
      )}
    </button>
  )
}

function Divider() {
  return <div className="border-border mx-5 border-t" />
}
