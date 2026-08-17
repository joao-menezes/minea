import { CalendarDays } from 'lucide-react';

import { MONTHS, WEEKDAYS, sameDay } from '@/components/decor';

type AppointmentCalendarProps = {
  selected: Date;
  week: Date[];
  appointmentCount: number;
  onSelect: (date: Date) => void;
};

export function AppointmentCalendar({
  selected,
  week,
  appointmentCount,
  onSelect,
}: AppointmentCalendarProps) {
  return (
    <section className="mt-9">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#c7b0a6]">
            Sua agenda
          </p>

          <h2 className="mt-2 font-display text-[27px] leading-none tracking-[-0.02em] text-[#6b5850]">
            {selected.getDate()} de {MONTHS[selected.getMonth()]}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 pb-0.5 text-[#b49b90]">
          <CalendarDays size={13} strokeWidth={1.7} />

          <span className="text-[9px] font-bold uppercase tracking-wide">
            {appointmentCount} {appointmentCount === 1 ? 'agendamento' : 'agendamentos'}
          </span>
        </div>
      </div>

      <div className="rounded-[28px] border border-[#f1e8e2] bg-white/85 p-2 shadow-[0_18px_40px_-30px_rgba(64,46,40,.2)] backdrop-blur">
        <div className="flex justify-between">
          {week.map((day) => {
            const isSelected = sameDay(day, selected);
            const isToday = sameDay(day, new Date());

            return (
              <button
                type="button"
                key={day.toISOString()}
                onClick={() => onSelect(day)}
                className={[
                  'relative flex h-[66px] w-[42px] flex-col items-center justify-center rounded-[19px] transition-all',
                  isSelected
                    ? 'bg-[#a98d81] text-white shadow-[0_10px_22px_-11px_rgba(169,141,129,.6)]'
                    : 'text-[#ab948a] hover:bg-[#f9f4f1]',
                ].join(' ')}
              >
                <span
                  className={[
                    'text-[8px] font-bold uppercase tracking-[0.08em]',
                    isSelected ? 'text-white/70' : 'text-[#c9b6ac]',
                  ].join(' ')}
                >
                  {WEEKDAYS[day.getDay()]}
                </span>

                <span className="mt-1 text-[15px] font-semibold">{day.getDate()}</span>

                {isToday && !isSelected && (
                  <span className="absolute bottom-2 h-1 w-1 rounded-full bg-[#d4b6a8]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
