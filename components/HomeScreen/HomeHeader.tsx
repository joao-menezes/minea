import { LogOut } from 'lucide-react';

import type { User } from '@/types';

type HomeHeaderProps = {
  user: User;
  onLogout: () => void;
};

export function HomeHeader({ user, onLogout }: HomeHeaderProps) {
  const firstName = user.name?.split(' ')[0] || 'você';

  return (
    <header className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold uppercase tracking-[0.34em] text-[#c2a99d]">
            Minea
          </span>

          <span className="h-1 w-1 rounded-full bg-[#dcbfb1]" />

          <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#cdb9ae]">
            Estética & Bem-estar
          </span>
        </div>

        <h1 className="mt-2 font-display text-[31px] leading-none tracking-[-0.03em] text-[#6b5850]">
          Olá, {firstName}
        </h1>
      </div>

      <button
        type="button"
        onClick={onLogout}
        aria-label="Sair"
        className="group flex h-11 w-11 items-center justify-center rounded-full border border-[#f0e6de] bg-white/80 text-[#a68b7f] shadow-[0_10px_30px_-18px_rgba(66,48,42,.25)] backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white"
      >
        <LogOut
          size={16}
          strokeWidth={1.7}
          className="transition-transform group-hover:-translate-x-0.5"
        />
      </button>
    </header>
  );
}
