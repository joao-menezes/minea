"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Search, Map, User, Heart } from "lucide-react"

const ITEMS = [
  {
    href: "/",
    label: "Buscar",
    icon: Search,
  },
  {
    href: "/map",
    label: "Mapa",
    icon: Map,
  },
  {
    href: "/profile",
    label: "Perfil",
    icon: User,
  },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="border-border bg-card/90 fixed right-4 bottom-4 left-4 z-50 flex h-[74px] items-center justify-around rounded-3xl border px-2 shadow-xl backdrop-blur-xl md:right-6 md:left-auto md:w-[380px]">
      {ITEMS.map((item) => {
        const Icon = item.icon

        const active = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex h-14 min-w-[70px] flex-col items-center justify-center gap-1 rounded-2xl transition-all duration-200 ${
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary"
            } `}
          >
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-xl transition-all ${
                active
                  ? "bg-primary scale-110 text-white shadow-md"
                  : "group-hover:scale-110"
              } `}
            >
              <Icon size={18} strokeWidth={active ? 2.8 : 2} />
            </div>

            <span
              className={`text-[11px] font-semibold ${
                active ? "text-primary" : "text-muted-foreground"
              } `}
            >
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
