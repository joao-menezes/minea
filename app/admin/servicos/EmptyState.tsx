import { Search } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#f5ebe7] text-[#aa8b80]">
        <Search size={20} strokeWidth={1.5} />
      </div>

      <p className="mt-5 font-display text-[24px] text-[#80665c]">Nenhum serviço encontrado</p>

      <p className="mx-auto mt-2 max-w-xs text-[10px] leading-relaxed text-[#b39a90]">
        Não encontramos serviços para a busca realizada. Experimente outro termo.
      </p>
    </div>
  );
}
