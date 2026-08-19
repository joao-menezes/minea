import { CalendarDays, ChevronRight } from 'lucide-react';

type Period = 'Hoje' | '7 dias' | 'Este mês' | 'Últimos 6 meses';

const PERIODS: Period[] = ['Hoje', '7 dias', 'Este mês', 'Últimos 6 meses'];

type Props = {
  period: Period;
  onChange: (period: Period) => void;
  label: string;
};

export function FinanceFilters({ period, onChange, label }: Props) {
  return (
    <section className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {PERIODS.map((item) => {
          const active = item === period;

          return (
            <button
              key={item}
              onClick={() => onChange(item)}
              className={[
                `rounded-full px-4 py-2 text-[9px] font-bold transition`,
                active
                  ? `bg-[#8a6f63] text-white`
                  : `border border-[#eee3dc] bg-white/70 text-[#aa9085]`,
              ].join(' ')}
            >
              {item}
            </button>
          );
        })}
      </div>

      <button className="flex w-fit items-center gap-2 rounded-full border border-[#eee3dc] bg-white/70 px-4 py-2 text-[9px] font-bold text-[#aa9085]">
        <CalendarDays size={12} />

        {label}

        <ChevronRight size={12} />
      </button>
    </section>
  );
}
