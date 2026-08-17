'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, BarChart3, CircleDollarSign, Settings, Sparkles, Users } from 'lucide-react'

const NAVIGATION = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: BarChart3,
  },
  {
    label: 'Agenda',
    href: '/admin/agenda',
    icon: CalendarDays,
  },
  {
    label: 'Clientes',
    href: '/admin/clientes',
    icon: Users,
  },
  {
    label: 'Serviços',
    href: '/admin/servicos',
    icon: Sparkles,
  },
  {
    label: 'Financeiro',
    href: '/admin/financeiro',
    icon: CircleDollarSign,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-[250px] shrink-0 border-r border-[#e9e1dc] bg-[#fcfaf9] lg:flex lg:flex-col">
      <div className="flex h-full flex-col px-5 py-7">
        <div className="px-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#80655b]">Minea</p>

          <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.18em] text-[#b09a91]">
            Estética & Bem-estar
          </p>
        </div>

        {/* Navigation */}
        <nav className="mt-10 flex flex-1 flex-col gap-1">
          <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.25em] text-[#b09a91]">
            Menu
          </p>

          {NAVIGATION.map((item) => {
            const Icon = item.icon

            const active =
              item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'group flex h-11 items-center gap-3 rounded-xl px-3',
                  'text-sm font-medium transition-all',
                  active
                    ? 'bg-[#493a35] text-white shadow-[0_10px_25px_-15px_rgba(54,39,34,.8)]'
                    : 'text-[#806f68] hover:bg-[#f3ece8] hover:text-[#493a35]',
                ].join(' ')}
              >
                <Icon size={17} strokeWidth={active ? 2 : 1.7} />

                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-[#e9e1dc] pt-4">
          <Link
            href="/admin/configuracoes"
            className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-[#806f68] transition hover:bg-[#f3ece8] hover:text-[#493a35]"
          >
            <Settings size={17} strokeWidth={1.7} />
            Configurações
          </Link>

          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#f3ece8] p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c9afa5] text-xs font-bold text-white">
              RE
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-[#493a35]">Rebeca</p>

              <p className="text-[9px] font-medium text-[#9b8279]">Administrador</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
