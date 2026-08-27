import { Receipt, TrendingDown, TrendingUp, Wallet } from 'lucide-react';

import { FinancialStat } from '@/components/admin/financial/FinancialStat';
import { formatCurrency } from '@/lib/financial';
import type { FinancialReport } from '@/types';

type Props = {
  report: FinancialReport;
};

export function FinanceStats({ report }: Props) {
  return (
    <section className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
      <FinancialStat
        label="Faturamento"
        value={formatCurrency(report.revenue)}
        description="Total recebido no período"
        icon={TrendingUp}
      />

      <FinancialStat
        label="Despesas"
        value={formatCurrency(report.expenses)}
        description="Custos operacionais"
        icon={TrendingDown}
        positive={false}
      />

      <FinancialStat
        label="Lucro estimado"
        value={formatCurrency(report.profit)}
        description="Receita menos despesas"
        icon={Wallet}
      />

      <FinancialStat
        label="Ticket médio"
        value={formatCurrency(report.averageTicket)}
        description={`${report.appointments} atendimentos`}
        icon={Receipt}
      />
    </section>
  );
}
