'use client';

import { useState } from 'react';

import { CalendarDays, Clock3 } from 'lucide-react';

import { BaseModal } from '@/components/BaseModal';
import { getAppointments } from '@/lib/api/appointments';
import type { Appointment, Client } from '@/types';
import { getAppointmentStatusLabel } from '@/utils/utils';

import { ClientActions } from './ClientActions';
import { ClientDetails } from './ClientDetails';
import { ClientModalHeader } from './ClientModalHeader';
import { NextAppointment } from './NextAppointment';

type Props = {
  client: Client;
  currentUserId?: string | null;
  onClose: () => void;
  onClientUpdated: (client: Client) => void;
  onSchedule: (client: Client) => void;
};

export function ClientModal({
  client,
  currentUserId,
  onClose,
  onClientUpdated,
  onSchedule,
}: Props) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [history, setHistory] = useState<Appointment[]>([]);

  async function handleHistory() {
    setHistoryOpen(true);
    setHistoryLoading(true);
    setHistoryError('');

    try {
      const appointments = await getAppointments(client.id);
      setHistory(appointments);
    } catch (error) {
      console.error('Erro ao carregar histórico do cliente:', error);
      setHistoryError(
        error instanceof Error ? error.message : 'Não foi possível carregar o histórico.',
      );
    } finally {
      setHistoryLoading(false);
    }
  }

  return (
    <>
      <BaseModal
        open={!historyOpen}
        onClose={onClose}
        showCloseButton={false}
        className="rounded-t-[30px] shadow-[0_30px_80px_-30px_rgba(64,46,40,.4)] sm:rounded-[30px]"
        backdropClassName="bg-[#493b36]/20 backdrop-blur-sm"
      >
        <ClientModalHeader client={client} onClose={onClose} />

        <div className="min-h-0 overflow-y-auto p-5 sm:p-6">
          <ClientDetails
            client={client}
            currentUserId={currentUserId}
            onClientUpdated={onClientUpdated}
          />

          {client.lastAppointmentAt && <NextAppointment appointment={client.lastAppointmentAt} />}

          <ClientActions onSchedule={() => onSchedule(client)} onHistory={handleHistory} />
        </div>
      </BaseModal>

      <BaseModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        className="max-h-[85vh] overflow-hidden rounded-t-[30px] sm:rounded-[30px]"
      >
        <div className="border-b border-[#eee4df] px-5 py-4 sm:px-6">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#c2a99d]">
            Histórico
          </p>
          <h2 className="mt-1 font-display text-[25px] leading-none text-[#6b5850]">
            {client.name}
          </h2>
        </div>
        <div className="max-h-[65vh] overflow-y-auto p-5 sm:p-6">
          {historyLoading && (
            <p className="py-10 text-center text-xs text-[#a48a7f]">Carregando histórico...</p>
          )}

          {historyError && (
            <p className="rounded-[14px] bg-[#fbefed] px-3 py-2 text-[10px] text-[#9b5d53]">
              {historyError}
            </p>
          )}

          {!historyLoading && !historyError && history.length === 0 && (
            <div className="py-10 text-center">
              <CalendarDays size={24} className="mx-auto text-[#c2a99d]" />
              <p className="mt-3 text-xs font-bold text-[#80685e]">Nenhum agendamento</p>
              <p className="mt-1 text-[10px] text-[#b49b90]">
                Este cliente ainda não possui atendimentos.
              </p>
            </div>
          )}

          {!historyLoading && !historyError && history.length > 0 && (
            <div className="space-y-2">
              {history
                .slice()
                .sort((first, second) => {
                  return new Date(second.date).getTime() - new Date(first.date).getTime();
                })
                .map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center gap-3 rounded-[17px] bg-[#faf6f3] p-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-white text-[#ab8f83]">
                      <CalendarDays size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-bold text-[#80685e]">
                        {appointment.title}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-[9px] text-[#b49b90]">
                        <span>{new Date(appointment.date).toLocaleDateString('pt-BR')}</span>
                        <span>•</span>
                        <Clock3 size={11} />
                        <span>{appointment.time?.slice(0, 5)}</span>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[8px] font-bold text-[#907970]">
                      {getAppointmentStatusLabel(appointment.status)}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </BaseModal>
    </>
  );
}
