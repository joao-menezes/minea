import { maskCPF, maskDate } from '@/components/decor';
import type { Client } from '@/types/client';

type Props = {
  client: Client;
};

export function ClientDetails({ client }: Props) {
  const details = [
    {
      label: 'Telefone',
      value: client.phone,
    },
    {
      label: 'Atendimentos',
      value: `${client.appointments} vezes`,
    },
    {
      label: 'Último atendimento',
      value: client.lastAppointment,
    },
    {
      label: 'Serviço favorito',
      value: client.favoriteService,
    },
    {
      label: 'CPF',
      value: maskCPF(client.cpf),
    },
    {
      label: 'Aniversário',
      value: maskDate(client.birthday),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {details.map((detail) => (
          <DetailItem key={detail.label} label={detail.label} value={detail.value} />
        ))}
      </div>

      <DetailItem label="E-mail" value={client.email} full />
    </div>
  );
}

function DetailItem({
  label,
  value,
  full = false,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={['rounded-[17px] bg-[#faf6f3] p-3', full && 'w-full'].join(' ')}>
      <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#c2a99d]">{label}</p>

      <p className="mt-1.5 truncate text-[10px] font-semibold text-[#80685e]">{value}</p>
    </div>
  );
}
