import { ArrowUpRight, CalendarDays } from 'lucide-react';

type Props = {
  onSchedule?: () => void;
  onHistory?: () => void;
};

export function ClientActions({ onSchedule, onHistory }: Props) {
  return (
    <div className="mt-5 flex flex-col gap-2 sm:flex-row">
      <button
        type="button"
        onClick={onSchedule}
        className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[15px] bg-[#8a6f63] text-[10px] font-bold text-white transition hover:bg-[#7c6156] active:scale-[.985]"
      >
        <CalendarDays size={14} />
        Novo agendamento
      </button>

      <button
        type="button"
        onClick={onHistory}
        className="flex h-11 items-center justify-center gap-2 rounded-[15px] border border-[#eee2dc] bg-white px-4 text-[10px] font-bold text-[#a98d81] transition hover:bg-[#faf4f1] sm:w-11 sm:px-0"
      >
        <ArrowUpRight size={15} />

        <span className="sm:hidden">Ver histórico</span>
      </button>
    </div>
  );
}
