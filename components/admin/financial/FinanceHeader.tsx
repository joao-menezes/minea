import { FileDown, Plus } from 'lucide-react';

import { exportFinancialReport } from '@/lib/exportFinancialReport';
import { toFinancialReportData } from '@/lib/financial';
import type { FinancialReport } from '@/types';

type Props = {
  report: FinancialReport;
};

export function FinanceHeader({ report }: Props) {
  function handleExport() {
    exportFinancialReport(toFinancialReportData(report));
  }

  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold uppercase tracking-[0.34em] text-[#c2a99d]">
            Minea
          </span>

          <span className="h-1 w-1 rounded-full bg-[#dcbfb1]" />

          <span className="text-[9px] uppercase tracking-[0.18em] text-[#cdb9ae]">
            Gestão financeira
          </span>
        </div>

        <h1 className="mt-3 font-display text-[32px] leading-none tracking-[-0.03em] text-[#6b5850] lg:text-[39px]">
          Financeiro
        </h1>

        <p className="mt-3 text-xs text-[#a48a7f]">
          Acompanhe o desempenho financeiro da sua clínica.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleExport}
          className="flex h-11 items-center gap-2 rounded-[16px] border border-[#eaded8] bg-white/80 px-4 text-[11px] font-bold text-[#80685e] shadow-sm transition hover:-translate-y-0.5"
        >
          <FileDown size={15} />
          Exportar PDF
        </button>

        <button className="flex h-11 items-center gap-3 rounded-[16px] bg-[#8a6f63] px-4 text-[11px] font-bold text-white transition hover:bg-[#7c6156]">
          <span className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-white/15">
            <Plus size={15} />
          </span>
          Nova movimentação
        </button>
      </div>
    </header>
  );
}
