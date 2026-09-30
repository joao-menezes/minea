'use client';

import { useEffect, useState } from 'react';

import { notFound } from 'next/navigation';

import { ApiRequestError } from '@/lib/api/client';
import { getFinancialReport } from '@/lib/api/financial';
import { getFinancialPeriodDates, getMonthValue } from '@/lib/financial';
import type { FinancialReport } from '@/types';

import FinanceiroClient from './FinanceiroClient';

export default function FinanceiroPage() {
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [error, setError] = useState('');
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    const month = getMonthValue(new Date());
    const { startDate, endDate } = getFinancialPeriodDates('Este mês', month);

    getFinancialReport(startDate, endDate)
      .then(setReport)
      .catch((reason: unknown) => {
        if (reason instanceof ApiRequestError && (reason.status === 401 || reason.status === 403)) {
          // Sem sessão de admin: mostra 404 em vez de revelar que essa rota existe.
          setDenied(true);
          return;
        }

        console.error('Erro ao carregar financeiro:', reason);
        setError(
          reason instanceof Error ? reason.message : 'Não foi possível carregar o financeiro.',
        );
      });
  }, []);

  if (denied) {
    notFound();
  }

  if (!report) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf6f3] text-sm text-[#80665c]">
        {error || 'Carregando financeiro...'}
      </main>
    );
  }

  return <FinanceiroClient report={report} />;
}
