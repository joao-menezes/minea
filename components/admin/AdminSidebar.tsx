'use client';

import {
  BarChart3,
  Bell,
  CalendarDays,
  CircleDollarSign,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAVIGATION = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: BarChart3,
    enabled: true,
  },
  {
    label: 'Agenda',
    href: '/admin/agenda',
    icon: CalendarDays,
    enabled: true,
  },
  {
    label: 'Clientes',
    href: '/admin/clientes',
    icon: Users,
    enabled: true,
  },
  {
    label: 'Serviços',
    href: '/admin/servicos',
    icon: Sparkles,
    enabled: true,
  },
  {
    label: 'Financeiro',
    href: '/admin/financeiro',
    icon: CircleDollarSign,
    enabled: true,
  },
  {
    label: 'Notificações',
    href: '/admin/notifications',
    icon: Bell,
    enabled: false,
  },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-[250px] shrink-0 overflow-hidden border-r border-[#e9e1dc] bg-[#fcfaf9] lg:flex lg:flex-col">
      <div className="flex h-full min-h-0 flex-col px-5 py-7">
        <div className="shrink-0 px-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#80655b]">Minea</p>

          <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.18em] text-[#b09a91]">
            Estética & Bem-estar
          </p>
        </div>

        <nav className="mt-10 min-h-0 flex-1 overflow-y-auto">
          <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.25em] text-[#b09a91]">
            Menu
          </p>

          <div className="space-y-1">
            {NAVIGATION.filter((item) => item.enabled).map((item) => {
              const Icon = item.icon;

              const active =
                item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    'group flex h-11 w-full items-center gap-3 rounded-xl px-3',
                    'text-sm font-medium',
                    'transition-all duration-200',
                    active
                      ? [
                          'bg-[#493a35] text-white',
                          'shadow-[0_10px_25px_-15px_rgba(54,39,34,.8)]',
                        ].join(' ')
                      : ['text-[#806f68]', 'hover:bg-[#f3ece8]', 'hover:text-[#493a35]'].join(' '),
                  ].join(' ')}
                >
                  <Icon size={17} strokeWidth={active ? 2 : 1.7} className="shrink-0" />

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="mt-5 shrink-0 border-t border-[#e9e1dc] pt-4">
          <Link
            href="/admin/settings"
            className={[
              'group flex h-11 items-center gap-3 rounded-xl px-3',
              'text-sm font-medium text-[#806f68]',
              'transition-all duration-200',
              'hover:bg-[#f3ece8] hover:text-[#493a35]',
            ].join(' ')}
          >
            <Settings size={17} strokeWidth={1.7} className="shrink-0" />

            <span>Configurações</span>
          </Link>

          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#f3ece8] p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c9afa5] text-xs font-bold text-white">
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
  );
}
