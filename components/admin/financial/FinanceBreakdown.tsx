import { ArrowDownRight, ArrowUpRight, DollarSign } from 'lucide-react';

import { formatCurrency } from '@/lib/financial';
import type { FinancialReport } from '@/types';

type Props = {
  report: FinancialReport;
  margin: number;
};

export function FinanceBreakdown({ report, margin }: Props) {
  return (
    <section className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur lg:p-6">
      <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#c2a99d]">Resumo</p>

      <h2 className="mt-2 font-display text-[27px] text-[#6b5850]">Entradas & saídas</h2>

      <div className="mt-7 space-y-4">

        <Item
          icon={ArrowDownRight}
          label="Entradas"
          description="Serviços realizados"
          value={formatCurrency(report.revenue)}
          positive
        />

        <Item
          icon={ArrowUpRight}
          label="Despesas"
          description="Custos operacionais"
          value={formatCurrency(report.expenses)}
        />

        <div className="h-px bg-[#f1e8e2]" />

        <div className="rounded-[21px] bg-[#f6ede8] p-4">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#b49b90]">
                Resultado
              </p>

              <p className="mt-1 font-display text-[25px] text-[#6b5850]">
                {formatCurrency(report.profit)}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-white/70 text-[#a98d81]">
              <DollarSign size={18} />
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-[#a98d81]"
              style={{
                width: `${Math.min(Math.max(margin, 0), 100)}%`,
              }}
            />
          </div>

          <p className="mt-2 text-[9px] text-[#b49b90]">
            {margin.toFixed(0)}% da receita permanece após despesas.
          </p>
        </div>
      </div>
    </section>
  );
}

function Item({
  icon: Icon,
  label,
  description,
  value,
  positive = false,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={[
          `flex h-11 w-11 items-center justify-center rounded-[15px]`,
          positive ? 'bg-[#edf4ee] text-[#66806d]' : 'bg-[#f8eeea] text-[#a68173]',
        ].join(' ')}
      >
        <Icon size={16} />
      </div>

      <div className="flex-1">
        <p className="text-[11px] font-bold text-[#6b5850]">{label}</p>

        <p className="text-[9px] text-[#b49b90]">{description}</p>

      </div>

      <strong className="text-[11px] text-[#80685e]">{value}</strong>
    </div>
  );
}
