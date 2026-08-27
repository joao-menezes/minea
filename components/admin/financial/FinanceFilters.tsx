import { CalendarDays, ChevronRight } from 'lucide-react';

export type Period = 'Hoje' | '7 dias' | 'Este mês' | 'Últimos 6 meses';

const PERIODS: Period[] = ['Hoje', '7 dias', 'Este mês', 'Últimos 6 meses'];

type Props = {
  period: Period;
  onChange: (period: Period) => void;
  label: string;
  month: string;
  onMonthChange: (month: string) => void;
};

export function FinanceFilters({ period, onChange, label, month, onMonthChange }: Props) {
  const monthLabel = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${month}-01T12:00:00`));

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

      <label
        title={label}
        className="relative flex w-fit cursor-pointer items-center gap-2 rounded-full border border-[#eee3dc] bg-white/70 px-4 py-2 text-[9px] font-bold text-[#aa9085]"
      >
        <CalendarDays size={12} />

        <span className="capitalize">{monthLabel}</span>

        <ChevronRight size={12} />

        <input
          type="month"
          value={month}
          onChange={(event) => {
            if (event.target.value) onMonthChange(event.target.value);
          }}
          aria-label="Selecionar mês do relatório"
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </label>
    </section>
  );
}
