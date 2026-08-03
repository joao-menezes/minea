"use client"

import {
  Bell,
  ChevronRight,
  Heart,
  LogOut,
  MapPin,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import { useRouter } from "next/navigation"

import BottomNav from "@/components/BottomNav"
import { useUserLocation } from "@/hooks/useUserLocation"
import { ProfileMenuItem } from "@/types"

// ─── Constants ────────────────────────────────────────────────────────────────

const PREFERENCES: ProfileMenuItem[] = [
  {
    icon: <Heart size={18} />,
    title: "Mercados salvos",
    description: "Veja seus favoritos",
  },
  {
    icon: <Bell size={18} />,
    title: "Alertas de preço",
    description: "Receba avisos de economia",
  },
  {
    icon: <Settings size={18} />,
    title: "Configurações",
    description: "Moeda, idioma e privacidade",
    href: "/profile/configuration",
  },
  {
    icon: <ShieldCheck size={18} />,
    title: "Privacidade",
    description: "Gerencie seus dados",
  },
]

export default function ProfilePage() {
  const router = useRouter()
  const { location, loading, error } = useUserLocation()

  function handleLogout() {
    // TODO: implementar logout
  }

  function handleMenuClick(item: ProfileMenuItem) {
    if (item.href) router.push(item.href)
    item.onClick?.()
  }

  return (
    <main className="bg-background min-h-screen pb-24">
      <PageHeader />

      <section className="px-4 pt-2 pb-4">
        <UserCard loading={loading} error={!!error} location={location} />
      </section>

      <section className="px-4 pb-4">
        <SectionLabel>Preferências</SectionLabel>

        <div className="flex flex-col gap-2">
          {PREFERENCES.map((item) => (
            <MenuItem
              key={item.title}
              item={item}
              onClick={() => handleMenuClick(item)}
            />
          ))}
        </div>
      </section>

      <section className="px-4 pb-6">
        <LogoutButton onClick={handleLogout} />
      </section>

      <BottomNav />
    </main>
  )
}

function PageHeader() {
  return (
    <header className="bg-card border-border border-b px-5 py-6">
      <h1 className="text-2xl font-bold">Perfil</h1>
      <p className="text-muted-foreground mt-0.5 text-sm">
        Configure sua experiência
      </p>
    </header>
  )
}

function UserCard({
  loading,
  error,
  location,
}: {
  loading: boolean
  error: boolean
  location: { latitude: number; longitude: number } | null
}) {
  const locationLabel = loading
    ? "Obtendo localização..."
    : error || !location
      ? "Localização não disponível"
      : "Localização atual"

  const locationColor =
    error || !location
      ? "bg-red-50 text-red-500 dark:bg-red-950/30"
      : "bg-primary/10 text-primary"

  return (
    <div className="bg-card flex items-center gap-4 rounded-3xl border p-5 shadow-sm">
      <div className="bg-primary/10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl">
        <UserRound size={32} className="text-primary" />
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="font-bold">Usuário PricePal</h2>
        <p className="text-muted-foreground text-sm">Conta gratuita</p>

        <div
          className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${locationColor}`}
        >
          <MapPin size={12} />
          <span className="truncate">{locationLabel}</span>
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
      {children}
    </p>
  )
}

function MenuItem({
  item,
  onClick,
}: {
  item: ProfileMenuItem
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group bg-card flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
    >
      <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
        {item.icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-semibold">{item.title}</p>
        <p className="text-muted-foreground text-sm">{item.description}</p>
      </div>

      <ChevronRight
        size={18}
        className="text-muted-foreground shrink-0 transition-transform group-hover:translate-x-0.5"
      />
    </button>
  )
}

function LogoutButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-3.5 text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-100 active:scale-[0.98] dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
    >
      <LogOut size={16} />
      Sair da conta
    </button>
  )
}
