'use client';

import { Search, X } from 'lucide-react';

import { ClientFilter } from '@/types/client';

type Props = {
  search: string;
  status: ClientFilter;
  count: number;
  onSearch: (value: string) => void;
  onStatus: (value: ClientFilter) => void;
};

const FILTERS: ClientFilter[] = ['Todos', 'Ativa', 'Inativa'];

export function ClientToolbar({ search, status, count, onSearch, onStatus }: Props) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#c2a99d]">
          Base de clientes
        </p>

        <div className="mt-2 flex items-center gap-3">
          <h2 className="font-display text-[27px] leading-none text-[#6b5850]">
            Todas as clientes
          </h2>

          <span className="rounded-full bg-[#f6ede8] px-2.5 py-1 text-[9px] font-bold text-[#a98d81]">
            {count}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative w-full lg:w-[310px]">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bda79d]" />

          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar nome, telefone ou e-mail..."
            className="h-11 w-full rounded-[15px] border border-[#f0e6df] bg-[#faf6f3] pl-11 pr-10 text-[11px] text-[#6b5850] outline-none placeholder:text-[#c4afa5] focus:bg-white"
          />

          {search && (
            <button
              type="button"
              onClick={() => onSearch('')}
              className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[#bda79d] hover:bg-[#f3e9e4]"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => onStatus(filter)}
              className={[
                'shrink-0 rounded-full px-4 py-2 text-[9px] font-bold transition',
                status === filter
                  ? 'bg-[#8a6f63] text-white'
                  : 'border border-[#eee5df] bg-[#faf6f3] text-[#ad9489] hover:bg-white',
              ].join(' ')}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
