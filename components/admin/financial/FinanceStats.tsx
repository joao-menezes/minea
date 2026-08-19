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
        trend="+12,4%"
        icon={TrendingUp}
      />

      <FinancialStat
        label="Despesas"
        value={formatCurrency(report.expenses)}
        description="Custos operacionais"
        trend="-6,2%"
        icon={TrendingDown}
        positive={false}
      />

      <FinancialStat
        label="Lucro estimado"
        value={formatCurrency(report.profit)}
        description="Receita menos despesas"
        trend="+16,8%"
        icon={Wallet}
      />

      <FinancialStat
        label="Ticket médio"
        value={formatCurrency(report.averageTicket)}
        description={`${report.appointments} atendimentos`}
        trend="+4,6%"
        icon={Receipt}
      />
    </section>
  );
}
