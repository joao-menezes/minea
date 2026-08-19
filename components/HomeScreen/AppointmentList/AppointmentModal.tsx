'use client';

import { useEffect, useState } from 'react';

import { ArrowUpRight, CalendarDays, Check, Clock3, MapPin, Sparkles, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Modal } from '@/components/Modal';
import type { Appointment } from '@/types';

type AppointmentModalProps = {
  appointment: Appointment | null;
  open: boolean;
  onClose: () => void;
  onSave?: (appointment: Appointment) => Promise<void>;
  onCancel?: (appointment: Appointment) => Promise<void>;
};

export function AppointmentModal({
  appointment,
  open,
  onClose,
  onSave,
  onCancel,
}: AppointmentModalProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!appointment) return;

    const appointmentDate = new Date(appointment.date);

    setDate(appointmentDate.toISOString().slice(0, 10));

    setTime(
      appointment.time?.slice(0, 5) ??
        appointmentDate.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
    );
  }, [appointment]);

  if (!appointment) return null;

  async function handleSave() {
    if (!onSave || !appointment || !date || !time) return;

    try {
      setSaving(true);
      setError('');

      const [year, month, day] = date.split('-').map(Number);
      const [hours, minutes] = time.split(':').map(Number);

      const newDate = new Date(year, month - 1, day, hours, minutes, 0, 0);

      await onSave({
        ...appointment,
        date: newDate.toISOString(),
        time,
      });
      toast.success('Agendamento atualizado com sucesso!');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar agendamento');
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel() {
    if (!onCancel || !appointment) return;

    try {
      setSaving(true);
      setError('');

      await onCancel(appointment);

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cancelar agendamento');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Seu agendamento"
      description="Confira ou altere os detalhes da sua reserva."
      size="md"
      contentClassName="bg-[#fdfaf8]"
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#e7ddd8] bg-white px-4 py-3 text-sm font-semibold text-[#705b53] transition hover:bg-[#faf6f3]"
          >
            Fechar
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#493a35] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3f322e]"
          >
            <Check size={16} />
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      }
    >
      <div className="space-y-5 p-6">
        {/* Service */}
        <div className="flex items-center gap-4 rounded-2xl border border-[#eadfd9] bg-white p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#f1e7e2] text-[#917066]">
            <Sparkles size={19} strokeWidth={1.6} />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#ad958b]">
              Serviço
            </p>

            <p className="mt-1 truncate text-sm font-bold text-[#54423c]">{appointment.title}</p>
          </div>
        </div>

        {/* Date */}
        <div>
          <label
            htmlFor="appointment-date"
            className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#907970]"
          >
            <CalendarDays size={13} />
            Data
          </label>

          <input
            id="appointment-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="h-12 w-full rounded-xl border border-[#e5dad5] bg-white px-4 text-sm font-medium text-[#54423c] outline-none transition focus:border-[#a8897e] focus:ring-2 focus:ring-[#d8c0b6]/30"
          />
        </div>

        {/* Time */}
        <div>
          <label
            htmlFor="appointment-time"
            className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#907970]"
          >
            <Clock3 size={13} />
            Horário
          </label>

          <input
            id="appointment-time"
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            className="h-12 w-full rounded-xl border border-[#e5dad5] bg-white px-4 text-sm font-medium text-[#54423c] outline-none transition focus:border-[#a8897e] focus:ring-2 focus:ring-[#d8c0b6]/30"
          />
        </div>

        {appointment.local && (
          <button
            type="button"
            onClick={() => {
              const destination = encodeURIComponent(appointment.local ?? '');
              window.open(
                `https://www.google.com/maps/search/?api=1&query=${destination}`,
                '_blank',
                'noopener,noreferrer',
              );
            }}
            className="group flex w-full items-center gap-3 rounded-xl bg-[#f4ece8] px-4 py-3.5 text-left transition-all hover:bg-[#efe4df] active:scale-[0.99]"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-white/70 text-[#98766b]">
              <MapPin size={16} strokeWidth={1.7} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#ad958b]">
                Local do atendimento
              </p>

              <p className="mt-0.5 truncate text-xs font-semibold text-[#68534b]">
                {appointment.local}
              </p>

              <div className="mt-1 flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-[#98766b]">Ver como chegar</span>

                <ArrowUpRight
                  size={11}
                  strokeWidth={2}
                  className="text-[#98766b] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </div>
            </div>
          </button>
        )}

        {/* Cancel */}
        {onCancel && (
          <div className="border-t border-[#eadfd9] pt-5">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-[#ead3cf] bg-[#fffafa] px-4 py-3 text-xs font-bold text-[#a45f59] transition hover:border-[#dfbcb7] hover:bg-[#fff4f2]"
            >
              <Trash2 size={15} className="transition-transform group-hover:scale-105" />
              Cancelar agendamento
            </button>

            <p className="mt-2 text-center text-[9px] text-[#aa9188]">
              Essa ação não poderá ser desfeita.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
