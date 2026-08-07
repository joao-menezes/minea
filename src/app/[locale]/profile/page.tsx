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
  Compass,
  Award,
} from "lucide-react"
import { useRouter } from "next/navigation"

import BottomNav from "@/components/BottomNav"
import { useUserLocation } from "@/hooks/useUserLocation"
import { ProfileMenuItem } from "@/lib/types"

const PREFERENCES: ProfileMenuItem[] = [
  {
    icon: Heart,
    title: "Mercados salvos",
    description: "Seus lugares favoritos",
  },
  {
    icon: Bell,
    title: "Alertas de preço",
    description: "Avisos quando houver economia",
  },
  {
    icon: Settings,
    title: "Configurações",
    description: "Moeda, idioma e preferências",
    href: "/profile/configuration",
  },
  {
    icon: ShieldCheck,
    title: "Privacidade",
    description: "Controle seus dados",
  },
]

export default function ProfilePage() {
  const router = useRouter()

  const { location, loading, error } = useUserLocation()

  function handleLogout() {
    // TODO: implementar logout
  }

  function handleMenuClick(item: ProfileMenuItem) {
    if (item.href) {
      router.push(item.href)
    }

    item.onClick?.()
  }

  return (
    <main className="min-h-screen bg-[#F7F3E8] pb-24">
      <header className="px-4 pt-6 pb-5">
        <div className="flex items-end justify-between">
          <div>
            <span className="block text-[9px] font-black tracking-[0.25em] text-[#8291A1] uppercase">
              LocalV1
            </span>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-[#102A43]">
              Seu perfil
            </h1>
          </div>

          <div className="flex h-9 w-9 items-center justify-center border border-[#D8D1C1] bg-white text-[#8291A1]">
            <Compass size={17} />
          </div>
        </div>
      </header>

      <section className="px-4 pb-6">
        <UserCard loading={loading} error={!!error} location={location} />
      </section>

      <section className="px-4 pb-6">
        <div className="grid grid-cols-3 border border-[#D8D1C1] bg-white">
          <Stat value="0" label="Relatos" />

          <Stat value="0" label="Salvos" bordered />

          <Stat value="0" label="Economia" bordered />
        </div>
      </section>

      <section className="px-4 pb-5">
        <SectionLabel>Sua viagem</SectionLabel>

        <div className="overflow-hidden border border-[#D8D1C1] bg-white">
          {PREFERENCES.map((item, index) => (
            <MenuItem
              key={item.title}
              item={item}
              onClick={() => handleMenuClick(item)}
              last={index === PREFERENCES.length - 1}
            />
          ))}
        </div>
      </section>

      <section className="px-4 pb-6">
        <div className="flex items-center gap-4 border border-[#D8D1C1] bg-[#102A43] p-4 text-white">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#F4C95D] text-[#102A43]">
            <Award size={18} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-black">Contribua para a comunidade</p>

            <p className="mt-1 text-[10px] leading-4 text-[#B7C5D0]">
              Cada preço que você compartilha ajuda outro viajante a economizar.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 pb-8">
        <LogoutButton onClick={handleLogout} />
      </section>

      <BottomNav />
    </main>
  )
}

function UserCard({
  loading,
  error,
  location,
}: {
  loading: boolean
  error: boolean
  location: {
    latitude: number
    longitude: number
  } | null
}) {
  const locationLabel = loading
    ? "Obtendo localização..."
    : error || !location
      ? "Localização indisponível"
      : "Localização atual"

  const locationIsValid = !error && !!location

  return (
    <div className="relative overflow-hidden border border-[#D8D1C1] bg-white p-5">
      <div className="pointer-events-none absolute -top-5 -right-5 flex h-24 w-24 rotate-12 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-dashed border-[#D8D1C1] [animation-duration:50s]" />

        <Compass size={34} className="relative text-[#D8D1C1]" />
      </div>

      <div className="relative flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-[#102A43] text-white">
          <UserRound size={27} strokeWidth={2} />
        </div>

        <div className="min-w-0">
          <span className="block text-[8px] font-black tracking-[0.18em] text-[#8291A1] uppercase">
            Traveler
          </span>

          <h2 className="mt-1 truncate text-base font-black text-[#102A43]">
            Usuário LocalV1
          </h2>

          <p className="mt-0.5 text-[10px] font-medium text-[#8291A1]">
            Conta gratuita
          </p>
        </div>
      </div>

      <div
        className={`mt-5 flex items-center gap-2 border-t border-[#E8E3D8] pt-4 text-[10px] font-bold ${
          locationIsValid ? "text-[#467566]" : "text-[#B85C5C]"
        } `}
      >
        <MapPin size={13} />

        <span>{locationLabel}</span>

        {locationIsValid && <span className="ml-auto h-2 w-2 bg-[#6B9080]" />}
      </div>
    </div>
  )
}

function Stat({
  value,
  label,
  bordered = false,
}: {
  value: string
  label: string
  bordered?: boolean
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-4 ${
        bordered ? "border-l border-[#D8D1C1]" : ""
      } `}
    >
      <span className="text-lg font-black text-[#102A43]">{value}</span>

      <span className="mt-0.5 text-[8px] font-black tracking-wider text-[#8291A1] uppercase">
        {label}
      </span>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <span className="text-[9px] font-black tracking-[0.18em] text-[#8291A1] uppercase">
        {children}
      </span>

      <span className="h-px w-12 bg-[#D8D1C1]" />
    </div>
  )
}

function MenuItem({
  item,
  onClick,
  last,
}: {
  item: ProfileMenuItem
  onClick: () => void
  last: boolean
}) {
  const Icon = item.icon

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-4 px-4 py-4 text-left transition-colors duration-200 hover:bg-[#F7F3E8] ${
        !last ? "border-b border-[#E8E3D8]" : ""
      } `}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#F7F3E8] text-[#102A43] transition-colors group-hover:bg-[#DDECE5] group-hover:text-[#467566]">
        <Icon size={18} strokeWidth={2} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-black text-[#102A43]">{item.title}</p>

        <p className="mt-1 truncate text-[10px] leading-4 text-[#8291A1]">
          {item.description}
        </p>
      </div>

      <ChevronRight
        size={16}
        className="shrink-0 text-[#A5AFB7] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#102A43]"
      />
    </button>
  )
}

function LogoutButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 border border-[#E5B5AA] bg-[#FFF7F5] py-3 text-[10px] font-black tracking-[0.12em] text-[#B85C5C] uppercase transition-colors hover:bg-[#FDEAE5]"
    >
      <LogOut size={14} />
      Sair da conta
    </button>
  )
}
