import { X } from 'lucide-react';

import type { Client } from '@/types';

type Props = {
  client: Client;
  onClose: () => void;
};

export function ClientModalHeader({ client, onClose }: Props) {
  const getInitials = (client: string) => {
    return client
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase())
      .join('');
  };

  return (
    <header className="relative shrink-0 overflow-hidden bg-[#ead8cf] p-5 sm:p-6">
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full border border-white/40 bg-white/15" />

      <div className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-[#c9afa5]/60 sm:hidden" />

      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/30 text-[#9b7c6e] backdrop-blur transition hover:bg-white/50"
      >
        <X size={15} />
      </button>

      <div className="relative flex items-center gap-3 pr-10 sm:gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-white/60 bg-[#c9afa5] text-[13px] font-bold text-white shadow-sm sm:h-16 sm:w-16 sm:text-[14px]">
          {getInitials(client.name)}
        </div>

        <div className="min-w-0">
          <h2 className="truncate font-display text-[25px] leading-none tracking-[-0.025em] text-[#6b5850] sm:text-[28px]">
            {client.name}
          </h2>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-[9px] text-[#a48a7f] sm:text-[10px]">{client.phone}</span>

            <span className="h-1 w-1 rounded-full bg-[#c8aea3]" />

            <span className="text-[9px] text-[#a48a7f]">{client.isActive}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
