import { FinancialReport, FinancialTransaction, financialMock } from '@/data/financial';
import type { FinancialReportData } from '@/lib/exportFinancialReport';

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  }).format(value);
}

export function getFinancialReport(): FinancialReport {
  return financialMock;
}

export function getProfitMargin(report: FinancialReport) {
  if (report.revenue <= 0) return 0;

  return (report.profit / report.revenue) * 100;
}

export function getBestRevenueDay(transactions: FinancialTransaction[]) {
  const incomeByDay = new Map<string, number>();

  for (const transaction of transactions) {
    if (transaction.type !== 'income') continue;

    const day = transaction.date.toISOString().slice(0, 10);

    incomeByDay.set(day, (incomeByDay.get(day) ?? 0) + transaction.value);
  }

  let bestDay: string | null = null;
  let bestValue = 0;

  for (const [day, value] of incomeByDay) {
    if (value > bestValue) {
      bestDay = day;
      bestValue = value;
    }
  }

  if (!bestDay) {
    return null;
  }

  return {
    date: new Date(`${bestDay}T12:00:00`),
    value: bestValue,
  };
}

export function getPaymentMethodPercentages(transactions: FinancialTransaction[]) {
  const income = transactions.filter((transaction) => transaction.type === 'income');

  const total = income.reduce((sum, transaction) => sum + transaction.value, 0);

  if (total === 0) return [];

  const grouped = new Map<string, number>();

  for (const transaction of income) {
    grouped.set(transaction.method, (grouped.get(transaction.method) ?? 0) + transaction.value);
  }

  return [...grouped.entries()]
    .map(([method, value]) => ({
      method,
      value,
      percentage: (value / total) * 100,
    }))
    .sort((a, b) => b.value - a.value);
}

export function toFinancialReportData(report: FinancialReport): FinancialReportData {
  return {
    period: report.period,
    revenue: report.revenue,
    expenses: report.expenses,
    profit: report.profit,
    appointments: report.appointments,
    averageTicket: report.averageTicket,

    appointmentsData: report.appointmentsData.map((appointment) => ({
      date: appointment.date,

      client: 'Cliente',

      service: appointment.title,

      value: appointment.price ?? 0,
      status: 'Confirmado',
    })),
  };
}
