"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Map, User, Plus } from "lucide-react"

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
    href: "/report",
    label: "Reportar",
    icon: Plus,
    action: true,
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
    <nav className="fixed right-0 bottom-0 left-0 z-50 border-t border-[#D8D1C1] bg-[#F7F3E8]/95 px-3 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="mx-auto flex h-[68px] max-w-md items-center justify-around">
        {ITEMS.map((item) => {
          const Icon = item.icon

          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href)

          /*
           * Ação principal:
           * Reportar preço.
           */
          if (item.action) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -mt-6 flex flex-col items-center gap-1"
              >
                <div className="flex h-14 w-14 items-center justify-center border-4 border-[#F7F3E8] bg-[#E76F51] text-white shadow-lg transition-transform duration-200 active:scale-90">
                  <Plus size={25} strokeWidth={2.8} />
                </div>

                <span className="text-[9px] font-black tracking-[0.12em] text-[#E76F51] uppercase">
                  Reportar
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-w-[64px] flex-col items-center justify-center gap-1 py-2"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center transition-all duration-200 ${
                  active ? "bg-[#102A43] text-white" : "text-[#8291A1]"
                } `}
              >
                <Icon size={17} strokeWidth={active ? 2.8 : 2} />
              </div>

              <span
                className={`text-[9px] font-black tracking-[0.08em] uppercase ${
                  active ? "text-[#102A43]" : "text-[#8291A1]"
                } `}
              >
                {item.label}
              </span>

              {active && (
                <span className="absolute bottom-1 h-0.5 w-5 bg-[#E76F51]" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
