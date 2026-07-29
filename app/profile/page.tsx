"use client"

import {
  Bell,
  ChevronRight,
  Globe,
  Heart,
  LogOut,
  MapPin,
  Settings,
} from "lucide-react"

import BottomNav from "@/components/BottomNav"
import { useRouter } from "next/navigation"

export default function Profile() {
  const router = useRouter()

  const year = new Date().getFullYear()

  return (
    <main className="bg-background min-h-screen pb-24">
      <header className="bg-card border-border border-b px-5 py-6">
        <h1 className="text-3xl font-bold">Perfil</h1>

        <p className="text-muted-foreground mt-1 text-sm">
          Configure sua experiência
        </p>
      </header>

      <section className="p-4">
        <div className="bg-card flex items-center gap-4 rounded-3xl border p-5 shadow-sm">
          <div className="bg-primary/10 flex h-20 w-20 items-center justify-center rounded-3xl text-4xl">
            👤
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-bold">Usuário PricePal</h2>

            <p className="text-muted-foreground text-sm">Conta gratuita</p>

            <div className="bg-primary/10 text-primary mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium">
              <MapPin size={13} />
              Dublin, Irlanda
            </div>
          </div>
        </div>
      </section>

      <section className="px-4">
        <h3 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">
          Preferências
        </h3>

        <div className="flex flex-col gap-3">
          <ProfileItem
            icon={<Heart size={20} />}
            title="Mercados salvos"
            description="Veja seus favoritos"
          />

          <ProfileItem
            icon={<Bell size={20} />}
            title="Alertas de preço"
            description="Receba avisos de economia"
          />

          <ProfileItem
            icon={<Globe size={20} />}
            title="Idioma e moeda"
            description="Português (Brasil)"
            onClick={() => router.push("/profile/language")}
          />

          <ProfileItem
            icon={<Settings size={20} />}
            title="Configurações"
            description="Conta e privacidade"
          />
        </div>
      </section>

      <section className="p-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-3.5 text-sm font-bold text-red-600 transition hover:bg-red-100">
          <LogOut size={18} />
          Sair
        </button>
      </section>

      <section className="px-4 pt-4 pb-8 text-center">
        <p className="text-muted-foreground text-xs">
          © {year} PricePal. Todos os direitos reservados.
        </p>

        <p className="text-muted-foreground mt-1 text-[11px]">Build 0.0.1</p>
      </section>

      <BottomNav />
    </main>
  )
}

function ProfileItem({
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
  return (
    <button
      onClick={onClick}
      className="group bg-card flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-2xl">
        {icon}
      </div>

      <div className="flex-1">
        <p className="font-semibold">{title}</p>

        <p className="text-muted-foreground text-sm">{description}</p>
      </div>

      <ChevronRight
        size={20}
        className="text-muted-foreground transition-transform group-hover:translate-x-1"
      />
    </button>
  )
}
