import { CalendarDays, ChevronRight } from 'lucide-react';

import type { Client } from '@/types/client';

type Props = {
  client: Client;
  onClick: () => void;
};

export function ClientCard({ client, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-[22px] border border-[#f1e8e2] bg-white/90 p-4 text-left shadow-[0_13px_30px_-25px_rgba(64,46,40,.25)] transition-all hover:-translate-y-0.5"
    >
      <div className="relative shrink-0">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d6beb5] text-[9px] font-bold text-white">
          {client.initials}
        </div>

        <span
          className={[
            'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white',
            client.status === 'Ativa' ? 'bg-[#91a695]' : 'bg-[#d3c7c1]',
          ].join(' ')}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-[12px] font-bold text-[#6b5850]">{client.name}</p>

          <span
            className={[
              'shrink-0 rounded-full px-2 py-1 text-[7px] font-bold',
              client.status === 'Ativa'
                ? 'bg-[#f3e9e4] text-[#8f7165]'
                : 'bg-[#f5f1ee] text-[#b4a098]',
            ].join(' ')}
          >
            {client.status}
          </span>
        </div>

        <div className="mt-1.5 flex items-center gap-3">
          <span className="flex items-center gap-1 text-[9px] text-[#b49b90]">
            <CalendarDays size={10} />
            {client.appointments} atendimentos
          </span>

          <span className="truncate text-[9px] text-[#b49b90]">{client.favoriteService}</span>
        </div>
      </div>

      <ChevronRight
        size={15}
        className="shrink-0 text-[#cdb9ae] transition-transform group-hover:translate-x-0.5"
      />
    </button>
  );
}
