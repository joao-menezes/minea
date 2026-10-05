import { useEffect, useState } from 'react';

import { Gift, QrCode, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { LoyaltyQrModal } from '@/components/LoyaltyQrModal';
import { updateUserStatus } from '@/lib/api/clients';
import { ApiRequestError } from '@/lib/api/client';
import { getUserLoyaltyStatus, redeemLoyaltyReward } from '@/lib/api/loyalty';
import type { Client, LoyaltyStatus } from '@/types';
import { formatPhoneNumber, maskDate } from '@/utils/utils';

type Props = {
  client: Client;
  currentUserId?: string | null;
  onClientUpdated: (client: Client) => void;
};

export function ClientDetails({ client, currentUserId, onClientUpdated }: Props) {
  const [isActive, setIsActive] = useState(client.isActive);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [loyalty, setLoyalty] = useState<LoyaltyStatus | null>(null);
  const [redeemingReward, setRedeemingReward] = useState(false);
  const [showLoyaltyQr, setShowLoyaltyQr] = useState(false);

  useEffect(() => {
    setIsActive(client.isActive);
  }, [client.id, client.isActive]);

  useEffect(() => {
    setLoyalty(null);
    void loadLoyalty();
  }, [client.id]);

  async function loadLoyalty() {
    try {
      setLoyalty(await getUserLoyaltyStatus(client.id));
    } catch (error) {
      console.error('Erro ao carregar fidelidade:', error);
    }
  }

  function handleCloseLoyaltyQr() {
    setShowLoyaltyQr(false);
    void loadLoyalty();
  }

  async function handleRedeemReward() {
    if (redeemingReward) return;

    try {
      setRedeemingReward(true);
      const updated = await redeemLoyaltyReward(client.id);
      setLoyalty(updated);
      toast.success('Recompensa marcada como entregue!');
    } catch (error) {
      toast.error(
        error instanceof ApiRequestError ? error.message : 'Não foi possível resgatar a recompensa.',
      );
    } finally {
      setRedeemingReward(false);
    }
  }

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

      const updatedClient = await updateUserStatus(client.id, newStatus);

      setIsActive(newStatus);

      onClientUpdated({
        ...client,
        ...updatedClient,
        isActive: newStatus,
      });
      toast.success(newStatus ? 'Cliente ativado com sucesso!' : 'Cliente desativado com sucesso!');
    } catch (error) {
      console.error('Erro ao alterar status do cliente:', error);
      toast.error(
        error instanceof Error ? error.message : 'Não foi possível alterar o status do cliente.',
      );
    } finally {
      setUpdatingStatus(false);
    }
  }

  const favoriteServices =
    client.favoriteServices?.map((service) => service.name).join(', ') || 'Nenhum serviço';

  const details = [
    {
      label: 'Telefone',
      value: formatPhoneNumber(client.phoneNumber) || 'Não informado',
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
          disabled={updatingStatus || client.id === currentUserId}
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

      {loyalty && (
        <div className="rounded-[17px] bg-[#faf6f3] p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] bg-[#f6ede8] text-[#ab8f83]">
                <Sparkles size={13} strokeWidth={1.7} />
              </div>

              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#c2a99d]">
                  Fidelidade
                </p>

                <p className="mt-1 text-[10px] font-semibold text-[#80685e]">
                  {loyalty.progress}/{loyalty.pointsPerReward} pontos · {loyalty.points} no total
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {loyalty.rewardsAvailable > 0 && (
                <button
                  type="button"
                  onClick={handleRedeemReward}
                  disabled={redeemingReward}
                  className="flex items-center gap-1.5 rounded-full bg-[#8a6f63] px-3 py-1.5 text-[9px] font-bold text-white transition hover:bg-[#7c6156] disabled:opacity-60"
                >
                  <Gift size={11} />
                  {redeemingReward ? 'Resgatando...' : `Resgatar (${loyalty.rewardsAvailable})`}
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowLoyaltyQr(true)}
                className="flex items-center gap-1.5 rounded-full border border-[#e2d3cc] bg-white px-3 py-1.5 text-[9px] font-bold text-[#8a6f63] transition hover:bg-[#f6ede8]"
              >
                <QrCode size={11} />
                Gerar QR
              </button>
            </div>
          </div>

          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-[#8a6f63] transition-all"
              style={{ width: `${(loyalty.progress / loyalty.pointsPerReward) * 100}%` }}
            />
          </div>
        </div>
      )}

      <LoyaltyQrModal
        userId={client.id}
        clientName={client.name}
        open={showLoyaltyQr}
        onClose={handleCloseLoyaltyQr}
      />
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
