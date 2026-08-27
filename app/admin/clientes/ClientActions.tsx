import { ArrowUpRight, CalendarDays } from 'lucide-react';

type Props = {
  onSchedule?: () => void;
  onHistory?: () => void;
};

export function ClientActions({ onSchedule, onHistory }: Props) {
  return (
    <div className="mt-5 flex w-full flex-col gap-2 sm:flex-row">
      <button
        type="button"
        onClick={onSchedule}
        className="flex h-14 min-h-14 w-full shrink-0 items-center justify-center gap-2 rounded-[17px] bg-[#8a6f63] px-4 text-xs font-bold text-white shadow-[0_12px_25px_-15px_rgba(138,111,99,.65)] transition hover:bg-[#7c6156] active:scale-[.985] sm:h-11 sm:min-h-11 sm:flex-1 sm:rounded-[15px] sm:px-3 sm:text-[10px] sm:shadow-none"
      >
        <CalendarDays size={17} />
        Novo agendamento
      </button>

      <button
        type="button"
        onClick={onHistory}
        className="flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-[15px] border border-[#eee2dc] bg-white px-4 text-[10px] font-bold text-[#a98d81] transition hover:bg-[#faf4f1] active:scale-[.985] sm:h-11 sm:w-11 sm:px-0"
      >
        <ArrowUpRight size={15} />

        <span className="sm:hidden">Ver histórico</span>
      </button>
    </div>
  );
}
