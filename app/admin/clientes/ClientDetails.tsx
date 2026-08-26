import { useEffect, useState } from 'react';

import { updateUserStatus } from '@/lib/api/clients';
import type { Client } from '@/types';
import { maskCPF, maskDate } from '@/utils/utils';

type Props = {
  client: Client;
  onClientUpdated: (client: Client) => void;
};

export function ClientDetails({ client, onClientUpdated }: Props) {
  const [isActive, setIsActive] = useState(client.isActive);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    setIsActive(client.isActive);
  }, [client.id, client.isActive]);

  const lastAppointment = client.lastAppointmentAt ? new Date(client.lastAppointmentAt) : null;

  const formattedLastAppointment = lastAppointment
    ? lastAppointment.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : 'Nenhum atendimento';

  async function handleToggleStatus() {
    if (updatingStatus) return;

    const newStatus = !isActive;

    try {
      setUpdatingStatus(true);

      await updateUserStatus(client.id, newStatus);

      setIsActive(newStatus);

      onClientUpdated({
        ...client,
        isActive: client.isActive,
      });
    } catch (error) {
      console.error('Erro ao alterar status do cliente:', error);
    } finally {
      setUpdatingStatus(false);
    }
  }

  const favoriteServices =
    client.favoriteServices?.map((service) => service.name).join(', ') || 'Nenhum serviço';

  const details = [
    {
      label: 'Telefone',
      value: client.phone || 'Não informado',
    },
    {
      label: 'Atendimentos',
      value: `${client.appointments} ${client.appointments === 1 ? 'vez' : 'vezes'}`,
    },
    {
      label: 'Último atendimento',
      value: formattedLastAppointment,
    },
    {
      label: 'Serviço favorito',
      value: favoriteServices,
    },
    {
      label: 'CPF',
      value: client.cpf ? maskCPF(client.cpf) : 'Não informado',
    },
    {
      label: 'Aniversário',
      value: client.birthDate ? maskDate(client.birthDate) : 'Não informado',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {details.map((detail) => (
          <DetailItem key={detail.label} label={detail.label} value={detail.value} />
        ))}
      </div>

      <div className="flex items-center justify-between rounded-[17px] bg-[#faf6f3] p-3">
        <div>
          <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#c2a99d]">Status</p>

          <p className="mt-1.5 text-[10px] font-semibold text-[#80685e]">
            {isActive ? 'Cliente ativo' : 'Cliente inativo'}
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isActive}
          aria-label={isActive ? 'Desativar cliente' : 'Ativar cliente'}
          disabled={updatingStatus}
          onClick={handleToggleStatus}
          className={[
            'relative h-7 w-12 rounded-full p-1',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[#cbb1a6]/40',
            'disabled:cursor-not-allowed disabled:opacity-60',
            isActive ? 'bg-[#a98d81]' : 'bg-[#d8cbc5]',
          ].join(' ')}
        >
          <span
            className={[
              'block h-5 w-5 rounded-full bg-white shadow-sm',
              'transition-transform duration-200',
              isActive ? 'translate-x-5' : 'translate-x-0',
            ].join(' ')}
          />
        </button>
      </div>
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
    <div
      className={['rounded-[17px] bg-[#faf6f3] p-3', full && 'w-full'].filter(Boolean).join(' ')}
    >
      <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#c2a99d]">{label}</p>

      <p className="mt-1.5 truncate text-[10px] font-semibold text-[#80685e]">{value}</p>
    </div>
  );
}
