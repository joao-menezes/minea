'use client';

import { useMemo, useRef, useState } from 'react';

import { AdminShell } from '@/components/admin/AdminShell';
import { FinanceBreakdown } from '@/components/admin/financial/FinanceBreakdown';
import { FinanceFilters } from '@/components/admin/financial/FinanceFilters';
import { FinanceHeader } from '@/components/admin/financial/FinanceHeader';
import { FinanceInsights } from '@/components/admin/financial/FinanceInsights';
import { FinanceStats } from '@/components/admin/financial/FinanceStats';
import { NewTransactionModal } from '@/components/admin/financial/NewTransactionModal';
import { RevenueChart } from '@/components/admin/financial/RevenueChart';
import { TransactionsList } from '@/components/admin/financial/TransactionsList';
import { getFinancialReport } from '@/lib/api/financial';
import {
  getBestRevenueDay,
  getFinancialPeriodDates,
  getMonthValue,
  getPaymentMethodPercentages,
  getProfitMargin,
} from '@/lib/financial';
import type { FinancialReport } from '@/types';
import type { Period } from '@/components/admin/financial/FinanceFilters';

type Props = {
  report: FinancialReport;
};

export default function FinanceiroClient({ report }: Props) {
  const [period, setPeriod] = useState<Period>('Este mês');
  const [month, setMonth] = useState(() => getMonthValue(new Date()));
  const [currentReport, setCurrentReport] = useState(report);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newTransactionOpen, setNewTransactionOpen] = useState(false);
  const requestId = useRef(0);

  const margin = useMemo(() => getProfitMargin(currentReport), [currentReport]);

  const bestDay = useMemo(
    () => getBestRevenueDay(currentReport.transactions),
    [currentReport.transactions],
  );

  const paymentMethods = useMemo(
    () => getPaymentMethodPercentages(currentReport.transactions),
    [currentReport.transactions],
  );

  async function loadReport(nextPeriod: Period, nextMonth: string) {
    const currentRequestId = ++requestId.current;

    try {
      setLoading(true);
      setError('');

      const { startDate, endDate } = getFinancialPeriodDates(nextPeriod, nextMonth);
      const nextReport = await getFinancialReport(startDate, endDate);

      if (currentRequestId === requestId.current) {
        setCurrentReport(nextReport);
      }
    } catch (reason) {
      console.error('Erro ao carregar relatório financeiro:', reason);
      if (currentRequestId === requestId.current) {
        setError(
          reason instanceof Error ? reason.message : 'Não foi possível atualizar o relatório.',
        );
      }
    } finally {
      if (currentRequestId === requestId.current) {
        setLoading(false);
      }
    }
  }

  function handlePeriodChange(nextPeriod: Period) {
    setPeriod(nextPeriod);
    void loadReport(nextPeriod, month);
  }

  function handleMonthChange(nextMonth: string) {
    setMonth(nextMonth);
    void loadReport(period, nextMonth);
  }

  return (
    <AdminShell>
      <main className="min-h-screen bg-[#faf6f3] text-[#6b5850]">
        <div className="mx-auto max-w-[1500px] px-5 py-7 lg:px-8">
          <FinanceHeader
            report={currentReport}
            onNewTransaction={() => setNewTransactionOpen(true)}
          />

          <FinanceFilters
            period={period}
            onChange={handlePeriodChange}
            label={currentReport.period.label}
            month={month}
            onMonthChange={handleMonthChange}
          />

          {error && (
            <div className="mt-4 rounded-[14px] border border-[#ead3cf] bg-[#fff5f3] px-4 py-3 text-[10px] font-semibold text-[#a45f59]">
              {error}
            </div>
          )}

          <div className={loading ? 'opacity-60 transition-opacity' : ''}>
            <FinanceStats report={currentReport} />

            <section className="mt-6 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
              <RevenueChart report={currentReport} />

              <FinanceBreakdown report={currentReport} margin={margin} />
            </section>

            <TransactionsList transactions={currentReport.transactions} />

            <FinanceInsights bestDay={bestDay} paymentMethods={paymentMethods} />
          </div>
        </div>

        <NewTransactionModal
          open={newTransactionOpen}
          onClose={() => setNewTransactionOpen(false)}
          onCreated={() => {
            void loadReport(period, month);
          }}
        />
      </main>
    </AdminShell>
  );
}
