import type {
  CreateFinancialTransactionData,
  FinancialReport,
  FinancialTransaction,
} from '@/types';

import { apiFetch } from './client';

export async function createFinancialTransaction(
  data: CreateFinancialTransactionData,
): Promise<FinancialTransaction> {
  return apiFetch<FinancialTransaction>('/financial/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getFinancialReport(
  startDate?: Date,
  endDate?: Date,
): Promise<FinancialReport> {
  const params = new URLSearchParams();

  if (startDate) {
    params.set('startDate', startDate.toISOString());
  }

  if (endDate) {
    params.set('endDate', endDate.toISOString());
  }

  const query = params.toString();

  return apiFetch<FinancialReport>(`/financial/report${query ? `?${query}` : ''}`);
}
