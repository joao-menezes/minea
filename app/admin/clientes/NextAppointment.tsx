import { CalendarDays } from 'lucide-react';

import { getAppointmentParts } from '@/lib/clients';

type Props = {
  appointment: string;
};

export function NextAppointment({ appointment }: Props) {
  const { date, time } = getAppointmentParts(appointment);

  if (!date) return null;

  return (
    <section className="mt-4 rounded-[21px] bg-[#f6ede8] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-white text-[#a98d81]">
          <CalendarDays size={16} />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-bold text-[#80685e]">Próximo atendimento</p>

          <p className="mt-1 text-[10px] text-[#b49b90]">
            {date}
            {time && ` · ${time}`}
          </p>
        </div>
      </div>
    </section>
  );
}
