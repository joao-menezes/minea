'use client';

import { CalendarDays, Clock3, X } from 'lucide-react';

import type { Appointment } from '@/types';
import { getAppointmentStatusLabel } from '@/utils/utils';

type AppointmentHistoryModalProps = {
  appointments: Appointment[];
  onClose: () => void;
};

export function AppointmentHistoryModal({
  appointments,
  onClose,
}: AppointmentHistoryModalProps) {
  const orderedAppointments = appointments
    .slice()
    .sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime());

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[#332925]/35 p-0 backdrop-blur-[5px] sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="max-h-[88vh] w-full max-w-md overflow-hidden rounded-t-[30px] bg-[#faf6f3] shadow-[0_30px_80px_-30px_rgba(40,29,25,.55)] sm:rounded-[30px]">
        <header className="flex items-center justify-between border-b border-[#eee4df] px-5 py-5">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#c2a99d]">
              Minea
            </p>
            <h2 className="mt-1 font-display text-[27px] leading-none text-[#6b5850]">
              Histórico de procedimentos
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar histórico"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#a98d81] transition hover:bg-[#f3eae5]"
          >
            <X size={16} />
          </button>
        </header>

        <div className="max-h-[68vh] overflow-y-auto p-5">
          {orderedAppointments.length === 0 ? (
            <div className="py-10 text-center">
              <CalendarDays size={25} className="mx-auto text-[#c2a99d]" />
              <p className="mt-3 text-xs font-bold text-[#80685e]">Nenhum procedimento encontrado</p>
              <p className="mt-1 text-[10px] text-[#b49b90]">
                Seus agendamentos aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {orderedAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center gap-3 rounded-[18px] border border-[#eee4df] bg-white/75 p-3"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#f3eae5] text-[#a98d81]">
                    <CalendarDays size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-bold text-[#6b5850]">
                      {appointment.title}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-[9px] text-[#b49b90]">
                      <span>{new Date(appointment.date).toLocaleDateString('pt-BR')}</span>
                      <span>•</span>
                      <Clock3 size={11} />
                      <span>{appointment.time?.slice(0, 5)}</span>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#f3eae5] px-2 py-1 text-[8px] font-bold text-[#907970]">
                    {getAppointmentStatusLabel(appointment.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
