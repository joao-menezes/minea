import { CalendarDays } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#faf4f1] text-[#c2a99d]">
        <CalendarDays size={22} />
      </div>

      <h3 className="mt-4 font-display text-xl text-[#80685e]">Agenda livre</h3>

      <p className="mt-2 max-w-xs text-xs text-[#b49b90]">
        Nenhum atendimento encontrado para este dia.
      </p>
    </div>
  );
}
