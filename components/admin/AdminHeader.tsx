'use client';

import { useEffect, useRef, useState } from 'react';

import { ChevronDown, LogOut, Menu, Search, Settings, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { getCurrentUser, signOut } from '@/lib/api/auth';
import type { User } from '@/types';

type AdminHeaderProps = {
  onMenuClick?: () => void;
};

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

        <div className="hidden items-center gap-2 rounded-xl border border-[#e9e1dc] bg-[#fcfaf9] px-3 lg:flex">
          <Search size={15} className="text-[#a58f87]" />

          <input
            type="search"
            placeholder="Buscar..."
            className="h-9 w-52 bg-transparent text-xs text-[#493a35] outline-none placeholder:text-[#b6a59e]"
          />

          <kbd className="rounded-md bg-white px-1.5 py-0.5 text-[8px] font-semibold text-[#a58f87] shadow-sm">
            ⌘ K
          </kbd>
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
