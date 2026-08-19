import { CalendarDays, Clock3, MapPin, X } from 'lucide-react';

import type { Appointment } from '@/types';

type Props = {
  appointment: Appointment;
  onClose: () => void;
};

export function AppointmentDetails({ appointment, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 backdrop-blur-sm lg:items-center">
      <div className="w-full max-w-lg rounded-t-[35px] bg-white p-7 shadow-2xl lg:rounded-[35px]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[.3em] text-[#c2a99d]">Atendimento</p>

            <h2 className="mt-2 font-display text-[30px] text-[#6b5850]">{appointment.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#faf4f1] text-[#a98d81]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-7 space-y-4">
          <Info
            icon={<CalendarDays size={16} />}
            label="Cliente"
            value={appointment.clientName ?? '-'}
          />

          <Info
            icon={<Clock3 size={16} />}
            label="Duração"
            value={`${appointment.duration} minutos`}
          />

          <Info icon={<MapPin size={16} />} label="Local" value={appointment.local} />
        </div>

        <div className="mt-7 rounded-[20px] bg-[#faf6f3] p-5">
          <p className="text-[10px] uppercase tracking-widest text-[#b49b90]">Valor</p>

          <p className="mt-2 text-[25px] font-bold text-[#6b5850]">
            R$ {appointment.price.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#faf4f1] text-[#a98d81]">
        {icon}
      </div>

      <div>
        <p className="text-[9px] uppercase text-[#c2a99d]">{label}</p>

        <p className="text-sm text-[#80685e]">{value}</p>
      </div>
    </div>
  );
}
