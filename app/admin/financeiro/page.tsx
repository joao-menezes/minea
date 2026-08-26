'use client';

import { useEffect, useState } from 'react';

import { getFinancialReport } from '@/lib/financial';
import type { FinancialReport } from '@/types';

import FinanceiroClient from './FinanceiroClient';

export default function FinanceiroPage() {
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getFinancialReport()
      .then(setReport)
      .catch((reason: unknown) => {
        console.error('Erro ao carregar financeiro:', reason);
        setError(
          reason instanceof Error ? reason.message : 'Não foi possível carregar o financeiro.',
        );
      });
  }, []);

  if (!report) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf6f3] text-sm text-[#80665c]">
        {error || 'Carregando financeiro...'}
      </main>
    );
  }

  return <FinanceiroClient report={report} />;
}
