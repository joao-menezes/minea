"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Map, User, Plus, type LucideIcon } from "lucide-react"

type NavItemConfig = {
  href: string
  label: string
  icon: LucideIcon
  action?: boolean
}

const ITEMS: NavItemConfig[] = [
  { href: "/", label: "Buscar", icon: Search },
  { href: "/map", label: "Mapa", icon: Map },
  { href: "/report", label: "Reportar", icon: Plus, action: true },
  { href: "/profile", label: "Perfil", icon: User },
]

function NavItem({ item, active }: { item: NavItemConfig; active: boolean }) {
  const Icon = item.icon

  if (item.action) {
    const Icon = item.icon

    return (
      <Link
        href={item.href}
        className="relative -mt-8 flex flex-col items-center gap-2"
      >
        <div className="relative h-9 w-9 -rotate-45 rounded bg-[#E76F51] shadow-[0_3px_8px_rgba(231,111,81,0.4)] transition-transform duration-200 ease-out active:scale-90 motion-reduce:transition-none">
          <Icon
            size={18}
            strokeWidth={3}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 text-white"
          />
        </div>

        <span className="mt-1 text-[9px] font-black tracking-[0.12em] text-[#E76F51] uppercase">
          {item.label}
        </span>
      </Link>
    )
  }

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className="relative flex min-w-16 flex-col items-center justify-center gap-1.5 py-2"
    >
      <span
        className={`absolute top-[26px] h-1 w-4 rounded-full bg-black/10 blur-[1px] transition-opacity duration-200 motion-reduce:transition-none ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${
          active
            ? "h-8 w-8 -translate-y-2 -rotate-45 rounded bg-[#102A43]"
            : "h-6 w-6 translate-y-0 rotate-0 rounded-full bg-transparent"
        }`}
      >
        <Icon
          size={active ? 15 : 16}
          strokeWidth={active ? 2.6 : 2}
          className={`transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${
            active ? "rotate-45 text-white" : "rotate-0 text-[#8291A1]"
          }`}
        />
      </div>

      <span
        className={`text-[9px] font-black tracking-[0.08em] uppercase transition-colors duration-200 ${
          active ? "text-[#102A43]" : "text-[#8291A1]"
        }`}
      >
        {item.label}
      </span>
    </Link>
  )
}

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed right-0 bottom-0 left-0 z-50 border-t border-dashed border-[#D8D1C1] bg-[#F7F3E8]/95 px-3 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(16,42,67,0.06)] backdrop-blur"
    >
      <div className="pointer-events-none absolute top-[42px] right-6 left-6 border-t border-dashed border-[#D8D1C1]" />

      <div className="relative mx-auto flex h-[68px] max-w-md items-center justify-around">
        {ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href)

          return <NavItem key={item.href} item={item} active={active} />
        })}
      </div>
    </nav>
  )
}
