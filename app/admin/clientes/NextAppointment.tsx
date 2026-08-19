'use client';

import { CalendarDays } from 'lucide-react';

type Props = {
  appointment?: string | null;
};

export function NextAppointment({ appointment }: Props) {
  if (!appointment) return null;

  const date = new Date(appointment);

  if (Number.isNaN(date.getTime())) return null;

  const formattedDate = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const formattedTime = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <section className="mt-4 rounded-[21px] bg-[#f6ede8] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-white text-[#a98d81]">
          <CalendarDays size={16} />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-bold text-[#80685e]">Atendimento</p>

          <p className="mt-1 text-[10px] text-[#b49b90]">
            {formattedDate} · {formattedTime}
          </p>
        </div>
      </div>
    </section>
  );
}
