'use client';

import { useMemo, useState } from 'react';

import { AdminShell } from '@/components/admin/AdminShell';
import { FinanceBreakdown } from '@/components/admin/financial/FinanceBreakdown';
import { FinanceFilters } from '@/components/admin/financial/FinanceFilters';
import { FinanceHeader } from '@/components/admin/financial/FinanceHeader';
import { FinanceInsights } from '@/components/admin/financial/FinanceInsights';
import { FinanceStats } from '@/components/admin/financial/FinanceStats';
import { RevenueChart } from '@/components/admin/financial/RevenueChart';
import { TransactionsList } from '@/components/admin/financial/TransactionsList';
import { getBestRevenueDay, getPaymentMethodPercentages, getProfitMargin } from '@/lib/financial';
import type { FinancialReport } from '@/types';

type Period = 'Hoje' | '7 dias' | 'Este mês' | 'Últimos 6 meses';

type Props = {
  report: FinancialReport;
};

export default function FinanceiroClient({ report }: Props) {
  const [period, setPeriod] = useState<Period>('Este mês');

  const margin = useMemo(() => getProfitMargin(report), [report]);

  const bestDay = useMemo(() => getBestRevenueDay(report.transactions), [report.transactions]);

  const paymentMethods = useMemo(
    () => getPaymentMethodPercentages(report.transactions),
    [report.transactions],
  );

  return (
    <AdminShell>
      <main className="min-h-screen bg-[#faf6f3] text-[#6b5850]">
        <div className="mx-auto max-w-[1500px] px-5 py-7 lg:px-8">
          <FinanceHeader report={report} />

          <FinanceFilters period={period} onChange={setPeriod} label={report.period.label} />

          <FinanceStats report={report} />

          <section className="mt-6 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
            <RevenueChart report={report} />

            <FinanceBreakdown report={report} margin={margin} />
          </section>

          <TransactionsList transactions={report.transactions} />

          <FinanceInsights bestDay={bestDay} paymentMethods={paymentMethods} />
        </div>
      </main>
    </AdminShell>
  );
}
