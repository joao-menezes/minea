import { Clock3, MapPin } from 'lucide-react';

import type { Appointment } from '@/types';
import { getAppointmentStatusLabel } from '@/utils/utils';

type AppointmentRowProps = {
  appointment: Appointment;
  onClick: () => void;
};

const STATUS_STYLE = {
  scheduled: 'bg-[#f7eee9] text-[#96766b]',
  confirmed: 'bg-[#edf4ed] text-[#6f8b73]',
  completed: 'bg-[#f0ebf5] text-[#806b9a]',
  cancelled: 'bg-[#fbefed] text-[#aa665f]',
  no_show: 'bg-[#f5f0ee] text-[#947d76]',
};

export function AppointmentRow({ appointment, onClick }: AppointmentRowProps) {
  const time = appointment.time?.slice(0, 5) || '--:--';

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative z-[1] grid w-full grid-cols-[48px_1fr] gap-4 rounded-xl py-2 text-left transition-colors hover:bg-[#faf6f3]"
    >
      <div className="relative flex flex-col items-end pt-3">
        <span className="text-[11px] font-semibold tabular-nums text-[#705b53]">{time}</span>
        <span className="mt-1 text-[9px] text-[#b49b90]">{appointment.duration} min</span>
      </div>

      <div className="relative flex min-h-[82px] items-center gap-3 rounded-lg border border-[#eadfd9] bg-white px-4 py-3 shadow-[0_4px_10px_-9px_rgba(91,63,55,.4)] transition group-hover:border-[#d6c2b9]">
        <div
          className="h-12 w-1 shrink-0 rounded-full"
          style={{ backgroundColor: appointment.cor || '#98a2b3' }}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-[13px] font-semibold text-[#54423c]">
              {appointment.clientName ?? 'Cliente'}
            </h3>
            <span className={`rounded-full px-2 py-1 text-[8px] font-semibold uppercase ${STATUS_STYLE[appointment.status]}`}>
              {getAppointmentStatusLabel(appointment.status)}
            </span>
          </div>
          <p className="mt-1 truncate text-[11px] text-[#80685e]">{appointment.title}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-[#ad958b]">
            <span className="flex items-center gap-1"><Clock3 size={11} />{appointment.duration} min</span>
            <span className="flex items-center gap-1 truncate"><MapPin size={11} />{appointment.local}</span>
          </div>
        </div>

        <p className="shrink-0 text-[11px] font-semibold text-[#475467]">
          R$ {Number(appointment.price).toFixed(2)}
        </p>
      </div>
    </button>
  );
}
