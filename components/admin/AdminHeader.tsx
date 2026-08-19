'use client';

import { Menu, Search } from 'lucide-react';

import { AdminNotifications } from './AdminNotifications';

type AdminHeaderProps = {
  onMenuClick?: () => void;
};

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
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

        <p className="text-xs font-medium text-[#9b8279] lg:hidden">Aura Beauty</p>
      </div>

      <div className="flex items-center gap-3">
        {/*<AdminNotifications />*/}

        <div className="hidden h-8 w-px bg-[#e9e1dc] sm:block" />

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c9afa5] text-[10px] font-bold text-white">
            RE
          </div>

          <div className="hidden sm:block">
            <p className="text-[11px] font-bold text-[#493a35]">Rebeca</p>

            <p className="text-[9px] text-[#a18b83]">Administrador</p>
          </div>
        </div>
      </div>
    </header>
  );
}
