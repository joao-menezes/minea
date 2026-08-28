'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';

import { ChevronDown, LogOut, Menu, Search, Settings, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { getCurrentUser, signOut } from '@/lib/api/auth';
import type { User } from '@/types';

type AdminHeaderProps = {
  onMenuClick?: () => void;
};

const SEARCH_DESTINATIONS = [
  { label: 'Dashboard', keywords: 'dashboard início resumo', href: '/admin' },
  { label: 'Agenda', keywords: 'agenda agendamento horários', href: '/admin/agenda' },
  { label: 'Clientes', keywords: 'clientes pacientes usuários', href: '/admin/clientes' },
  { label: 'Serviços', keywords: 'serviços procedimentos', href: '/admin/servicos' },
  { label: 'Financeiro', keywords: 'financeiro pagamentos faturamento', href: '/admin/financeiro' },
  {
    label: 'Configurações',
    keywords: 'configurações ajustes preferências perfil',
    href: '/admin/settings',
  },
];

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void getCurrentUser().then(setUser);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleSearchShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
        setSearchOpen(true);
      }
    }

    document.addEventListener('keydown', handleSearchShortcut);
    return () => document.removeEventListener('keydown', handleSearchShortcut);
  }, []);

  useEffect(() => {
    function handleSearchOutsideClick(event: MouseEvent) {
      if (!searchRef.current?.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }

    document.addEventListener('mousedown', handleSearchOutsideClick);
    return () => document.removeEventListener('mousedown', handleSearchOutsideClick);
  }, []);

  const normalizedSearch = search.trim().toLowerCase();
  const searchResults = SEARCH_DESTINATIONS.filter(
    (destination) =>
      !normalizedSearch ||
      `${destination.label} ${destination.keywords}`.includes(normalizedSearch),
  );

  function navigateFromSearch(href: string) {
    setSearch('');
    setSearchOpen(false);
    router.push(href);
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const destination = searchResults[0];

    if (destination) {
      navigateFromSearch(destination.href);
    }
  }

  const initials =
    user?.name
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'AD';

  async function handleLogout() {
    await signOut();
    router.push('/admin/login');
  }

  return (
    <header className="relative z-[1] flex h-[76px] items-center justify-between border-b border-[#e9e1dc] bg-white/80 px-4 backdrop-blur-xl sm:px-5 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-[#806f68] transition hover:bg-[#f5efec] lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu size={19} />
        </button>

        <div ref={searchRef} className="relative hidden lg:block">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 rounded-xl border border-[#e9e1dc] bg-[#fcfaf9] px-3"
          >
            <Search size={15} className="text-[#a58f87]" />

            <input
              ref={searchInputRef}
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Buscar..."
              aria-label="Buscar no painel administrativo"
              className="h-9 w-52 bg-transparent text-xs text-[#493a35] outline-none placeholder:text-[#b6a59e]"
            />

            <kbd className="rounded-md bg-white px-1.5 py-0.5 text-[8px] font-semibold text-[#a58f87] shadow-sm">
              ⌘ K
            </kbd>
          </form>

          {searchOpen && (
            <div className="absolute left-0 top-[calc(100%+8px)] z-20 w-full overflow-hidden rounded-xl border border-[#e9e1dc] bg-white p-1.5 shadow-lg">
              {searchResults.length > 0 ? (
                searchResults.map((destination) => (
                  <button
                    key={destination.href}
                    type="button"
                    onClick={() => navigateFromSearch(destination.href)}
                    className="flex w-full items-center rounded-lg px-3 py-2 text-left text-xs text-[#493a35] transition hover:bg-[#f5efec]"
                  >
                    <Search size={13} className="mr-2 text-[#a58f87]" />
                    {destination.label}
                  </button>
                ))
              ) : (
                <p className="px-3 py-2 text-xs text-[#a18b83]">Nenhum resultado encontrado.</p>
              )}
            </div>
          )}
        </div>

        <p className="text-xs font-medium text-[#9b8279] lg:hidden">Minea</p>
      </div>

      <div className="flex items-center gap-3">
        {/*<AdminNotifications />*/}

        <div className="hidden h-8 w-px bg-[#e9e1dc] sm:block" />

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl px-1.5 py-1 transition hover:bg-[#f5efec]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c9afa5] text-[10px] font-bold text-white">
              {initials}
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-[11px] font-bold text-[#493a35]">
                {user?.name ?? 'Administrador'}
              </p>
              <p className="text-[9px] text-[#a18b83]">Administrador</p>
            </div>

            <ChevronDown
              size={14}
              className={`hidden text-[#a58f87] transition-transform sm:block ${
                menuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-52 overflow-hidden rounded-xl border border-[#e9e1dc] bg-white shadow-lg">
              <div className="border-b border-[#e9e1dc] px-4 py-3 sm:hidden">
                <p className="text-[11px] font-bold text-[#493a35]">
                  {user?.name ?? 'Administrador'}
                </p>
                <p className="text-[9px] text-[#a18b83]">Administrador</p>
              </div>

              {/*<button*/}
              {/*  type="button"*/}
              {/*  onClick={() => {*/}
              {/*    setMenuOpen(false);*/}
              {/*    router.push('/admin/settings');*/}
              {/*  }}*/}
              {/*  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs text-[#493a35] transition hover:bg-[#f5efec]"*/}
              {/*>*/}
              {/*  <UserIcon size={14} className="text-[#a58f87]" />*/}
              {/*  Meu perfil*/}
              {/*</button>*/}

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  router.push('/admin/settings');
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs text-[#493a35] transition hover:bg-[#f5efec]"
              >
                <Settings size={14} className="text-[#a58f87]" />
                Configurações
              </button>

              <div className="h-px bg-[#e9e1dc]" />

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={14} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
