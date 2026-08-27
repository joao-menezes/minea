import { Clock3, MapPin } from 'lucide-react';

import type { Appointment } from '@/types';
import { getAppointmentStatusLabel } from '@/utils/utils';

type AppointmentRowProps = {
  appointment: Appointment;
  onClick: () => void;
};

const STATUS_STYLE = {
  scheduled: 'bg-[#f5ebe4] text-[#9b796b]',
  confirmed: 'bg-[#e8f1e9] text-[#6c8b70]',
  completed: 'bg-[#ece7f4] text-[#806b9a]',
  cancelled: 'bg-[#fae8e5] text-[#b56d63]',
  no_show: 'bg-[#f4eeee] text-[#9d8580]',
};

export function AppointmentRow({ appointment, onClick }: AppointmentRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 rounded-[18px] py-5 text-left transition-all hover:bg-[#faf6f3] hover:px-3"
    >
      <div className="flex items-center gap-4">
        <div
          className="h-12 w-1 rounded-full"
          style={{
            backgroundColor: appointment.cor,
          }}
        />

        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-[17px] text-[#6b5850]">
              {appointment.clientName ?? 'Cliente'}
            </h3>

            <span
              className={`rounded-full px-2 py-1 text-[8px] font-bold uppercase ${STATUS_STYLE[appointment.status]} `}
            >
              {getAppointmentStatusLabel(appointment.status)}
            </span>
          </div>

          <p className="mt-1 text-[11px] text-[#a48a7f]">{appointment.title}</p>

          <div className="mt-3 flex items-center gap-4 text-[10px] text-[#b49b90]">
            <span className="flex items-center gap-1">
              <Clock3 size={12} />
              {appointment.duration} min
            </span>

            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {appointment.local}
            </span>
          </div>
        </div>
      </div>

      <div className="text-right">
        <p className="text-[12px] font-bold text-[#80685e]">
          {new Intl.DateTimeFormat('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date(appointment.date))}
        </p>

        <p className="mt-1 text-[11px] text-[#b49b90]">R$ {appointment.price.toFixed(2)}</p>
      </div>
    </button>
  );
}
