'use client';

import { ReactNode, useEffect, useState } from 'react';

import {
  BarChart3,
  CalendarDays,
  CircleDollarSign,
  Settings,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { getCurrentUser } from '@/lib/api/auth';

import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';

type AdminShellProps = {
  children: ReactNode;
};

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
];

export function AdminShell({ children }: AdminShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      const currentUser = await getCurrentUser();
      const isAuthenticated = Boolean(currentUser?.isAdmin);

      if (!isAuthenticated && pathname !== '/admin/login') {
        router.replace('/admin/login');
        return;
      }

      setAuthenticated(isAuthenticated);
      setChecking(false);
    }

    void checkAccess();
  }, [pathname, router]);

  // Fecha o drawer quando muda de página
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Impede scroll da página quando o menu está aberto
  useEffect(() => {
    if (!mobileMenuOpen) return;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  if (checking) {
    return null;
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f7f4f2] text-[#493a35]">
      <div className="flex min-h-screen">
        <AdminSidebar />

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-[#352c29]/25 backdrop-blur-[2px]"
            />

            <aside className="relative z-10 flex h-full w-[82vw] max-w-[310px] flex-col border-r border-[#e9e1dc] bg-[#fcfaf9] shadow-[20px_0_60px_-30px_rgba(54,39,34,.35)]">
              <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-[#e9e1dc] px-5">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#8a6f63] text-white">
                      <Sparkles size={13} strokeWidth={1.7} />
                    </div>

                    <p className="font-display text-[20px] leading-none tracking-[-0.03em] text-[#493a35]">
                      Minea
                    </p>
                  </div>

                  <p className="mt-1.5 pl-9 text-[7px] font-bold uppercase tracking-[0.25em] text-[#b09a91]">
                    Administração
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Fechar menu"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#806f68] transition hover:bg-[#f3ece8] hover:text-[#493a35]"
                >
                  <X size={17} strokeWidth={1.7} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-4 py-7">
                <p className="mb-3 px-2 text-[8px] font-bold uppercase tracking-[0.28em] text-[#b09a91]">
                  Menu
                </p>

                <div className="space-y-1">
                  {NAVIGATION.map((item) => {
                    const Icon = item.icon;

                    const active =
                      item.href === '/admin'
                        ? pathname === '/admin'
                        : pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={[
                          'group flex h-11 items-center gap-3 rounded-[14px] px-3',
                          'text-[12px] font-semibold transition-all',
                          active
                            ? 'bg-[#493a35] text-white shadow-[0_10px_25px_-15px_rgba(54,39,34,.8)]'
                            : 'text-[#806f68] hover:bg-[#f3ece8] hover:text-[#493a35]',
                        ].join(' ')}
                      >
                        <span
                          className={[
                            'flex h-8 w-8 items-center justify-center rounded-[10px]',
                            active ? 'bg-white/10' : 'group-hover:bg-white',
                          ].join(' ')}
                        >
                          <Icon size={16} strokeWidth={active ? 2 : 1.7} />
                        </span>

                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                <div className="my-7 h-px bg-[#e9e1dc]" />

                <Link
                  href="/admin/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="group flex h-11 items-center gap-3 rounded-[14px] px-3 text-[12px] font-semibold text-[#806f68] transition hover:bg-[#f3ece8] hover:text-[#493a35]"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-[10px] group-hover:bg-white">
                    <Settings size={16} strokeWidth={1.7} />
                  </span>
                  Configurações
                </Link>
              </nav>

              <div className="shrink-0 border-t border-[#e9e1dc] p-4">
                <div className="flex items-center gap-3 rounded-[18px] bg-[#f3ece8] p-3">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c9afa5] text-[9px] font-bold text-white">
                      RE
                    </div>

                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#f3ece8] bg-[#91a895]" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-bold text-[#493a35]">Rebeca</p>

                    <p className="mt-0.5 text-[8px] font-medium text-[#9b8279]">Administrador</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <AdminHeader onMenuClick={() => setMobileMenuOpen(true)} />

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
