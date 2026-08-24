import { ChevronRight } from 'lucide-react';

import { StatusBadge } from '@/components/badge';
import { Client } from '@/types';
import { formatDateShort, formatTime } from '@/utils/utils';

type Props = {
  clients: Client[];
  onSelect: (client: Client) => void;
};

export function DesktopTable({ clients, onSelect }: Props) {
  return (
    <div className="mt-5 hidden overflow-hidden rounded-[22px] border border-[#f1e8e2] lg:block">
      <div className="grid grid-cols-[2.2fr_1.1fr_1.25fr_1.45fr_.8fr_1fr_42px] items-center bg-[#faf6f3] px-5 py-3">
        <TableHeader>Cliente</TableHeader>
        <TableHeader>Último</TableHeader>
        <TableHeader>Próximo</TableHeader>
        <TableHeader>Serviço favorito</TableHeader>
        <TableHeader>Status</TableHeader>
        <TableHeader>Financeiro</TableHeader>
        <span />
      </div>

      <div className="divide-y divide-[#f1e8e2]">
        {clients.map((client) => (
          <ClientRow key={client.id} client={client} onClick={() => onSelect(client)} />
        ))}
      </div>
    </div>
  );
}

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#c2a99d]">
      {children}
    </span>
  );
}

function ClientRow({ client, onClick }: { client: Client; onClick: () => void }) {
  const lastAppointment = client.lastAppointmentAt ? new Date(client.lastAppointmentAt) : null;

  const date = lastAppointment ? formatDateShort(lastAppointment) : null;
  const time = lastAppointment ? formatTime(lastAppointment) : null;

  const getInitials = (client: string) => {
    return client
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase())
      .join('');
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="group grid w-full grid-cols-[2.2fr_1.1fr_1.25fr_1.45fr_.8fr_1fr_42px] items-center px-5 py-4 text-left transition-colors hover:bg-[#fdf9f7]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d6beb5] text-[9px] font-bold text-white shadow-sm">
            {getInitials(client.name)}
          </div>

          <span
            className={[
              'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white',
              client.isActive ? 'bg-[#91a695]' : 'bg-[#d3c7c1]',
            ].join(' ')}
          />
        </div>

        <div className="min-w-0">
          <p className="truncate text-[11px] font-bold text-[#6b5850]">{client.name}</p>

          <p className="mt-1 truncate text-[9px] text-[#b49b90]">{client.phone}</p>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-semibold text-[#80685e]">{client.lastAppointmentAt}</p>

        <p className="mt-1 text-[8px] text-[#c0aaa0]">último atendimento</p>
      </div>

      <div>
        {date ? (
          <>
            <p className="text-[10px] font-semibold text-[#80685e]">{date}</p>

            <p className="mt-1 text-[8px] text-[#c0aaa0]">{time}</p>
          </>
        ) : (
          <span className="text-[9px] text-[#c4b4ad]">Sem agendamento</span>
        )}
      </div>

      <div className="min-w-0 pr-4">
        <p className="truncate text-[10px] font-medium text-[#a48a7f]">
          {client.favoriteServices?.map((service) => service.name).join(', ') || 'Nenhum serviço'}
        </p>

        <p className="mt-1 text-[8px] text-[#c0aaa0]">mais utilizado</p>
      </div>

      <StatusBadge status={client.isActive} />

      <span
        className={[
          'inline-flex w-fit items-center rounded-full px-3 py-1.5 text-[8px] font-bold',
          client.inDebt ? 'bg-[#f8e7e3] text-[#a56f65]' : 'bg-[#eef3ef] text-[#819487]',
        ].join(' ')}
      >
        {client.inDebt ? 'Em dívida' : 'Sem dívida'}
      </span>

      <span className="flex h-8 w-8 items-center justify-center rounded-full text-[#d0beb5] transition-all group-hover:bg-[#f3e9e4] group-hover:text-[#a98d81]">
        <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}
