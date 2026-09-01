'use client';

import { useEffect, useState } from 'react';

import {
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  Pencil,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

import { CustomCalendar } from '@/components/CustomCalendar';
import { CustomTimePicker, DEFAULT_TIMES } from '@/components/CustomTimePicker';
import { Modal } from '@/components/Modal';
import { updateAppointment } from '@/lib/api/appointments';
import type { Appointment } from '@/types';
import { getAppointmentStatusLabel } from '@/utils/utils';

type AppointmentModalProps = {
  appointment: Appointment | null;
  open: boolean;
  onClose: () => void;
  onSave?: (appointment: Appointment) => Promise<void>;
  onCancel?: (appointment: Appointment) => Promise<void>;
  onComplete?: (appointment: Appointment) => Promise<void>;
  onApprove?: (appointment: Appointment) => Promise<void>;
  isAdmin?: boolean;
};

export function AppointmentModal({
  appointment,
  open,
  onClose,
  onSave,
  onCancel,
  onComplete,
  onApprove,
  isAdmin = false,
}: AppointmentModalProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const isLocked =
    (!isAdmin && appointment?.status === 'completed') || appointment?.status === 'cancelled';

  async function handleApprove() {
    if (!onApprove || !appointment) return;

    try {
      setSaving(true);
      setError('');

      await onApprove(appointment);
      toast.success('Agendamento aprovado com sucesso!');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao aprovar agendamento');
    } finally {
      setSaving(false);
    }
  }

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
    setEditing(false);
    setError('');
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
      toast.success('Agendamento Cancelado com sucesso!');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cancelar agendamento');
    } finally {
      setSaving(false);
    }
  }

  async function handleComplete() {
    if (!onComplete || !appointment) return;

    try {
      setSaving(true);
      setError('');

      await onComplete(appointment);
      toast.success('Consulta marcada como concluída!');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao concluir agendamento');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="Seu agendamento"
        description="Confira ou altere os detalhes da reserva."
        size="lg"
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

            {onSave && !isLocked && (
              <button
                type="button"
                onClick={() => (editing ? handleSave() : setEditing(true))}
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#493a35] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3f322e]"
              >
                {editing ? <Check size={16} /> : <Pencil size={15} />}
                {editing ? (saving ? 'Salvando...' : 'Salvar alterações') : 'Editar agendamento'}
              </button>
            )}
          </div>
        }
      >
        <div className="space-y-5 p-6">
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
          <div className="mt-2 h-px w-full bg-[#e8dfdb]" />
          {editing ? (
            <>
              <CustomCalendar
                value={date ? parseDate(date) : null}
                referenceDate={date ? parseDate(date) : new Date()}
                onChange={(selectedDate) => setDate(formatDate(selectedDate))}
              />

              <CustomTimePicker
                value={time || null}
                options={Array.from(new Set([...DEFAULT_TIMES, time].filter(Boolean)))}
                onChange={setTime}
              />

              <button
                type="button"
                onClick={() => setEditing(false)}
                disabled={saving}
                className="w-full rounded-xl border border-[#e7ddd8] bg-white px-4 py-3 text-sm font-semibold text-[#705b53] transition hover:bg-[#faf6f3] disabled:opacity-60"
              >
                Cancelar edição
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <DetailRow
                icon={<CalendarDays size={16} />}
                label="Data"
                value={formatDisplayDate(date)}
              />
              <DetailRow icon={<Clock3 size={16} />} label="Horário" value={time} />
              <DetailRow
                icon={<Check size={16} />}
                label="Status"
                value={getAppointmentStatusLabel(appointment.status)}
              />
            </div>
          )}
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

          {onApprove && appointment.status === 'scheduled' && (
            <button
              type="button"
              onClick={handleApprove}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#cfe0d1] bg-[#f5fbf5] px-4 py-3 text-xs font-bold text-[#64836a] transition hover:border-[#b6d1ba] hover:bg-[#edf8ee] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Check size={15} />
              {saving ? 'Aprovando...' : 'Aprovar agendamento (sinal recebido)'}
            </button>
          )}

          {onComplete &&
            appointment.status !== 'completed' &&
            appointment.status !== 'cancelled' && (
              <button
                type="button"
                onClick={handleComplete}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#cfe0d1] bg-[#f5fbf5] px-4 py-3 text-xs font-bold text-[#64836a] transition hover:border-[#b6d1ba] hover:bg-[#edf8ee] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Check size={15} />
                {saving ? 'Atualizando...' : 'Marcar como concluído'}
              </button>
            )}
          {onCancel && appointment.status !== 'completed' && (
            <div className="border-t border-[#eadfd9] pt-5">
              <button
                type="button"
                onClick={() => setConfirmCancel(true)}
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

      <Modal
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        title="Cancelar agendamento?"
        description="Essa ação não poderá ser desfeita."
        size="sm"
        contentClassName="bg-[#fdfaf8]"
        footer={
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setConfirmCancel(false)}
              disabled={saving}
              className="flex-1 rounded-xl border border-[#e7ddd8] bg-white px-4 py-3 text-sm font-semibold text-[#705b53] transition hover:bg-[#faf6f3] disabled:opacity-60"
            >
              Voltar
            </button>

            <button
              type="button"
              onClick={async () => {
                setConfirmCancel(false);
                await handleCancel();
              }}
              disabled={saving}
              className="flex-1 rounded-xl bg-[#a45f59] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#914f4a] disabled:opacity-60"
            >
              {saving ? 'Cancelando...' : 'Confirmar cancelamento'}
            </button>
          </div>
        }
      >
        <div className="px-6 py-5">
          <p className="text-sm leading-relaxed text-[#705b53]">
            Tem certeza que deseja cancelar o agendamento de <strong>{appointment.title}</strong>?
          </p>
        </div>
      </Modal>
    </>
  );
}

function parseDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value: string): string {
  if (!value) return '-';

  return parseDate(value).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#eadfd9] bg-white p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1e7e2] text-[#917066]">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#ad958b]">{label}</p>
        <p className="mt-1 text-sm font-semibold capitalize text-[#54423c]">{value || '-'}</p>
      </div>
    </div>
  );
}
