import { ArrowUpRight, UserPlus } from 'lucide-react';

export function ClientHeader({ onNewClient }: { onNewClient: () => void }) {
  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold uppercase tracking-[0.34em] text-[#c2a99d]">
            Minea
          </span>

          <span className="h-1 w-1 rounded-full bg-[#dcbfb1]" />

          <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#cdb9ae]">
            Gestão & Bem-estar
          </span>
        </div>

        <h1 className="mt-3 font-display text-[34px] leading-none tracking-[-0.03em] text-[#6b5850] lg:text-[40px]">
          Clientes
        </h1>

        <p className="mt-3 max-w-md text-xs leading-relaxed text-[#a48a7f]">
          Gerencie sua base, acompanhe relacionamentos e mantenha suas clientes sempre próximas.
        </p>
      </div>

      <button
        type="button"
        onClick={onNewClient}
        className="group flex h-12 items-center justify-between gap-4 rounded-[17px] bg-[#8a6f63] px-4 text-[12px] font-bold text-white shadow-[0_18px_35px_-18px_rgba(138,111,99,.55)] transition hover:-translate-y-0.5 hover:bg-[#7c6156]"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-[11px] bg-white/15">
            <UserPlus size={16} />
          </span>
          Novo cliente
        </span>

        <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5" />
      </button>
    </header>
  );
}
