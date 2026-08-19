import { ChevronRight, Clock3, MapPin, Sparkles } from 'lucide-react';

import { formatDate, formatTimeData } from '@/components/decor';
import type { Appointment } from '@/types';

type AppointmentCardProps = {
  appointment: Appointment;
  onClick: () => void;
};

export function AppointmentCard({ appointment, onClick }: AppointmentCardProps) {
  console.log(appointment);
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-[25px] border border-[#f1e8e2] bg-white/90 p-4 text-left shadow-[0_13px_30px_-25px_rgba(64,46,40,.3)] backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[#ecdfd7] hover:shadow-[0_18px_34px_-24px_rgba(64,46,40,.35)]"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[17px] bg-[#f6ede8] text-[#ab8f83]">
        <Sparkles size={18} strokeWidth={1.6} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-bold text-[#6b5850]">
          {appointment.title} | {appointment.duration} Min
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="flex items-center gap-1 text-[10px] text-[#b49b90]">
            <Clock3 size={11} />
            {formatDate(appointment.date)} | {formatTimeData(appointment.time)}
          </span>

          {appointment.local && (
            <span className="flex min-w-0 items-center gap-1 truncate text-[10px] text-[#b49b90]">
              <MapPin size={11} />
              {appointment.local}
            </span>
          )}
        </div>
      </div>

      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#c9b6ac] transition-all group-hover:bg-[#faf4f1] group-hover:text-[#a98d81]">
        <ChevronRight size={16} />
      </span>
    </button>
  );
}
