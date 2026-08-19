import { FinancialReportData } from '@/lib/exportFinancialReport';
import type { FinancialReport } from '@/types';

import { apiFetch } from './api/client';

export type FinancialReportResponse = FinancialReport;

export async function getFinancialReport(
  startDate?: Date,
  endDate?: Date,
): Promise<FinancialReportResponse> {
  const params = new URLSearchParams();

  if (startDate) {
    params.set('startDate', startDate.toISOString());
  }

  if (endDate) {
    params.set('endDate', endDate.toISOString());
  }

  const query = params.toString();

  return apiFetch<FinancialReportResponse>(`/financial/report${query ? `?${query}` : ''}`);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export type BestRevenueDay = {
  date: Date;
  value: number;
};

export type PaymentMethodPercentage = {
  method: FinancialReport['transactions'][number]['method'];
  total: number;
  percentage: number;
};

export function getBestRevenueDay(
  transactions: FinancialReport['transactions'],
): BestRevenueDay | null {
  const dailyRevenue = new Map<string, BestRevenueDay>();

  for (const transaction of transactions) {
    if (transaction.type !== 'income') {
      continue;
    }

    const date = new Date(transaction.date);

    const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-');

    const current = dailyRevenue.get(key);

    if (current) {
      current.value += transaction.value;
    } else {
      dailyRevenue.set(key, {
        date,
        value: transaction.value,
      });
    }
  }

  const days = Array.from(dailyRevenue.values());

  if (days.length === 0) {
    return null;
  }

  return days.reduce((best, current) => (current.value > best.value ? current : best));
}

export function getPaymentMethodPercentages(
  transactions: FinancialReport['transactions'],
): PaymentMethodPercentage[] {
  const totals = new Map<FinancialReport['transactions'][number]['method'], number>();

  for (const transaction of transactions) {
    if (transaction.type !== 'income' || !transaction.method) {
      continue;
    }

    totals.set(transaction.method, (totals.get(transaction.method) ?? 0) + transaction.value);
  }

  const total = Array.from(totals.values()).reduce((sum, value) => sum + value, 0);

  if (total <= 0) {
    return [];
  }

  return Array.from(totals.entries())
    .map(([method, value]) => ({
      method,
      total: value,
      percentage: Math.round((value / total) * 100),
    }))
    .sort((a, b) => b.total - a.total);
}

export function getProfitMargin(report: FinancialReport): number {
  if (report.revenue <= 0) {
    return 0;
  }

  return (report.profit / report.revenue) * 100;
}

export function toFinancialReportData(report: FinancialReport): FinancialReportData {
  return {
    period: report.period.label,

    revenue: report.revenue,
    expenses: report.expenses,
    profit: report.profit,

    averageTicket: report.averageTicket,
    appointments: report.appointments,

    transactions: report.transactions.map((transaction) => ({
      id: transaction.id,
      date: transaction.date,
      description: transaction.description,
      client: transaction.client ?? '',
      method: transaction.method,
      category: transaction.category,
      value: transaction.value,
      type: transaction.type,
    })),

    monthlyRevenue: report.monthlyRevenue,

    appointmentsData: report.appointmentsData,
  };
}
